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

  const records = CHART_TYPE
    ? await getRecordsBy(userSeq, targetLevel, CHART_TYPE)
    : [];
  const piuAuthValue = await CookieUtil.getPiuAuthValue();

  return (
    <ContentBox title="내 기록">
      <SyncRecordButton piuAuth={piuAuthValue} />
      <SelectLevel targetLevel={targetLevel} />
      <SelectChartType level={targetLevel} chartType={CHART_TYPE} />

      {CHART_TYPE ? (
        <div className="flex flex-row justify-center items-center gap-1 flex-wrap">
          {records.map((song) => (
            <RecordBox song={song} key={song.seq} />
          ))}
        </div>
      ) : (
        <p>싱글 더블을 선택해주세요</p>
      )}
    </ContentBox>
  );
}
