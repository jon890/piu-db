import ContentBox from "@/components/layout/content-box";
import SelectSong from "@/components/select-song";
import ChartDB from "@/server/prisma/chart.db";
import { Suspense } from "react";

export default async function AllSongs() {
  return (
    <ContentBox title="노래 목록">
      <p>노래를 선택하면 상세 기록 페이지로 이동합니다</p>

      <Suspense fallback={<p>노래를 불러오고 있습니다...</p>}>
        <SelectSongWrapper />
      </Suspense>
    </ContentBox>
  );
}

async function SelectSongWrapper() {
  const allSongs = await ChartDB.findAllGroupBySong();

  return (
    <SelectSong
      songWithCharts={allSongs}
      dropDowns={["piuVersion", "songType", "chartType"]}
      moveSongDetail={true}
      moveChartDetail={false}
    />
  );
}
