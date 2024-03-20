import ContentBox from "@/components/layout/content-box";
import ServerToastHelper from "@/components/server-toast-helper";
import AssignmentDB from "@/server/prisma/assignment.db";
import RoomDB from "@/server/prisma/room.db";
import AuthUtil from "@/server/utils/auth-util";
import CookieUtil from "@/server/utils/cookie-util";
import type { AssignmentRoom } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ParticipateButton from "./(participate)/button";
import RecordSyncForm from "./(sync-record)/form";
import AssignmentTable from "./assignment-table";
import ParticipantsTable from "./participants-table";

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
      <ContentBox title={room.name}>
        {room.description && (
          <h2 className="text-lg sm:text-xl font-semibold">
            {room.description}
          </h2>
        )}

        <div className="flex flex-row items-center justify-center gap-4 max-w-screen-sm flex-wrap">
          <ParticipateButton room={room} isParticipated={isParticipated} />

          {isParticipated && (
            <>
              <Link
                href={`/rooms/${room.seq}/assignments/create`}
                className="btn btn-primary text-xs sm:text-sm"
              >
                숙제 만들기
              </Link>
              <RecordSyncForm room={room} piuAuth={piuAuthValue} />
            </>
          )}

          {room.adminUserSeq === userSeq && (
            <Link
              href={`/rooms/${room.seq}/settings`}
              className="btn btn-primary text-xs sm:text-sm"
            >
              방 설정 변경
            </Link>
          )}
        </div>

        <Suspense fallback={<p>참여자를 불러오고 있습니다...</p>}>
          <ParticipantsTable room={room} />
        </Suspense>

        <Suspense fallback={<p>숙제를 불러오고 있습니다...</p>}>
          <AssignmentTableHelper room={room} />
        </Suspense>
      </ContentBox>

      {message === "FORBIDDEN" && (
        <ServerToastHelper
          toast={{ type: "warning", message: "권한이 없습니다" }}
        />
      )}
    </>
  );
}

async function AssignmentTableHelper({ room }: { room: AssignmentRoom }) {
  const assignments = await AssignmentDB.getOngoingAssignments(room.seq);
  return <AssignmentTable room={room} assignments={assignments} onGoing />;
}
