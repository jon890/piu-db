import prisma from "@/server/prisma/client";
import { RecentlyPlayed } from "@/types/recently-played";
import { RecordGrade, RecordPlate } from "@prisma/client";
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

async function getRecords(userSeq: number, page: number) {
  const totalRecords = await prisma.record.aggregate({
    where: {
      userSeq,
    },
    _count: { seq: true },
  });

  const records = await prisma.record.findMany({
    where: {
      userSeq,
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

async function getMaxRecordByUserAndChartDateBetween(props: {
  userSeq: number;
  chartSeq: number;
  startDate: Date;
  endDate: Date;
}) {
  const { chartSeq, endDate, startDate, userSeq } = props;
  const maxRecord = await prisma.record.findFirst({
    where: {
      userSeq,
      chartSeq,
      playedAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      score: "desc",
    },
    take: 1,
  });

  return maxRecord;
}

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

async function findBySeqIn(seqs: number[]) {
  return prisma.record.findMany({
    where: {
      seq: {
        in: seqs,
      },
    },
  });
}

const RecordDB = {
  saveRecentRecord,
  getRecords,
  getRecordsBySongSeq,
  getRecordsByChartSeq,
  getMaxRecordByUserAndChartDateBetween,
  findAllMaxRecordsGroupByChart,
  findBySeqIn,
};

export default RecordDB;
