import LevelBallSC from "@/components/level-ball.server";
import ChartDB from "@/server/prisma/chart.db";
import TimeUtil from "@/server/utils/time-util";
import type { Assignment, AssignmentRoom } from "@prisma/client";
import dayjs from "dayjs";
import Link from "next/link";

type Props = {
  room: AssignmentRoom;
  assignments: (Assignment & { createUser: { nickname: string } })[];
  onGoing: boolean;
};

export default async function AssignmentTable({
  room,
  assignments,
  onGoing,
}: Props) {
  let assignmentWithSong = [];
  for (const assignment of assignments) {
    const songAndChart = await ChartDB.findSongBySeqInCache(
      assignment.chartSeq
    );

    assignmentWithSong.push({
      assignment,
      song: songAndChart?.song,
      chart: songAndChart?.chart,
      endDateDiff: dayjs(assignment.endDate).diff(dayjs(), "hours"),
    });
  }

  return (
    <div className="overflow-auto border p-4 rounded-2xl shadow-xl max-w-[calc(100%-20px)]">
      <div className="flex flex-row justify-center">
        <h3 className="text-center font-semibold p-2">
          {onGoing ? "진행 중인 숙제 목록" : "전체 숙제 목록"}
        </h3>

        {onGoing && (
          <Link href={`/rooms/${room.seq}/assignments`} className="ml-auto">
            <button className="btn btn-primary ">전체 보기</button>
          </Link>
        )}
      </div>

      <table className="table">
        <thead>
          <tr className="*:text-center">
            <th className="hidden sm:table-cell"></th>
            <th>곡명</th>
            <th>LV</th>
            {!onGoing && <th>시작일</th>}
            <th>종료일</th>
            {!onGoing && <th>상태</th>}
            <th>메모</th>
            <th className="hidden sm:table-cell">등록일</th>
            <th>등록자</th>
          </tr>
        </thead>
        <tbody>
          {assignmentWithSong?.map(
            ({ assignment, chart, song, endDateDiff }, index) => (
              <tr
                key={index}
                className="*:text-xs *:px-1 *:py-0.5 *:sm:px-2 *:sm:py-1 *:md:text-sm *:md:px-4 *:md:py-2 hover"
              >
                <td className="hidden sm:table-cell">{index + 1}</td>
                <td>
                  <Link
                    href={`/rooms/${room.seq}/assignments/${assignment.seq}`}
                    className="hover:text-gray-600 font-semibold"
                  >
                    {song?.name}
                  </Link>
                </td>
                <td>
                  {chart?.chartType && (
                    <LevelBallSC chart={chart} className="size-6 sm:size-8" />
                  )}
                </td>

                {!onGoing && (
                  <td>
                    {TimeUtil.format(assignment.startDate, "MM월 DD일 HH:mm")}
                  </td>
                )}

                {onGoing ? (
                  <td className="*:block">
                    <span>
                      {TimeUtil.format(assignment.endDate, "MM월 DD일")}
                    </span>

                    {Math.floor(endDateDiff / 24) > 0 ? (
                      <span className="text-blue-500 font-semibold">
                        ({Math.floor(endDateDiff / 24)}일 남음)
                      </span>
                    ) : (
                      <span className="text-orange-500 font-semibold">
                        ({endDateDiff}시간 남음)
                      </span>
                    )}
                  </td>
                ) : (
                  <td>
                    {TimeUtil.format(assignment.endDate, "YYYY-MM-DD HH:mm")}
                  </td>
                )}

                {!onGoing && (
                  <td>
                    {dayjs().isBefore(assignment.endDate) ? (
                      <span className="text-blue-500 font-semibold">
                        진행 중
                      </span>
                    ) : (
                      <span className="text-gray-500">종료</span>
                    )}
                  </td>
                )}

                <td>{assignment.memo ?? ""}</td>

                <td className="hidden sm:table-cell">
                  {TimeUtil.format(assignment.createdAt, "YYYY-MM-DD")}
                </td>

                <td>
                  <p className="w-12 sm:w-auto text-ellipsis whitespace-nowrap overflow-hidden">
                    {assignment.createUser.nickname}
                  </p>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
