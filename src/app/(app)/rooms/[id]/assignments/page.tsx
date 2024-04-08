import ContentBox from "@/components/layout/content-box";
import AssignmentTable from "@/components/room/assignment-table";
import AssignmentDB from "@/server/prisma/assignment.db";
import RoomDB from "@/server/prisma/room.db";
import AuthUtil from "@/server/utils/auth-util";
import type { AssignmentRoom } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

type Props = {
  params: { id: string };
};

export default async function AssignmentsPage({ params: { id } }: Props) {
  const userSeq = await AuthUtil.getUserSeqThrows();
  const { room, isParticipated } = await RoomDB.getRoom(Number(id), userSeq);

  if (!room) return notFound();
  if (!isParticipated) redirect(`/rooms/${room.seq}?message=FORBIDDEN`);

  return (
    <ContentBox title={room.name} subTitle={room.description}>
      <Suspense fallback={<p>숙제를 불러오고 있습니다...</p>}>
        <AssignmentTableHelper room={room} />
      </Suspense>
    </ContentBox>
  );
}

async function AssignmentTableHelper({ room }: { room: AssignmentRoom }) {
  const assignments = await AssignmentDB.getAssignments(room.seq);
  return (
    <AssignmentTable room={room} assignments={assignments} onGoing={false} />
  );
}
