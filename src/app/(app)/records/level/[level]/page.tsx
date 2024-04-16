import classnames from "@/client/utils/classnames";
import ContentBox from "@/components/layout/content-box";
import LevelBall from "@/components/level-ball";
import AuthUtil from "@/server/utils/auth-util";
import CookieUtil from "@/server/utils/cookie-util";
import { ChartType } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import SyncRecordButton from "../../(sync-record)/sync-record.button";
import SelectLevel from "../../selet-level";
import { getRecordsBy } from "./get-records";
import RecordBox from "./record-box";

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

      <div className="flex flex-row gap-4">
        <Link href={`/records/level/${targetLevel}?CHART_TYPE=SINGLE`}>
          <LevelBall
            className={classnames(
              "size-12 sm:size-20 cursor-pointer bg-red-500",
              CHART_TYPE === "SINGLE" ? "opacity-30" : ""
            )}
            text="싱글"
            hasHover
          />
        </Link>

        <Link href={`/records/level/${targetLevel}?CHART_TYPE=DOUBLE`}>
          <LevelBall
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
            <RecordBox song={song} key={song.seq} />
          ))}
        </div>
      ) : (
        <p>싱글 더블을 선택해주세요</p>
      )}
    </ContentBox>
  );
}
