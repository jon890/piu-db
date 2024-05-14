import ContentBox from "@/components/layout/content-box";
import SelectLevel from "@/components/records/select-level";
import CookieUtil from "@/server/utils/cookie-util";
import SyncRecentlyPlayedButton from "./(sync-recently-played)/sync-recently-played.button";
import SyncMyBestScoreButton from "./(sync-my-best-score)/sync-my-best-score.button";

export default async function RecordPage() {
  const piuAuthValue = await CookieUtil.getPiuAuthValue();

  return (
    <ContentBox title="내 기록">
      <div className="flex flex-col max-w-screen-sm justify-center items-center gap-5 sm:gap-10">
        <div className="flex-row flex gap-3 flex-wrap justify-center items-center">
          <SyncRecentlyPlayedButton piuAuth={piuAuthValue} />
          <SyncMyBestScoreButton piuAuth={piuAuthValue} />
        </div>

        <SelectLevel />
      </div>
    </ContentBox>
  );
}
