import ChartDB from "@/server/prisma/chart.db";
import RoomDB from "@/server/prisma/room.db";
import AuthUtil from "@/server/utils/auth-util";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import SelectSongWrapper from "./select-song-wrapper";
import ContentBox from "@/components/layout/content-box";

export default async function AssignmentCreatePage({
  params,
}: {
  params: { id: string };
}) {
  const userSeq = await AuthUtil.getUserSeqThrows();
  const roomSeq = Number(params.id);
  const { room, isParticipated } = await RoomDB.getRoom(roomSeq, userSeq);

  if (!room) redirect("/rooms");
  if (!isParticipated) redirect(`/rooms/${roomSeq}?message=FORBIDDEN`);

  return (
    <ContentBox title={"숙제곡 선택"}>
      <Suspense fallback={<p>모든 곡을 불러오고 있습니다...</p>}>
        <SelectSongHelper roomSeq={room.seq} />
      </Suspense>
    </ContentBox>
  );
}

async function SelectSongHelper({ roomSeq }: { roomSeq: number }) {
  const songWithCharts = await ChartDB.findAllGroupBySong();

  return (
    <SelectSongWrapper songWithCharts={songWithCharts} roomSeq={roomSeq} />
  );
}
