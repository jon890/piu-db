import ContentBox from "@/components/layout/content-box";
import RoomDB from "@/server/prisma/room.db";
import Link from "next/link";
import { Suspense } from "react";
import Room from "./room";

export default function RoomListPage() {
  return (
    <ContentBox title={"숙제방 목록"}>
      <Link href="/rooms/create" className="btn btn-primary text-xs sm:text-sm">
        숙제방 생성
      </Link>

      <Suspense fallback={<p>방 목록을 읽고 있습니다...</p>}>
        <RoomList />
      </Suspense>
    </ContentBox>
  );
}

async function RoomList() {
  const rooms = await RoomDB.getRooms();

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-5">
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
