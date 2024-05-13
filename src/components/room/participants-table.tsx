import ParticipantsDB from "@/server/prisma/room-participants.db";
import AuthUtil from "@/server/utils/auth-util";
import TimeUtil from "@/server/utils/time-util";
import StarIcon from "@heroicons/react/24/solid/StarIcon";
import { AssignmentRoom } from "@prisma/client";
import Link from "next/link";

type Props = {
  room: AssignmentRoom;
};

/**
 * 참여자 목록 테이블
 * @param props
 * @returns
 */
export default async function ParticipantsTable({ room }: Props) {
  const userSeq = await AuthUtil.getUserSeqThrows();
  const participants = await ParticipantsDB.getByRoomWithUser(room.seq);

  return (
    <>
      <div className="overflow-auto max-h-[300px] border p-4 rounded-2xl shadow-xl">
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
            {participants.map((p, index) => (
              <tr key={p.seq} className="hover">
                <th>{index + 1}</th>
                <th>
                  <Link
                    href={
                      p.user.seq === userSeq
                        ? "/profile"
                        : `/profile/${p.user.uid}`
                    }
                    className="hover:text-gray-600 space-x-1 flex flex-row items-center"
                  >
                    <span>{p.user.nickname}</span>
                    {room.adminUserSeq === p.user.seq && (
                      <div className="tooltip" data-tip="방장">
                        <StarIcon className="size-4 text-yellow-300" />
                      </div>
                    )}
                  </Link>
                </th>
                <th>
                  {p.participateDate &&
                    TimeUtil.format(p.participateDate, "YYYY-MM-DD")}
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
