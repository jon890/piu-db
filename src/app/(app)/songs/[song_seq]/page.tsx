import RecordTable from "@/components/record-table";
import SongCard from "@/components/song-card";
import ChartDB from "@/server/prisma/chart.db";
import RecordDB from "@/server/prisma/record.db";
import SongDB from "@/server/prisma/song.db";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

type Props = {
  params: { song_seq: string };
  searchParams: {
    page?: string;
  };
};

export default async function SongDetailPage({
  params: { song_seq },
  searchParams: { page },
}: Props) {
  const songSeq = Number(song_seq);
  const song = await SongDB.findSongBySeqInCache(songSeq);

  if (!song) {
    notFound();
  }

  const charts = (await ChartDB.findCharts(songSeq)) ?? [];

  if (!page) {
    redirect(`/songs/${songSeq}?page=1`);
  }

  const currentPage = Number(page);
  const recordsWithPage = await RecordDB.getRecordsBySongSeq(
    songSeq,
    currentPage
  );

  return (
    <div className="flex flex-col items-center justify-start w-full h-full gap-10 px-3 py-10">
      <h1 className="text-3xl font-semibold">노래 상세</h1>

      <SongCard song={song} charts={charts} />

      <Suspense fallback={<p>기록을 읽고 있습니다...</p>}>
        <RecordTable
          records={recordsWithPage?.records ?? []}
          paging={{
            currentPage,
            totalElements: recordsWithPage?.count ?? 0,
            unit: recordsWithPage?.unit ?? 50,
          }}
        />
      </Suspense>
    </div>
  );
}
