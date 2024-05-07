import prisma from "@/server/prisma/client";
import { MyBestScore } from "@/types/my-best-score";
import type { Grade, Plate, RecentlyPlayed } from "@/types/recently-played";
import { Prisma, RecordGrade, RecordPlate } from "@prisma/client";
import TimeUtil from "../utils/time-util";
import ChartDB from "./chart.db";
import SongDB from "./song.db";

const RECORD_PAGE_UNIT = 50;

function getRecentPlayToEntity(record: RecentlyPlayed) {
  return {
    score: record.score,
    perfect: record.perfect,
    great: record.great,
    good: record.good,
    bad: record.bad,
    miss: record.miss,
    playedAt: TimeUtil.convertUTC(record.playedTime).toDate(),
    grade: RecordGrade[record.grade],
    plate: record.plate ? RecordPlate[record.plate] : null,
  };
}

/**
 * 최근 플레이 저장
 * @param userSeq
 * @param profileSeq
 * @param records
 * @returns
 */
async function saveRecentRecord(
  userSeq: number,
  profileSeq: number,
  records: RecentlyPlayed[]
) {
  return prisma.$transaction(async (tx) => {
    for (const record of records) {
      const song = await SongDB.findBySongName(record.songName);
      if (!song) {
        console.warn("Target songs not founded", record.songName);
        continue;
      }
      if (record.type === "Unknown") {
        console.warn("Target song type is not single and double", record.type);
        continue;
      }

      const chart = await ChartDB.findChart(
        song.seq,
        Number(record.level),
        record.type
      );
      if (!chart) {
        console.warn(
          "Target chart not founded",
          " name",
          record.songName,
          ", level",
          record.level,
          ", type",
          record.type
        );
        continue;
      }

      const entity = getRecentPlayToEntity(record);

      const exist = await tx.record.findUnique({
        where: {
          chartSeq_piuProfileSeq_playedAt: {
            piuProfileSeq: profileSeq,
            chartSeq: chart.seq,
            playedAt: entity.playedAt,
          },
        },
      });

      if (!exist) {
        await tx.record.create({
          data: {
            userSeq,
            piuProfileSeq: profileSeq,
            chartSeq: chart.seq,
            ...entity,
            isBreakOff: entity.plate == null,
          },
        });
      } else {
        break;
      }
    }
  });
}

/**
 * 해당 기간 내의 최대 기록을 찾는다
 * @param param0
 * @returns
 */
async function getMaxRecordByUserAndChartDateBetween({
  chartSeq,
  enableBreakOff,
  endDate,
  startDate,
  userSeq,
}: {
  userSeq: number;
  chartSeq: number;
  startDate: Date;
  endDate: Date;
  enableBreakOff: boolean;
}) {
  const maxRecord = await prisma.record.findFirst({
    where: {
      userSeq,
      chartSeq,
      playedAt: {
        gte: startDate,
        lte: endDate,
      },
      ...(!enableBreakOff && { isBreakOff: false }),
    },
    orderBy: {
      score: "desc",
    },
    take: 1,
  });

  return maxRecord;
}

/**
 * 노래로 기록을 찾는다
 * @param songSeq
 * @param page
 * @returns
 */
async function getRecordsBySongSeq(songSeq: number, page: number) {
  const song = await SongDB.findBySeq(songSeq);
  if (!song) return null;

  const charts = await ChartDB.findCharts(song.seq);
  if (!charts) return null;

  const chartSeqs = charts.map((it) => it.seq);

  const totalRecords = await prisma.record.aggregate({
    where: {
      chartSeq: {
        in: chartSeqs,
      },
    },
    _count: { seq: true },
  });

  const records = await prisma.record.findMany({
    where: {
      chartSeq: {
        in: chartSeqs,
      },
    },
    include: {
      piuProfile: {
        select: {
          gameId: true,
        },
      },
    },
    orderBy: {
      playedAt: "desc",
    },
    skip: (page - 1) * RECORD_PAGE_UNIT,
    take: RECORD_PAGE_UNIT,
  });

  return {
    records,
    count: totalRecords._count.seq,
    unit: RECORD_PAGE_UNIT,
  };
}

/**
 * 차트로 기록을 찾는다
 * @param chartSeq
 * @param page
 * @returns
 */
