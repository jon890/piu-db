import AuthUtil from "@/server/utils/auth-util";
import TimeUtil from "@/server/utils/time-util";
import StarIcon from "@heroicons/react/24/solid/StarIcon";
import { AssignmentRoom, AssignmentRoomParticipants } from "@prisma/client";
import Link from "next/link";

type Props = {
  participants: (AssignmentRoomParticipants & {
    user: { seq: number; nickname: string; uid: string };
  })[];
  room: AssignmentRoom;
};

export default async function ParticipantsTable(props: Props) {
  const userSeq = await AuthUtil.getUserSeqThrows();
  const { participants, room } = props;

  return (
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
                >
                  <span>{p.user.nickname}</span>
                  {room.adminUserSeq === p.user.seq && (
                    <div className="tooltip" data-tip="방장">
                      <StarIcon className="size-4 text-yellow-300" />
                    </div>
                  )}
                </Link>
              </th>
              <th>{TimeUtil.format(p.createdAt, "YYYY-MM-DD HH:mm")}</th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
