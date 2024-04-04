import ContentBox from "@/components/layout/content-box";
import RoomDB from "@/server/prisma/room.db";
import Link from "next/link";
import Room from "./room";
import { Suspense } from "react";

export default async function RoomListPage() {
  return (
    <ContentBox title="숙제방 목록">
      <Link href="/rooms/create" className="btn btn-primary text-xs sm:text-sm">
        숙제방 생성
      </Link>

      <Suspense fallback={<RoomSkeleton />}>
        <RoomList />
      </Suspense>
    </ContentBox>
  );
}

async function RoomList() {
  const rooms = await RoomDB.getRooms();

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-5 w-full">
      {rooms.map((r) => (
        <Room
          key={r.seq}
          room={r}
          count={r._count.assignmentRoomParticipants}
        />
      ))}
    </div>
  );
}

function RoomSkeleton() {
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-5 w-full">
      {[...Array(10)].map((v, i) => (
        <div className="skeleton w-full h-48" key={i}></div>
      ))}
    </div>
  );
}
