import classnames from "@/client/utils/classnames";
import ContentBox from "@/components/layout/content-box";
import RecordGrade from "@/components/record/record-grade";
import RecordPlate from "@/components/record/record-plate";
import ChartDB from "@/server/prisma/chart.db";
import RecordDB, { type MaxRecord } from "@/server/prisma/record.db";
import AuthUtil from "@/server/utils/auth-util";
import { notFound } from "next/navigation";
import SelectLevel from "../../selet-level";
import LevelBallSC from "@/components/level-ball.server";
import Link from "next/link";
import { ChartType } from "@prisma/client";
import { get } from "http";

async function getRecord(
  userSeq: number,
  level: number,
  chartType?: ChartType
) {
  if (!chartType) return [];

  const allSongs = await ChartDB.findAllGroupBySong();
  const targetSongs = allSongs
    .filter((song) =>
      song.charts?.find((chart) => {
        let filter = chart.level === level;
        if (chartType && chart.chartType !== chartType) filter = false;
        return filter;
      })
    )
    .map((song) => ({
      ...song,
      charts: song.charts?.filter((chart) => {
        let filter = chart.level === level;
        if (chartType && chart.chartType !== chartType) filter = false;
        return filter;
      }),
    }));

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

  return songWithRecord;
}

type Props = {
  params: {
    level: string;
  };
  searchParams: {
    CHART_TYPE?: ChartType;
  };
};

export default async function LevelRecordPage({
  params: { level: _level },
  searchParams: { CHART_TYPE },
}: Props) {
  const userSeq = await AuthUtil.getUserSeqThrows();
  const targetLevel = Number(_level);
  if (isNaN(targetLevel)) {
    notFound();
  }

  const records = await getRecord(userSeq, targetLevel, CHART_TYPE);

  return (
    <ContentBox title="내 기록">
      <SelectLevel targetLevel={targetLevel} />

      <div className="flex flex-row gap-4">
        <Link href={`/records/level/${targetLevel}?CHART_TYPE=SINGLE`}>
          <LevelBallSC
            className={classnames(
              "size-12 sm:size-20 cursor-pointer bg-red-500",
              CHART_TYPE === "SINGLE" ? "opacity-30" : ""
            )}
            text="싱글"
            hasHover
          />
        </Link>

        <Link href={`/records/level/${targetLevel}?CHART_TYPE=DOUBLE`}>
          <LevelBallSC
            className={classnames(
              "size-12 sm:size-20 cursor-pointer bg-green-500",
              CHART_TYPE === "DOUBLE" ? "opacity-30" : ""
            )}
            text="더블"
            hasHover
          />
        </Link>
      </div>

      {CHART_TYPE ? (
        <div className="flex flex-row justify-center items-center gap-1 flex-wrap">
          {records.map((song) => (
            <div
              key={song.seq}
              className={classnames(
                "flex size-14 sm:size-20 md:size-24 ounded-md bg-base-200 justify-center items-center flex-col",
                "hover:bg-gray-500 active:bg-gray-500 transition-colors px-1"
              )}
            >
              <span className="text-center text-[8px] sm:text-xs max-w-full text-ellipsis overflow-hidden whitespace-nowrap">
                {song.name}
              </span>
              {song.charts?.map((chart) => (
                <div
                  key={chart.seq}
                  className="w-full text-center text-[10px] sm:text-base flex flex-col justify-center items-center gap-1"
                >
                  <div className="flex flex-rowjustify-center items-center gap-1">
                    {chart.record?.score && (
                      <span className="text-[10px] sm:text-xs">
                        {chart.record.score}
                      </span>
                    )}

                    {chart.record?.grade && (
                      <RecordGrade
                        className="text-[8px] sm:text-xs"
                        grade={chart.record.grade}
                        isBreakOff={false}
                      />
                    )}
                  </div>

                  {chart.record?.plate && (
                    <RecordPlate
                      className="text-[10px] sm:text-xs max-w-full px-1 text-ellipsis overflow-hidden whitespace-nowrap"
                      plate={chart.record.plate}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <p>싱글 더블을 선택해주세요</p>
      )}
    </ContentBox>
  );
}
