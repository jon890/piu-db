import ContentBox from "@/components/layout/content-box";
import RoomDB from "@/server/prisma/room.db";
import AuthUtil from "@/server/utils/auth-util";
import { notFound, redirect } from "next/navigation";
import RoomSettingsForm from "./form";

type Props = {
  params: { id: string };
};

export default async function RoomSettingsPage({ params: { id: _id } }: Props) {
  // validate params
  const roomSeq = Number(_id);
  if (isNaN(roomSeq)) {
    notFound();
  }

  const userSeq = await AuthUtil.getUserSeqThrows();
  const { room, isParticipated } = await RoomDB.getRoom(roomSeq, userSeq);
  const participatns = await RoomDB.getParticipants(roomSeq);

  if (!room) return notFound();
  if (!isParticipated) redirect(`/rooms/${room.seq}?message=FORBIDDEN`);
  if (room.adminUserSeq !== userSeq)
    redirect(`/rooms/${room.seq}?message=FORBIDDEN`);

  return (
    <ContentBox title="방 설정 변경">
      <RoomSettingsForm room={room} participants={participatns} />
    </ContentBox>
  );
}
