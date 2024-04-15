import ContentBox from "@/components/layout/content-box";
import AssignmentInfoForm from "@/components/room/assignment-info.form";
import AssignmentRecordTable from "@/components/room/assignment-record-table";
import SongCardSC from "@/components/song-card.server";
import AssignmentDB from "@/server/prisma/assignment.db";
import ChartDB from "@/server/prisma/chart.db";
import RoomDB from "@/server/prisma/room.db";
import AuthUtil from "@/server/utils/auth-util";
import TimeUtil from "@/server/utils/time-util";
import ArrowLeftIcon from "@heroicons/react/24/solid/ArrowLeftIcon";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

// TODO detail, update 페이지에서 레이아웃 공유
// 공통 로직 분리
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
    <ContentBox>
      <div className="flex flex-row justify-center items-center w-full max-w-md relative">
        <Link
          className="btn btn-ghost absolute left-0"
          href={`/rooms/${roomSeq}`}
        >
          <ArrowLeftIcon className="size-6" />
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold">숙제 상세</h1>
      </div>

      {chartAndSongs && chartAndSongs?.chart && chartAndSongs?.song && (
        <SongCardSC song={chartAndSongs.song} charts={[chartAndSongs.chart]} />
      )}

      <AssignmentInfoForm assignment={assignment} disabled />

      {assignment.createUserSeq === userSeq &&
        TimeUtil.isBetween(assignment.startDate, assignment.endDate) && (
          <Link
            href={`/rooms/${roomSeq}/assignments/${assignmentSeq}/update`}
            className="btn btn-primary"
          >
            숙제 정보 변경
          </Link>
        )}

      <Suspense fallback={<p>기록을 불러오고 있습니다...</p>}>
        <AssignmentRecordTable room={room} assignmentSeq={assignment.seq} />
      </Suspense>
    </ContentBox>
  );
}
