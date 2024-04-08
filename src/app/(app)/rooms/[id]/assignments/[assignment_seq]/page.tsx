import ContentBox from "@/components/layout/content-box";
import AssignmentRecordTable from "@/components/room/assignment-record-table";
import SongCardSC from "@/components/song-card.server";
import AssignmentDB from "@/server/prisma/assignment.db";
import ChartDB from "@/server/prisma/chart.db";
import RoomDB from "@/server/prisma/room.db";
import AuthUtil from "@/server/utils/auth-util";
import TimeUtil from "@/server/utils/time-util";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

export default async function AssignmentDetailPage({
  params,
}: {
  params: { id: string; assignment_seq: string };
}) {
  const userSeq = await AuthUtil.getUserSeqThrows();
  const roomSeq = Number(params.id);
  const assignmentSeq = Number(params.assignment_seq);

  if (isNaN(roomSeq) || isNaN(assignmentSeq)) {
    notFound();
  }

  const { room, isParticipated } = await RoomDB.getRoom(roomSeq, userSeq);

  if (!room) redirect("/rooms");
  if (!isParticipated) redirect(`/rooms/${roomSeq}?message=FORBIDDEN`);

  const assignment = await AssignmentDB.getAssignment(assignmentSeq);
  if (!assignment) redirect(`/rooms/${roomSeq}`);

  const chartAndSongs = await ChartDB.findSongBySeq(assignment.chartSeq);

  return (
    <ContentBox title="숙제 상세">
      <h2 className="text-lg sm:text-xl font-medium">
        시작일 : {TimeUtil.format(assignment.startDate, "YYYY-MM-DD HH:mm:ss")}
        <br />
        종료일 : {TimeUtil.format(assignment.endDate, "YYYY-MM-DD HH:mm:ss")}
      </h2>
      {assignment.memo && <p>메모 : {assignment.memo}</p>}
      {assignment.enableBreakOff && <p>브레이크 오프가 허용된 숙제입니다</p>}

      {chartAndSongs && chartAndSongs?.chart && chartAndSongs?.song && (
        <SongCardSC song={chartAndSongs.song} charts={[chartAndSongs.chart]} />
      )}
      <Suspense fallback={<p>기록을 불러오고 있습니다...</p>}>
        <AssignmentRecordTable assignmentSeq={assignment.seq} />
      </Suspense>
    </ContentBox>
  );
}
