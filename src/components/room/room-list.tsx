import RoomDB from "@/server/prisma/room.db";
import Room from "./room";
import AuthUtil from "@/server/utils/auth-util";
import { Paging } from "../common/paging";
import { ROOM_PAGING_UNIT } from "@/constants/const";

type Props = {
  page: number;
};

export default async function RoomList({ page }: Props) {
  const userSeq = await AuthUtil.getUserSeqThrows();
  const { rooms, totalItemCount } = await RoomDB.getRooms(userSeq, page);

  const participatingRooms = rooms.filter(
    (room) => room._count.assignmentRoomParticipants > 0
  );
  const notParticipatingRooms = rooms.filter(
    (room) => room._count.assignmentRoomParticipants === 0
  );

  return (
    <>
      {/* todo 내가 참여한 방만 보기 */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-5 w-full">
        {participatingRooms.map((room) => (
          <Room
            key={room.seq}
            room={room}
            count={room.assignmentRoomParticipants.length}
            isParticipating={true}
          />
        ))}
        {notParticipatingRooms.map((room) => (
          <Room
            key={room.seq}
            room={room}
            count={room.assignmentRoomParticipants.length}
            isParticipating={false}
          />
        ))}
      </div>

      <Paging page={page} count={totalItemCount} unit={ROOM_PAGING_UNIT} />
    </>
  );
}
