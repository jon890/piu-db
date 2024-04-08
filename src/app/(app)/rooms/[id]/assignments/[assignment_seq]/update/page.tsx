import ContentBox from "@/components/layout/content-box";
import AssignmentInfoForm from "@/components/room/assignment-info.form";
import SongCardSC from "@/components/song-card.server";
import AssignmentRecordDB from "@/server/prisma/assignment-record.db";
import AssignmentDB from "@/server/prisma/assignment.db";
import ChartDB from "@/server/prisma/chart.db";
import RoomDB from "@/server/prisma/room.db";
import AuthUtil from "@/server/utils/auth-util";
import { notFound, redirect } from "next/navigation";

export default async function AssignmentUpdatePage({
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
  if (assignment.createUserSeq !== userSeq)
    redirect(`/rooms/${roomSeq}?message=FORBIDDEN`);
  const recordsCount =
    await AssignmentRecordDB.getCountByAssignmentSeq(assignmentSeq);

  const chartAndSongs = await ChartDB.findSongBySeq(assignment.chartSeq);

  return (
    <ContentBox title="숙제 변경">
      {chartAndSongs && chartAndSongs?.chart && chartAndSongs?.song && (
        <SongCardSC song={chartAndSongs.song} charts={[chartAndSongs.chart]} />
      )}

      {recordsCount > 0 && (
        <p className="text-red-500 font-semibold">
          숙제 기록이 등록되어 수정이 불가능합니다.
        </p>
      )}

      <AssignmentInfoForm assignment={assignment} disabled={recordsCount > 0} />
    </ContentBox>
  );
}
