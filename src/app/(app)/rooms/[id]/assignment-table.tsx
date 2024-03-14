import LevelBallSC from "@/components/level-ball.server";
import ChartDB from "@/server/prisma/chart.db";
import RoomDB from "@/server/prisma/room.db";
import TimeUtil from "@/server/utils/time-util";
import { AssignmentRoom } from "@prisma/client";
import dayjs from "dayjs";
import Link from "next/link";

type Props = {
  room: AssignmentRoom;
};

export default async function AssignmentTable({ room }: Props) {
  const assignments = await RoomDB.getAssignments(room.seq);

  let assignmentWithSong = [];
  if (assignments) {
    for (const assignment of assignments) {
      const songAndChart = await ChartDB.findSongBySeqInCache(
        assignment.chartSeq
      );

      assignmentWithSong.push({
        assignment,
        song: songAndChart?.song,
        chart: songAndChart?.chart,
      });
    }
  }

  return (
    <div className="overflow-auto border p-4 rounded-md shadow-md max-w-full">
      <h3 className="text-center font-semibold p-2">숙제 목록</h3>
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>곡이름</th>
            <th>레벨/SD</th>
            <th>시작일</th>
            <th>종료일</th>
            <th>상태</th>
            <th>등록일</th>
          </tr>
        </thead>
        <tbody>
          {assignmentWithSong?.map(({ assignment, chart, song }, index) => (
            <tr
              key={index}
              className="*:text-xs *:px-2 *:py-1 *:md:text-sm *:md:px-4 *:md:py-2 hover"
            >
              <td>{index + 1}</td>
              <td>
                <Link
                  href={`/rooms/${room.seq}/assignment/${assignment.seq}`}
                  className="hover:text-gray-600 font-semibold"
                >
                  {song?.name}
                </Link>
              </td>
              <td>
                {chart?.chartType && (
                  <LevelBallSC chart={chart} className="size-8" />
                )}
              </td>
              <td>
                {TimeUtil.format(assignment.startDate, "YYYY-MM-DD HH:mm")}
              </td>
              <td>{TimeUtil.format(assignment.endDate, "YYYY-MM-DD HH:mm")}</td>
              <td>
                {dayjs().isBefore(assignment.endDate) ? (
                  <span className="text-blue-500 font-semibold">진행 중</span>
                ) : (
                  <span className="text-gray-500">종료</span>
                )}
              </td>
              <td>
                {TimeUtil.format(assignment.createdAt, "YYYY-MM-DD HH:mm")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
