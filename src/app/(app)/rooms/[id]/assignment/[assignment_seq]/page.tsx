import AssignmentRecordDB from "@/server/prisma/assignment-record.db";
import AssignmentDB from "@/server/prisma/assignment.db";
import ChartDB from "@/server/prisma/chart.db";
import RoomDB from "@/server/prisma/room.db";
import SongDB from "@/server/prisma/song.db";
import AuthUtil from "@/server/utils/auth-util";
import { redirect } from "next/navigation";
import LevelBall from "../create/level-ball";
import SongCard from "./song-card";
import TimeUtil from "@/server/utils/time-util";
import RecordGrade from "@/app/(app)/record/record-grade";
import RecordPlate from "@/app/(app)/record/record-plate";

export default async function AssignmentCreatePage({
  params,
}: {
  params: { id: string; assignment_seq: string };
}) {
  const userSeq = await AuthUtil.getUserSeqThrows();
  const roomSeq = Number(params.id);
  const assignmentSeq = Number(params.assignment_seq);

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

  const assignment = await AssignmentDB.getAssignment(assignmentSeq);

  if (!assignment) {
    redirect("/rooms");
  }

  const records = await AssignmentRecordDB.getRecordsByAssgimentSeq(
    assignmentSeq
  );

  const chartAndSongs = await ChartDB.findSongBySeqInCache(assignment.chartSeq);

  return (
    <div className="flex flex-col items-center w-full h-full gap-y-10">
      <h1 className="text-3xl mt-10 font-bold">숙제 상세</h1>

      {chartAndSongs && chartAndSongs?.chart && chartAndSongs?.song && (
        <SongCard song={chartAndSongs.song} chart={chartAndSongs.chart} />
      )}

      <div className="overflow-x-auto w-full shadow-md p-4">
        <h3 className="text-center font-semibold p-2">순위표</h3>
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>점수</th>
              <th>그레이드</th>
              <th>플레이트</th>
              <th>플레이시간</th>
              <th>닉네임</th>
            </tr>
          </thead>
          <tbody>
            {records
              .sort((a, b) => b.record.score - a.record.score)
              .map(({ record, user }, index) => (
                <tr
                  key={index}
                  className="*:text-xs *:px-2 *:py-1 *:sm:text-sm *:sm:px-4 *:sm:py-2 hover"
                >
                  <th>{index + 1}</th>
                  <th>{record.score}</th>
                  <th>
                    <RecordGrade grade={record.grade} />
                  </th>
                  <th>
                    <RecordPlate plate={record.plate} />
                  </th>
                  <th>
                    {TimeUtil.format(record.playedAt, "YYYY-MM-DD HH:mm:ss")}
                  </th>
                  <th>{user.nickname}</th>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
