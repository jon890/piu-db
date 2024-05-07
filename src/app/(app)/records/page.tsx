import ContentBox from "@/components/layout/content-box";
import SelectLevel from "@/components/records/selet-level";
import CookieUtil from "@/server/utils/cookie-util";
import SyncRecentlyPlayedButton from "./(sync-recently-played)/sync-recently-played.button";
import SyncMyBestScoreButton from "./(sync-my-best-score)/sync-my-best-score.button";

type Props = {};

export default async function RecordPage({}: Props) {
  const piuAuthValue = await CookieUtil.getPiuAuthValue();

  return (
    <ContentBox title="내 기록">
      <div className="flex-row flex gap-3 flex-wrap">
        <SyncRecentlyPlayedButton piuAuth={piuAuthValue} />
        <SyncMyBestScoreButton piuAuth={piuAuthValue} />
      </div>
      <div className="flex flex-row justify-center items-center gap-3 flex-wrap">
        <SelectLevel />
      </div>
    </ContentBox>
  );
}
