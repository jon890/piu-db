import CardGlass from "@/components/CardGlass";
import { getRooms } from "@/server/db/assignment-rooms";
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
    <div className="grid grid-cols-2 gap-5">
      {rooms.map((r) => (
        <CardGlass
          key={r.seq}
          title="방1"
          image="https://burst.shopifycdn.com/photos/city-lights-through-rain-window.jpg"
        />
      ))}
    </div>
  );
}
