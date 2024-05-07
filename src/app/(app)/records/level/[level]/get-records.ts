import ChartDB from "@/server/prisma/chart.db";
import RecordDB, { MaxRecord } from "@/server/prisma/record.db";
import ArrayUtil from "@/utils/array.util";
import { Chart, ChartType, Song } from "@prisma/client";

export type LevelRecord = {
  song: Song;
  chart: Chart | undefined;
  record: MaxRecord | undefined;
};

export async function getLevelRecordsBy(
  userSeq: number,
  level: number,
  chartType: ChartType
): Promise<LevelRecord[]> {
  function predicateChart(chart: Chart) {
    let filter = chart.level === level;
    if (chartType && chart.chartType !== chartType) filter = false;
    return filter;
  }

  const targetSongs = (await ChartDB.findAllGroupBySong())
    .filter((song) => song.charts?.find(predicateChart))
    .map((song) => ({
      ...song,
      chart: song.charts?.find(predicateChart),
    }));

  const chartSeqs = targetSongs
    .map((song) => song.chart?.seq ?? null)
    .filter(ArrayUtil.notEmpty);
  if (chartSeqs.length === 0) return [];

  const records = await RecordDB.getMaxRecordsBy(userSeq, chartSeqs);
  const recordMap = ArrayUtil.associatedBy(
    records,
    (record) => record.chart_seq
  );

  const songWithRecord = targetSongs
    .map((song) => ({
      song,
      chart: song.chart,
      record: recordMap.get(song?.chart?.seq ?? -1),
    }))
    .sort((a, b) => {
      const aScore = a.record?.score ?? 0;
      const bScore = b.record?.score ?? 0;
      return bScore - aScore;
    });

  return songWithRecord;
}
