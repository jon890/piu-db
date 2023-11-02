import Room from "@/components/Room";
import { getRoom, getRooms } from "@/server/db/assignment-rooms";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function RoomDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const room = await getRoom(Number(params.id));

  if (!room) {
    return notFound();
  }

  return (
    <div className="flex flex-col items-center w-full h-full space-y-10">
      <h1 className="text-3xl mt-10">상세</h1>
    </div>
  );
}
