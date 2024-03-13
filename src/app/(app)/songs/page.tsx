import SelectSong from "@/components/select-song";
import SongDB from "@/server/prisma/song.db";

export default async function AllSongs() {
  const allSongs = await SongDB.findAll();

  return (
    <section className="flex flex-col items-center justify-start w-full h-full gap-10 px-3 py-10">
      <h1 className="text-3xl font-bold">노래 목록</h1>
      <p>노래를 선택하면 상세 기록 페이지로 이동합니다</p>
      <SelectSong
        songWithCharts={allSongs}
        dropDowns={["piuVersion", "songType"]}
      />
    </section>
  );
}
