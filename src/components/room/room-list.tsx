import RoomDB from "@/server/prisma/room.db";
import Room from "./room";
import AuthUtil from "@/server/utils/auth-util";

export default async function RoomList() {
  const userSeq = await AuthUtil.getUserSeqThrows();
  const rooms = await RoomDB.getRooms(userSeq);

  const participatingRooms = rooms.filter(
    (room) => room._count.assignmentRoomParticipants > 0
  );
  const notParticipatingRooms = rooms.filter(
    (room) => room._count.assignmentRoomParticipants === 0
  );

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-5 w-full">
      {participatingRooms.map((r) => (
        <Room
          key={r.seq}
          room={r}
          count={r.assignmentRoomParticipants.length}
          isParticipating={true}
        />
      ))}
      {notParticipatingRooms.map((r) => (
        <Room
          key={r.seq}
          room={r}
          count={r.assignmentRoomParticipants.length}
          isParticipating={false}
        />
      ))}
    </div>
  );
}
