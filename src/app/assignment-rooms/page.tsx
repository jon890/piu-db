import CardGlass from "@/components/CardGlass";
import { getRooms } from "@/server/db/assignment-rooms";
import Link from "next/link";

export default function AssignmentRoomPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full space-y-10">
      <h1 className="text-3xl mt-10">목록</h1>
      <Link href="/assignment-rooms/create">
        <button className="btn btn-primary">생성</button>
      </Link>

      <AssignmentRoomList />
    </div>
  );
}

async function AssignmentRoomList() {
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