async function getRecordsByChartSeq(chartSeq: number, page: number) {
  const totalRecords = await prisma.record.aggregate({
    where: {
      chartSeq,
    },
    _count: { seq: true },
  });

  const records = await prisma.record.findMany({
    where: {
      chartSeq,
    },
    include: {
      piuProfile: {
        select: {
          gameId: true,
        },
      },
    },
    orderBy: {
      playedAt: "desc",
    },
    skip: (page - 1) * RECORD_PAGE_UNIT,
    take: RECORD_PAGE_UNIT,
  });

  return {
    records,
    count: totalRecords._count.seq,
    unit: RECORD_PAGE_UNIT,
  };
}

/**
 * 해당 차트의 최대 기록을 찾는다
 * @param userSeq
 * @param after
 * @returns
 */
async function findAllMaxRecordsGroupByChart(userSeq: number, after?: Date) {
  // 해당 유저가 등록한 차트 seq 번호
  const charts = await prisma.record.findMany({
    where: {
      userSeq,
      ...(after && {
        createdAt: {
          gte: after,
        },
      }),
    },
    distinct: "chartSeq",
    select: { chartSeq: true },
  });

  const maxRecords = [];
  for (const chart of charts) {
    const maxRecord = await prisma.record.findFirst({
      where: {
        userSeq,
        chartSeq: chart.chartSeq,
      },
      orderBy: {
        score: "desc",
      },
      select: {
        score: true,
        seq: true,
        chartSeq: true,
      },
    });

    if (maxRecord) maxRecords.push(maxRecord);
  }

  return maxRecords;
}

async function findBySeq(seq: number) {
  return prisma.record.findUnique({
    where: {
      seq,
    },
  });
}

async function findBySeqIn(seqs: number[]) {
  return prisma.record.findMany({
    where: {
      seq: {
        in: seqs,
      },
    },
  });
}

export type MaxRecord = {
  seq: number;
  chart_seq: number;
  score: number;
  grade: Grade;
  plate: Plate;
  is_break_off: number;
  played_at: Date;
};
async function getMaxRecordsBy(userSeq: number, chartSeqs: number[]) {
  return prisma.$queryRaw<MaxRecord[]>`
  SELECT 
    rec.seq, 
    rec.chart_seq,
    rec.score, 
    rec.plate, 
    rec.is_break_off, 
    rec.played_at, 
    rec.grade
  FROM td_record rec,
     (SELECT user_seq, chart_seq, max(score) as score
      FROM td_record
      WHERE user_seq = ${userSeq}
        AND chart_seq IN (${Prisma.join(chartSeqs)})
        AND is_break_off = 0
      GROUP BY user_seq, chart_seq) AS max
  WHERE rec.user_seq = max.user_seq
    AND rec.chart_seq = max.chart_seq
    AND rec.score = max.score
  `;
}

async function saveBestScores(
  userSeq: number,
  profileSeq: number,
  records: MyBestScore[]
) {
  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    const song = await SongDB.findBySongName(record.songName);
    if (!song) {
      console.warn("Target songs not founded", record.songName);
      continue;
    }
    if (record.type === "Unknown") {
      console.warn("Target song type is not single and double", record.type);
      continue;
    }

    const chart = await ChartDB.findChart(
      song.seq,
      Number(record.level),
      record.type
    );
    if (!chart) {
      console.warn(
        "Target chart not founded",
        " name",
        record.songName,
        ", level",
        record.level,
        ", type",
        record.type
      );
      continue;
    }

    const bestScore = await prisma.record.findFirst({
      where: {
        chartSeq: chart.seq,
        piuProfileSeq: profileSeq,
        type: "BEST_SCORE",
      },
    });

    if (bestScore == null || bestScore?.score > record.score) {
      await prisma.record.create({
        data: {
          grade: record.grade,
          plate: record.plate,
          score: record.score,
          chartSeq: chart.seq,
          userSeq: userSeq,
          piuProfileSeq: profileSeq,
          type: "BEST_SCORE",
        },
      });
    }
  }
}

const RecordDB = {
  saveRecentRecord,
  saveBestScores,
  getRecordsBySongSeq,
  getRecordsByChartSeq,
  getMaxRecordByUserAndChartDateBetween,
  findAllMaxRecordsGroupByChart,
  findBySeq,
  findBySeqIn,
  getMaxRecordsBy,
};

export default RecordDB;
