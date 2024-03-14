import SongCardSC from "@/components/song-card.server";
import AssignmentDB from "@/server/prisma/assignment.db";
import ChartDB from "@/server/prisma/chart.db";
import RoomDB from "@/server/prisma/room.db";
import AuthUtil from "@/server/utils/auth-util";
import TimeUtil from "@/server/utils/time-util";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import AssignmentRecordTable from "./assignment-record-table";

export default async function AssignmentCreatePage({
  params,
}: {
  params: { id: string; assignment_seq: string };
}) {
  const userSeq = await AuthUtil.getUserSeqThrows();
  const roomSeq = Number(params.id);
  const assignmentSeq = Number(params.assignment_seq);

  const { room, isParticipated } = await RoomDB.getRoom(roomSeq, userSeq);

  if (!room) redirect("/rooms");
  if (!isParticipated) redirect(`/rooms/${roomSeq}?message=FORBIDDEN`);

  const assignment = await AssignmentDB.getAssignment(assignmentSeq);
  if (!assignment) redirect(`/room/${roomSeq}`);

  const chartAndSongs = await ChartDB.findSongBySeqInCache(assignment.chartSeq);

  return (
    <section className="flex flex-col items-center w-full h-full gap-10">
      <h1 className="text-xl sm:text-2xl font-bold mt-10">숙제 상세</h1>

      <h2 className="text-lg sm:text-xl font-medium">
        시작일 : {TimeUtil.format(assignment.startDate, "YYYY-MM-DD HH:mm:ss")}
        <br />
        종료일 : {TimeUtil.format(assignment.endDate, "YYYY-MM-DD HH:mm:ss")}
      </h2>

      {chartAndSongs && chartAndSongs?.chart && chartAndSongs?.song && (
        <SongCardSC song={chartAndSongs.song} charts={[chartAndSongs.chart]} />
      )}

      <Suspense fallback={<p>기록을 불러오고 있습니다...</p>}>
        <AssignmentRecordTable assignmentSeq={assignment.seq} />
      </Suspense>
    </section>
  );
}
