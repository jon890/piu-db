import ContentBox from "@/components/layout/content-box";
import SelectLevel from "./selet-level";
import CookieUtil from "@/server/utils/cookie-util";
import SyncRecordButton from "./(sync-record)/sync-record.button";

type Props = {};

export default async function RecordPage({}: Props) {
  const piuAuthValue = await CookieUtil.getPiuAuthValue();

  return (
    <ContentBox title="내 기록">
      <SyncRecordButton piuAuth={piuAuthValue} />
      <div className="flex flex-row justify-center items-center gap-3 flex-wrap">
        <SelectLevel />
      </div>
    </ContentBox>
  );
}
