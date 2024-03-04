import { getRoomWithParticipants } from "@/server/prisma/room.db";
import AuthUtil from "@/server/utils/auth-util";
import dayjs from "dayjs";
import { notFound } from "next/navigation";
import ParticipateForm from "./paritipate-form";

export default async function RoomDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const userSeq = await AuthUtil.getUserSeqThrows();
  const { room, participants } = await getRoomWithParticipants(
    Number(params.id)
  );

  const isParticipated = Boolean(
    participants?.find((p) => p.userSeq === userSeq)
  );

  if (!room) {
    return notFound();
  }

  return (
    <div className="flex flex-col items-center w-full h-full space-y-10">
      <h1 className="text-3xl mt-10 font-bold">{room.name}</h1>
      {room.description && (
        <h2 className="text-xl mt-5 font-semibold">{room.description}</h2>
      )}

      <ParticipateForm room={room} isParticipated={isParticipated} />

      <div className="overflow-x-auto shadow-md p-4">
        <h3 className="text-center font-semibold p-2">참여자 목록</h3>
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>유저</th>
              <th>참여일</th>
            </tr>
          </thead>
          <tbody>
            {participants?.map((p) => (
              <tr key={p.seq}>
                <th>{p.seq}</th>
                <th>{p.user.nickname}</th>
                <th>{dayjs(p.createdAt).format("YYYY-MM-DD HH:mm")}</th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
