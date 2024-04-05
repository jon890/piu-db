import classnames from "@/client/utils/classnames";
import ContentBox from "@/components/layout/content-box";
import RecordGrade from "@/components/record/record-grade";
import RecordPlate from "@/components/record/record-plate";
import ChartDB from "@/server/prisma/chart.db";
import RecordDB, { type MaxRecord } from "@/server/prisma/record.db";
import AuthUtil from "@/server/utils/auth-util";
import { notFound } from "next/navigation";
import SelectLevel from "../../selet-level";

async function getSongs(level: number) {
  const allSongs = await ChartDB.findAllGroupBySong();
  const targetSongs = allSongs
    .filter((song) => song.charts?.find((chart) => chart.level === level))
    .map((song) => ({
      ...song,
      charts: song.charts?.filter((chart) => chart.level === level),
    }));
  return targetSongs;
}

type Props = {
  params: {
    level: string;
  };
};

export default async function LevelRecordPage({
  params: { level: _level },
}: Props) {
  const userSeq = await AuthUtil.getUserSeqThrows();
  const targetLevel = Number(_level);
  if (isNaN(targetLevel)) {
    notFound();
  }

  const targetSongs = await getSongs(targetLevel);
  const chartSeqs = targetSongs
    .map((song) => song.charts?.map((chart) => chart.seq) ?? [])
    .flat();
  const records = await RecordDB.getMaxRecordsBy(userSeq, chartSeqs);
  const recordMap = new Map<number, MaxRecord>();
  for (const r of records) {
    recordMap.set(r.chart_seq, r);
  }

  const songWithRecord = targetSongs
    .map((song) => ({
      ...song,
      charts: song.charts?.map((chart) => ({
        ...chart,
        record: recordMap.get(chart.seq),
      })),
    }))
    .sort((a, b) => {
      const aScore = a.charts?.[0].record?.score ?? 0;
      const bScore = b.charts?.[0].record?.score ?? 0;
      return bScore - aScore;
    });

  return (
    <ContentBox title="내 기록">
      <SelectLevel targetLevel={targetLevel} />

      <div className="flex flex-row justify-center items-center gap-1 flex-wrap">
        {songWithRecord.map((song) => (
          <div
            key={song.seq}
            className={classnames(
              "flex size-32 rounded-md bg-base-200 justify-center items-center flex-col",
              "hover:bg-gray-500 active:bg-gray-500 transition-colors"
            )}
          >
            <span className="text-center text-xs">{song.name}</span>
            {song.charts?.map((chart) => (
              <div
                key={chart.seq}
                className="text-center flex flex-col justify-center items-center gap-1"
              >
                <span>{recordMap.get(chart.seq)?.score}</span>
                {chart.record?.grade && (
                  <RecordGrade
                    className="text-xs"
                    grade={chart.record.grade}
                    isBreakOff={false}
                  />
                )}
                {chart.record?.plate && (
                  <RecordPlate className="text-xs" plate={chart.record.plate} />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </ContentBox>
  );
}
