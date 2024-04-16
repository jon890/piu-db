import ContentBox from "@/components/layout/content-box";
import RecordBox from "@/components/records/record-box";
import SelectChartType from "@/components/records/select-chart-type";
import SelectLevel from "@/components/records/selet-level";
import AuthUtil from "@/server/utils/auth-util";
import CookieUtil from "@/server/utils/cookie-util";
import { ChartType } from "@prisma/client";
import { notFound } from "next/navigation";
import SyncRecordButton from "../../(sync-record)/sync-record.button";
import { getRecordsBy } from "./get-records";
import ArrayUtil from "@/utils/array.util";
import Decimal from "decimal.js";
import NumberUtil from "@/utils/number.util";

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
  if (isNaN(targetLevel) || targetLevel < 1 || targetLevel > 28) {
    notFound();
  }

  const songAndRecords = CHART_TYPE
    ? await getRecordsBy(userSeq, targetLevel, CHART_TYPE)
    : [];
  const piuAuthValue = await CookieUtil.getPiuAuthValue();

  const records = songAndRecords
    .map((it) => it.chart?.record)
    .filter(ArrayUtil.notEmpty);

  const avgScores =
    records.length === 0
      ? 0
      : records
          .reduce((acc, cur) => {
            return acc.plus(cur.score);
          }, new Decimal(0))
          .div(records.length);

  return (
    <ContentBox title="내 기록">
      <SyncRecordButton piuAuth={piuAuthValue} />
      <SelectLevel targetLevel={targetLevel} />
      <SelectChartType level={targetLevel} chartType={CHART_TYPE} />

      {CHART_TYPE ? (
        <>
          <div className="flex flex-row justify-center items-center gap-3 flex-wrap">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">점수 평균</h2>
                <p className="text-center">
                  {NumberUtil.formatScore(avgScores)}
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">클리어</h2>
                <p className="text-center">
                  {records.length} / {songAndRecords.length}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-center items-center gap-1 flex-wrap">
            {songAndRecords.map((song) => (
              <RecordBox song={song} key={song.seq} />
            ))}
          </div>
        </>
      ) : (
        <p>싱글 더블을 선택해주세요</p>
      )}
    </ContentBox>
  );
}
