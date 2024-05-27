import ContentBox from "@/components/layout/content-box";
import AssignmentTable from "@/components/room/assignment-table";
import ParticipantsTable from "@/components/room/participants-table";
import RoomMenu from "@/components/room/room-menu";
import ServerToastHelper from "@/components/server-toast-helper";
import AssignmentDB from "@/server/prisma/assignment.db";
import RoomDB from "@/server/prisma/room.db";
import AuthUtil from "@/server/utils/auth-util";
import type { AssignmentRoom } from "@prisma/client";
import { notFound } from "next/navigation";
import { Suspense } from "react";

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
  const roomSeq = Number(id);
  if (isNaN(roomSeq)) {
    return notFound();
  }

  const userSeq = await AuthUtil.getUserSeqThrows();
  const { room, isParticipated } = await RoomDB.getRoom(roomSeq, userSeq);

  if (!room) {
    return notFound();
  }

  return (
    <>
      <ContentBox title={room.name} subTitle={room.description}>
        <RoomMenu room={room} isParticipated={isParticipated} />

        <Suspense fallback={<p>참여자를 불러오고 있습니다...</p>}>
          <ParticipantsTable room={room} />
        </Suspense>

        <Suspense fallback={<p>숙제를 불러오고 있습니다...</p>}>
          <AssignmentTableWrapper room={room} />
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

async function AssignmentTableWrapper({ room }: { room: AssignmentRoom }) {
  const assignments = await AssignmentDB.getOngoingAssignments(room.seq);
  return <AssignmentTable room={room} assignments={assignments} onGoing />;
}

/**
 * statically generate routes at build time
 * @returns
 */
export async function generateStaticParams() {
  const rooms = await RoomDB.getRooms();
  return rooms.map((it) => it.seq);
}
