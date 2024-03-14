import RoomDB from "@/server/prisma/room.db";
import AuthUtil from "@/server/utils/auth-util";
import TimeUtil from "@/server/utils/time-util";
import StarIcon from "@heroicons/react/24/solid/StarIcon";
import { AssignmentRoom } from "@prisma/client";
import Link from "next/link";

type Props = {
  room: AssignmentRoom;
};

export default async function ParticipantsTable(props: Props) {
  const userSeq = await AuthUtil.getUserSeqThrows();
  const { room } = props;
  const participants = await RoomDB.getParticipants(room.seq);

  return (
    <>
      <div className="overflow-auto p-4 max-h-[350px] shadow-md rounded-md">
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
            {participants?.map((p, index) => (
              <tr key={p.seq} className="hover">
                <th>{index + 1}</th>
                <th className="space-x-2 flex flex-row items-center">
                  <Link
                    href={
                      p.user.seq === userSeq
                        ? "/profile"
                        : `/profile/${p.user.uid}`
                    }
                    className="hover:text-gray-600"
                  >
                    <span>{p.user.nickname}</span>
                    {room.adminUserSeq === p.user.seq && (
                      <div className="tooltip" data-tip="방장">
                        <StarIcon className="size-4 text-yellow-300" />
                      </div>
                    )}
                  </Link>
                </th>
                <th>{TimeUtil.format(p.createdAt, "YYYY-MM-DD")}</th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
