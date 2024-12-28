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

  const breakOnMaxRecords = await RecordDB.getMaxRecordsBy(
    userSeq,
    chartSeqs,
    true
  );

  const breakOnMaxRecordMap = ArrayUtil.associatedBy(
    breakOnMaxRecords,
    (record) => record.chart_seq
  );
  const maxRecords = await RecordDB.getMaxRecordsBy(userSeq, chartSeqs);
  const maxRecordMap = ArrayUtil.associatedBy(
    maxRecords,
    (record) => record.chart_seq
  );

  const songWithRecord = targetSongs
    .map((song) => {
      const chartSeq = song?.chart?.seq;
      if (!chartSeq) throw Error("오류 발생");

      const breakOnMaxRecord = breakOnMaxRecordMap.get(chartSeq);
      const maxRecord = maxRecordMap.get(chartSeq);

      return {
        song,
        chart: song.chart,
        record: breakOnMaxRecord ?? maxRecord,
      };
    })
    .sort((a, b) => {
      const aScore = a.record?.score ?? 0;
      const bScore = b.record?.score ?? 0;
      return bScore - aScore;
    });

  return songWithRecord;
}
