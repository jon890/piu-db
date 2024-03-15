import SelectSong from "@/components/select-song";
import ChartDB from "@/server/prisma/chart.db";
import SongDB from "@/server/prisma/song.db";
import { Suspense } from "react";

export default async function AllSongs() {
  return (
    <section className="flex flex-col items-center justify-start w-full h-full gap-10 px-3 py-10">
      <h1 className="text-3xl font-bold">노래 목록</h1>
      <p>노래를 선택하면 상세 기록 페이지로 이동합니다</p>

      <Suspense fallback={<p>노래를 불러오고 있습니다...</p>}>
        <SelectSongHelper />
      </Suspense>
    </section>
  );
}

async function SelectSongHelper() {
  const allSongs = await ChartDB.findAllGroupBySong();

  return (
    <SelectSong
      songWithCharts={allSongs}
      dropDowns={["piuVersion", "songType"]}
      moveSongDetail={true}
      moveChartDetail={true}
      showOnlySongs={true}
    />
  );
}
