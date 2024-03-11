import prisma from "@/server/prisma/client";
import { RecentlyPlayed } from "@/types/recently-played";
import { RecordGrade, RecordPlate } from "@prisma/client";
import TimeUtil from "../utils/time-util";
import ChartDB from "./chart.db";
import SongDB from "./song.db";

function getRecentPlayToEntity(record: RecentlyPlayed) {
  return {
    score: record.score,
    perfect: record.perfect,
    great: record.great,
    good: record.good,
    bad: record.bad,
    miss: record.miss,
    playedAt: TimeUtil.convertUTC(record.playedTime).toDate(),
    maxCombo: 0,
    grade: RecordGrade[record.grade],
    plate: RecordPlate[record.plate],
  };
}

async function saveRecentRecord(
  userSeq: number,
  profileSeq: number,
  record: RecentlyPlayed
) {
  const song = await SongDB.findBySongName(record.songName);

  if (!song) {
    console.warn("Target songs not founded", record.songName);
    return;
  }
  if (record.type === "Unknown") {
    console.warn("Target song type is not single and double", record.type);
    return;
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
    return;
  }

  const entity = getRecentPlayToEntity(record);

  return prisma.record.upsert({
    create: {
      userSeq,
      piuProfileSeq: profileSeq,
      chartSeq: chart.seq,
      ...entity,
    },
    update: {},
    where: {
      chartSeq_piuProfileSeq_playedAt: {
        piuProfileSeq: profileSeq,
        chartSeq: chart.seq,
        playedAt: entity.playedAt,
      },
    },
  });
}

async function getRecords(userSeq: number, page: number) {
  const PAGE_UNIT = 50;

  const profileSeqs = await prisma.piuProfile.findMany({
    select: {
      seq: true,
    },
    where: {
      userSeq,
    },
  });

  const totalRecords = await prisma.record.aggregate({
    where: {
      piuProfileSeq: {
        in: profileSeqs.map((it) => it.seq),
      },
    },
    _count: { seq: true },
  });

  const records = await prisma.record.findMany({
    where: {
      piuProfileSeq: {
        in: profileSeqs.map((it) => it.seq),
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
    skip: (page - 1) * PAGE_UNIT,
    take: PAGE_UNIT,
  });

  const recordsWithSong = [];
  for (const record of records) {
    const chart = await ChartDB.findChartBySeqInCache(record.chartSeq);
    const song = chart?.seq ? await SongDB.findSongBySeq(chart?.songSeq) : null;

    recordsWithSong.push({
      ...record,
      chart,
      song,
    });
  }

  return {
    records: recordsWithSong,
    count: totalRecords?._count.seq,
    unit: PAGE_UNIT,
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

const RecordDB = {
  saveRecentRecord,
  getRecords,
  getMaxRecordByUserAndChartDateBetween,
};

export default RecordDB;
