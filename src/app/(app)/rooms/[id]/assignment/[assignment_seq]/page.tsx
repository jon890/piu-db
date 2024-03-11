import RecordGrade from "@/app/(app)/record/record-grade";
import RecordPlate from "@/app/(app)/record/record-plate";
import AssignmentRecordDB from "@/server/prisma/assignment-record.db";
import AssignmentDB from "@/server/prisma/assignment.db";
import ChartDB from "@/server/prisma/chart.db";
import RoomDB from "@/server/prisma/room.db";
import AuthUtil from "@/server/utils/auth-util";
import TimeUtil from "@/server/utils/time-util";
import dayjs from "dayjs";
import { redirect } from "next/navigation";
import SongCard from "./song-card";
import TrophyIcon from "@heroicons/react/24/solid/TrophyIcon";
import classnames from "@/client/utils/classnames";

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

      <h2 className="text-xl">
        기간 : {TimeUtil.format(assignment.startDate, "YYYY-MM-DD HH:mm:ss")} ~{" "}
        {TimeUtil.format(assignment.endDate, "YYYY-MM-DD HH:mm:ss")}
      </h2>

      {chartAndSongs && chartAndSongs?.chart && chartAndSongs?.song && (
        <SongCard song={chartAndSongs.song} chart={chartAndSongs.chart} />
      )}

      <div className="overflow-x-auto w-full shadow-md p-4">
        <h3 className="text-center font-semibold p-2">순위표</h3>
        <table className="table">
          <thead>
            <tr>
              <th>등수</th>
              <th>점수</th>
              <th>그레이드</th>
              <th>플레이트</th>
              <th>플레이시간</th>
              <th>닉네임</th>
            </tr>
          </thead>
          <tbody>
            {records.length ? (
              records
                .sort((a, b) => {
                  if (b.record.score !== a.record.score) {
                    return b.record.score - a.record.score;
                  } else {
                    const a_playedAt = dayjs(a.record.playedAt);
                    const b_playedAt = dayjs(b.record.playedAt);
                    if (a_playedAt.isBefore(b_playedAt)) {
                      return 1;
                    } else if (a_playedAt.isSame(b_playedAt)) {
                      return 0;
                    } else {
                      return -1;
                    }
                  }
                })
                .map(({ record, user }, index) => (
                  <tr
                    key={index}
                    className="*:text-xs *:px-2 *:py-1 *:sm:text-sm *:sm:px-4 *:sm:py-2 hover"
                  >
                    <th className="flex flex-row gap-1 items-center">
                      <span>{index + 1}위</span>
                      <span>
                        <TrophyIcon
                          className={classnames("size-6", {
                            "text-[#ffd700]": index === 0,
                            "text-[#C0C0C0]": index === 1,
                            "text-[#CD7F32]": index === 2,
                          })}
                        />
                      </span>
                    </th>
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
                ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center h-24">
                  아직 플레이 기록이 없습니다! <br />
                  플레이하고 기록을 등록해보세요
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
