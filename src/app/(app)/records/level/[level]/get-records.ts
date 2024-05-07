import ChartDB from "@/server/prisma/chart.db";
import RecordDB, { MaxRecord } from "@/server/prisma/record.db";
import ArrayUtil from "@/utils/array.util";
import { Chart, ChartType } from "@prisma/client";

export async function getLevelRecordsBy(
  userSeq: number,
  level: number,
  chartType: ChartType
) {
  function predicateChart(chart: Chart) {
    let filter = chart.level === level;
    if (chartType && chart.chartType !== chartType) filter = false;
    return filter;
  }

  const allSongs = await ChartDB.findAllGroupBySong();

  const targetSongs = allSongs
    .filter((song) => song.charts?.find(predicateChart))
    .map((song) => ({
      ...song,
      chart: song.charts?.find(predicateChart),
    }));

  const chartSeqs = targetSongs
    .map((song) => song.chart?.seq ?? null)
    .filter(ArrayUtil.notEmpty);

  if (chartSeqs.length === 0) {
    return [];
  }

  const records = await RecordDB.getMaxRecordsBy(userSeq, chartSeqs);
  const recordMap = new Map<number, MaxRecord>();
  for (const r of records) {
    recordMap.set(r.chart_seq, r);
  }

  const songWithRecord = targetSongs
    .map((song) => ({
      ...song,
      chart: song.chart
        ? { ...song.chart, record: recordMap.get(song.chart.seq) }
        : null,
    }))
    .sort((a, b) => {
      const aScore = a.chart?.record?.score ?? 0;
      const bScore = b.chart?.record?.score ?? 0;
      return bScore - aScore;
    });

  return songWithRecord;
}
