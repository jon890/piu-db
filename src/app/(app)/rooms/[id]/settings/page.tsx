import ContentBox from "@/components/layout/content-box";
import RoomDB from "@/server/prisma/room.db";
import AuthUtil from "@/server/utils/auth-util";
import { notFound, redirect } from "next/navigation";

type Props = {
  params: { id: string };
};

export default async function AssignmentsPage({ params: { id } }: Props) {
  const userSeq = await AuthUtil.getUserSeqThrows();
  const { room, isParticipated: _ } = await RoomDB.getRoom(Number(id), userSeq);

  if (!room) return notFound();
  if (room.adminUserSeq !== userSeq)
    redirect(`/rooms/${room.seq}?message=FORBIDDEN`);

  return (
    <ContentBox title={room.name} subTitle={room.description}>
      <h3>설정 변경</h3>
    </ContentBox>
  );
}
