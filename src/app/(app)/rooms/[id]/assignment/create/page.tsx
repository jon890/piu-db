import ChartDB from "@/server/prisma/chart.db";
import RoomDB from "@/server/prisma/room.db";
import AuthUtil from "@/server/utils/auth-util";
import { redirect } from "next/navigation";
import SelectSong from "./select-song";

export default async function AssignmentCreatePage({
  params,
}: {
  params: { id: string };
}) {
  const userSeq = await AuthUtil.getUserSeqThrows();
  const roomSeq = Number(params.id);

  const songWithCharts = await ChartDB.findAllGroupBySong();
  const { room, participants } = await RoomDB.getRoomDetail(roomSeq);

  const isParticipated = Boolean(
    participants?.find((p) => p.userSeq === userSeq)
  );

  if (!room) {
    redirect("/rooms");
  }

  if (!isParticipated) {
    redirect(`/rooms/${roomSeq}?message=FORBIDDEN`);
  }

  return (
    <div className="flex flex-col items-center w-full h-full space-y-10">
      <h1 className="text-3xl mt-10 font-bold">숙제곡 선택</h1>
      <SelectSong songWithCharts={songWithCharts} roomSeq={roomSeq} />
    </div>
  );
}
