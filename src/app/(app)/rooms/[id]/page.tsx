import LevelBall from "@/components/level-ball.server";
import ChartDB from "@/server/prisma/chart.db";
import RoomDB from "@/server/prisma/room.db";
import AuthUtil from "@/server/utils/auth-util";
import TimeUtil from "@/server/utils/time-util";
import dayjs from "dayjs";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ParticipateForm from "./(participate)/participate-form";
import RecordSyncForm from "./(sync-record)/record-sync-form";
import ParticipantsTable from "./participants-table";
import AssignmentTable from "./assignment-table";

type Props = {
  params: { id: string };
};

export default async function RoomDetailPage({ params }: Props) {
  const userSeq = await AuthUtil.getUserSeqThrows();
  const { room, isParticipated } = await RoomDB.getRoom(
    Number(params.id),
    userSeq
  );

  if (!room) {
    return notFound();
  }

  return (
    <section className="flex flex-col items-center w-full h-full gap-5 sm:gap-10">
      <h1 className="text-xl sm:text-2xl font-bold mt-10">{room.name}</h1>
      {room.description && (
        <h2 className="text-lg sm:text-xl font-semibold">{room.description}</h2>
      )}

      <div className="flex flex-row items-center justify-center gap-4">
        <ParticipateForm room={room} isParticipated={isParticipated} />

        {isParticipated && (
          <>
            <Link
              href={`/rooms/${room.seq}/assignment/create`}
              className="btn btn-primary text-xs sm:text-sm"
            >
              숙제 만들기
            </Link>
            <RecordSyncForm room={room} />
          </>
        )}
      </div>

      <Suspense fallback={<p>참여자를 불러오고 있습니다...</p>}>
        <ParticipantsTable room={room} />
      </Suspense>

      <Suspense fallback={<p>숙제를 불러오고 있습니다...</p>}>
        <AssignmentTable room={room} />
      </Suspense>
    </section>
  );
}
