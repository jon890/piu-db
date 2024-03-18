import ServerToastHelper from "@/components/server-toast-helper";
import RoomDB from "@/server/prisma/room.db";
import AuthUtil from "@/server/utils/auth-util";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ParticipateForm from "./(participate)/participate-form";
import RecordSyncForm from "./(sync-record)/form";
import AssignmentTable from "./assignment-table";
import ParticipantsTable from "./participants-table";
import CookieUtil from "@/server/utils/cookie-util";

type Props = {
  params: { id: string };
  searchParams: {
    message?: string;
  };
};

export default async function RoomDetailPage({
  params: { id },
  searchParams: { message },
}: Props) {
  const userSeq = await AuthUtil.getUserSeqThrows();
  const { room, isParticipated } = await RoomDB.getRoom(Number(id), userSeq);

  const piuAuthValue = await CookieUtil.getPiuAuthValue();

  if (!room) {
    return notFound();
  }

  return (
    <>
      <section className="flex flex-col items-center w-full h-full gap-5 sm:gap-10">
        <h1 className="text-xl sm:text-2xl font-bold mt-10">{room.name}</h1>
        {room.description && (
          <h2 className="text-lg sm:text-xl font-semibold">
            {room.description}
          </h2>
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
              <RecordSyncForm room={room} piuAuth={piuAuthValue} />
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

      {message === "FORBIDDEN" && (
        <ServerToastHelper
          toast={{ type: "warning", message: "권한이 없습니다" }}
        />
      )}
    </>
  );
}
