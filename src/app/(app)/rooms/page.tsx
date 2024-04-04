import ContentBox from "@/components/layout/content-box";
import RoomDB from "@/server/prisma/room.db";
import Link from "next/link";
import Room from "./room";

export default async function RoomListPage() {
  const rooms = await RoomDB.getRooms();

  return (
    <ContentBox title="숙제방 목록">
      <Link href="/rooms/create" className="btn btn-primary text-xs sm:text-sm">
        숙제방 생성
      </Link>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-5 w-full">
        {rooms.map((r) => (
          <Room
            key={r.seq}
            room={r}
            count={r._count.assignmentRoomParticipants}
          />
        ))}
      </div>
    </ContentBox>
  );
}
