import ContentBox from "@/components/layout/content-box";
import SelectChartType from "@/components/records/select-chart-type";
import SelectLevel from "@/components/records/select-level";
import AuthUtil from "@/server/utils/auth-util";
import CookieUtil from "@/server/utils/cookie-util";
import { ChartType } from "@prisma/client";
import { notFound } from "next/navigation";
import SyncMyBestScoreButton from "../../(sync-my-best-score)/sync-my-best-score.button";
import SyncRecentlyPlayedButton from "../../(sync-recently-played)/sync-recently-played.button";
import { getLevelRecordsBy } from "./get-records";
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
  const levelRecords = CHART_TYPE
    ? await getLevelRecordsBy(userSeq, targetLevel, CHART_TYPE)
    : [];

  return (
    <ContentBox title="내 기록">
      <div className="flex flex-col max-w-screen-sm justify-center items-center gap-5 sm:gap-10">
        <div className="flex-row flex gap-3 flex-wrap justify-center items-center">
          <SyncRecentlyPlayedButton piuAuth={piuAuthValue} />
          <SyncMyBestScoreButton piuAuth={piuAuthValue} />
        </div>

        <SelectLevel targetLevel={targetLevel} />
        <SelectChartType level={targetLevel} chartType={CHART_TYPE} />

        {CHART_TYPE ? (
          levelRecords.length > 0 ? (
            <LevelRecordsDetail levelRecords={levelRecords} />
          ) : (
            <p className="text-gray-500">해당 레벨에 노래가 없습니다</p>
          )
        ) : (
          <p className="text-gray-500">싱글 더블을 선택해주세요</p>
        )}
      </div>
    </ContentBox>
  );
}
