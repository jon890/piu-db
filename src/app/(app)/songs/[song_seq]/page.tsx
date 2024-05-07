import ContentBox from "@/components/layout/content-box";
import RecordTable from "@/components/record/record-table";
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
    chartSeq?: string;
  };
};

export default async function SongDetailPage({
  params: { song_seq },
  searchParams: { page, chartSeq },
}: Props) {
  const songSeq = Number(song_seq);
  const song = await SongDB.findBySeq(songSeq);

  if (!song) {
    notFound();
  }

  const charts = (await ChartDB.findCharts(songSeq)) ?? [];

  if (!page) {
    redirect(`/songs/${songSeq}?page=1`);
  }

  const searchChartSeq = Number(chartSeq);
  const currentPage = Number(page);

  const recordsWithPage = !chartSeq
    ? await RecordDB.getRecordsBySongSeq(songSeq, currentPage)
    : await RecordDB.getRecordsByChartSeq(searchChartSeq, currentPage);

  return (
    <ContentBox title="노래 상세">
      <SongCard
        song={song}
        charts={charts}
        activeChartSeq={searchChartSeq}
        moveToChartDetail
      />

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
    </ContentBox>
  );
}
