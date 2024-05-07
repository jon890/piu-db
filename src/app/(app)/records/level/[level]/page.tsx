import ContentBox from "@/components/layout/content-box";
import SelectChartType from "@/components/records/select-chart-type";
import SelectLevel from "@/components/records/selet-level";
import AuthUtil from "@/server/utils/auth-util";
import CookieUtil from "@/server/utils/cookie-util";
import { ChartType } from "@prisma/client";
import { notFound } from "next/navigation";
import SyncRecordButton from "../../(sync-record)/sync-record.button";
import { getRecordsBy } from "./get-records";
import RecordList from "@/components/records/record-list";
import ArrayUtil from "@/utils/array.util";
import Decimal from "decimal.js";
import Card from "@/components/common/card";
import NumberUtil from "@/utils/number.util";
import CheckBox from "@/components/common/check-box";
import LevelRecordsDetail from "./level-records-detail";

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
  const piuAuthValue = await CookieUtil.getPiuAuthValue();
  const songAndRecords = CHART_TYPE
    ? await getRecordsBy(userSeq, targetLevel, CHART_TYPE)
    : [];

  return (
    <ContentBox title="내 기록">
      <SyncRecordButton piuAuth={piuAuthValue} />
      <SelectLevel targetLevel={targetLevel} />
      <SelectChartType level={targetLevel} chartType={CHART_TYPE} />

      {CHART_TYPE ? (
        <LevelRecordsDetail songAndRecords={songAndRecords} />
      ) : (
        <p>싱글 더블을 선택해주세요</p>
      )}
    </ContentBox>
  );
}
