import Room from "@/components/Room";
import { getRooms } from "@/server/prisma/assignment-rooms";
import Link from "next/link";
import { Suspense } from "react";

export default function RoomListPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full space-y-10">
      <h1 className="text-3xl mt-10">목록</h1>
      <Link href="/rooms/create">
        <button className="btn btn-primary">생성</button>
      </Link>

      <Suspense fallback={<p>방 목록을 읽고 있습니다...</p>}>
        <RoomList />
      </Suspense>
    </div>
  );
}

async function RoomList() {
  const rooms = await getRooms();

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-5">
      {rooms.map((r) => (
        <Room key={r.seq} room={r} />
      ))}
    </div>
  );
}
