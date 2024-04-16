import ParticipateButton from "@/app/(app)/rooms/[id]/(participate)/button";
import SyncAssignmentButton from "@/app/(app)/rooms/[id]/(sync-assignment)/button";
import AuthUtil from "@/server/utils/auth-util";
import CookieUtil from "@/server/utils/cookie-util";
import EllipsisVerticalIcon from "@heroicons/react/24/solid/EllipsisVerticalIcon";
import { AssignmentRoom } from "@prisma/client";
import Link from "next/link";

type Props = {
  room: AssignmentRoom;
  isParticipated: boolean;
};

export default async function RoomMenu({ room, isParticipated }: Props) {
  const userSeq = await AuthUtil.getUserSeqThrows();
  const piuAuthValue = await CookieUtil.getPiuAuthValue();

  const assignmentAuthority =
    !Boolean(room?.selectSongAuthorityUsers) ||
    (room?.selectSongAuthorityUsers as number[]).includes(userSeq);

  return (
    <details className="dropdown dropdown-top dropdown-end fixed bottom-10 right-10 z-10">
      <summary
        className="p-3 rounded-full bg-primary shadow-md shadow-black
      hover:bg-opacity-80 active:bg-opacity-80 transition-colors cursor-pointer animate-bounce
      flex justify-center items-center"
      >
        <EllipsisVerticalIcon className="size-9 text-white" />
      </summary>
      <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
        {isParticipated ? (
          <>
            {assignmentAuthority ? (
              <li>
                <Link href={`/rooms/${room.seq}/assignments/create`}>
                  숙제 만들기
                </Link>
              </li>
            ) : (
              <button className="btn btn-disabled">
                숙제를 만들 수 있는 권한이 없습니다
              </button>
            )}
            <li>
              <SyncAssignmentButton room={room} piuAuth={piuAuthValue} />
            </li>

            {room.adminUserSeq === userSeq && (
              <li>
                <Link href={`/rooms/${room.seq}/settings`}>방 설정 변경</Link>
              </li>
            )}

            <li>
              <button className="btn btn-disabled">숙제 랭킹 (준비 중)</button>
            </li>
          </>
        ) : (
          <li>
            <ParticipateButton room={room} isParticipated={isParticipated} />
          </li>
        )}
      </ul>
    </details>
  );
}
