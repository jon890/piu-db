import ChartDB from "@/server/prisma/chart.db";
import RoomDB from "@/server/prisma/room.db";
import AuthUtil from "@/server/utils/auth-util";
import TimeUtil from "@/server/utils/time-util";
import dayjs from "dayjs";
import Link from "next/link";
import { notFound } from "next/navigation";
import ParticipateForm from "./participate-form";
import RecordSyncForm from "./record-sync-form";
import Toast from "./toast";
import ParticipantsTable from "./participants-table";
import LevelBall from "@/components/level-ball.server";

type Props = {
  params: { id: string };
  searchParams: {
    message?: string;
  };
};

export default async function RoomDetailPage({ params, searchParams }: Props) {
  const userSeq = await AuthUtil.getUserSeqThrows();
  const { room, participants, assignments } = await RoomDB.getRoomDetail(
    Number(params.id)
  );

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

  const isParticipated = Boolean(
    participants?.find((p) => p.userSeq === userSeq)
  );

  if (!room) {
    return notFound();
  }

  return (
    <>
      <div className="flex flex-col items-center w-full h-full space-y-10">
        <h1 className="text-3xl mt-10 font-bold">{room.name}</h1>
        {room.description && (
          <h2 className="text-xl mt-5 font-semibold">{room.description}</h2>
        )}

        <div className="flex flex-row items-center justify-center gap-4">
          <ParticipateForm room={room} isParticipated={isParticipated} />

          {isParticipated && (
            <>
              <Link
                href={`/rooms/${room.seq}/assignment/create`}
                className="btn btn-primary"
              >
                숙제 만들기
              </Link>
              <RecordSyncForm room={room} />
            </>
          )}
        </div>

        {participants && (
          <ParticipantsTable room={room} participants={participants} />
        )}

        <div className="overflow-x-auto w-full shadow-md p-4">
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
                    >
                      {song?.name}
                    </Link>
                  </td>
                  <td>
                    {chart?.chartType && (
                      <LevelBall chart={chart} className="size-8" />
                    )}
                  </td>
                  <td>
                    {TimeUtil.format(assignment.startDate, "YYYY-MM-DD HH:mm")}
                  </td>
                  <td>
                    {TimeUtil.format(assignment.endDate, "YYYY-MM-DD HH:mm")}
                  </td>
                  <td>
                    {dayjs().isBefore(assignment.endDate) ? (
                      <span className="text-blue-500 font-semibold">
                        진행 중
                      </span>
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
      </div>

      {searchParams?.message && <Toast message={searchParams.message} />}
    </>
  );
}
