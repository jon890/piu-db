import AssignmentDB from "@/server/prisma/assignment.db";
import RoomDB from "@/server/prisma/room.db";
import AuthUtil from "@/server/utils/auth-util";
import type { AssignmentRoom } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import AssignmentTable from "../assignment-table";

type Props = {
  params: { id: string };
};

export default async function AssignmentsPage({ params: { id } }: Props) {
  const userSeq = await AuthUtil.getUserSeqThrows();
  const { room, isParticipated } = await RoomDB.getRoom(Number(id), userSeq);

  if (!room) return notFound();
  if (!isParticipated) redirect(`/rooms/${room.seq}?message=FORBIDDEN`);

  return (
    <>
      <section className="flex flex-col items-center w-full h-full gap-5 sm:gap-10">
        <h1 className="text-xl sm:text-2xl font-bold mt-10">{room.name}</h1>
        {room.description && (
          <h2 className="text-lg sm:text-xl font-semibold">
            {room.description}
          </h2>
        )}

        <div className="flex flex-row items-center justify-center gap-4"></div>

        <Suspense fallback={<p>숙제를 불러오고 있습니다...</p>}>
          <AssignmentTableHelper room={room} />
        </Suspense>
      </section>
    </>
  );
}

async function AssignmentTableHelper({ room }: { room: AssignmentRoom }) {
  const assignments = await AssignmentDB.getAssignments(room.seq);
  return (
    <AssignmentTable room={room} assignments={assignments} onGoing={false} />
  );
}
