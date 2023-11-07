import { getRoomWithParticipants } from "@/server/prisma/assignment-rooms";
import { notFound } from "next/navigation";
import ParticipateForm from "./paritipate-form";

export default async function RoomDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { room, participants } = await getRoomWithParticipants(
    Number(params.id)
  );

  if (!room) {
    return notFound();
  }

  return (
    <div className="flex flex-col items-center w-full h-full space-y-10">
      <h1 className="text-3xl mt-10">{room.name}</h1>
      <h2 className="text-xl mt-5">{room.description}</h2>

      <div>
        <ParticipateForm room={room} />
      </div>

      <div className="overflow-x-auto shadow-md p-4">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>유저</th>
              <th>가입일</th>
            </tr>
          </thead>
          <tbody>
            {participants?.map((p) => (
              <tr key={p.seq}>
                <th>{p.seq}</th>
                <th>{p.user.nickname}</th>
                <th>{p.createdAt.toISOString()}</th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
