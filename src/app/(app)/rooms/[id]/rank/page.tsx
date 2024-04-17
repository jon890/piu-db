import ContentBox from "@/components/layout/content-box";
import RoomDB from "@/server/prisma/room.db";
import AuthUtil from "@/server/utils/auth-util";
import TimeUtil from "@/server/utils/time-util";
import StarIcon from "@heroicons/react/24/solid/StarIcon";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import SyncRoomRankButton from "./(sync)/button";

type Props = {
  params: { id: string };
};

export default async function AssignmentsPage({ params: { id } }: Props) {
  const roomSeq = Number(id);
  if (isNaN(roomSeq)) return notFound();

  const userSeq = await AuthUtil.getUserSeqThrows();
  const { room, isParticipated } = await RoomDB.getRoom(roomSeq, userSeq);

  if (!room) return notFound();
  if (!isParticipated) redirect(`/rooms/${room.seq}?message=FORBIDDEN`);

  const participants = await RoomDB.getParticipants(roomSeq);

  return (
    <ContentBox title={room.name} subTitle={"숙제 랭킹"}>
      {room.adminUserSeq === userSeq && <SyncRoomRankButton room={room} />}

      <div className="overflow-auto border p-4 rounded-2xl shadow-xl max-w-full">
        <p className="text-gray-500 text-xs text-right">
          * 점수 = 총 플레이 유저 - (등수 - 1)
          <br />* 예시&#41; 10명 제출한 숙제에서 1위 = 10 - (1 -1) = 10점
        </p>

        <table className="table">
          <thead>
            <tr className="*:text-center">
              <th></th>
              <th>닉네임</th>
              <th>1위</th>
              <th>2위</th>
              <th>3위</th>
              <th>총점</th>
              <th className="text-red-500">불참</th>
            </tr>
          </thead>
          <tbody>
            {participants
              .sort((a, b) => b.totalScore - a.totalScore)
              .map((p, index) => (
                <tr
                  key={p.seq}
                  className="*:text-xs *:px-1 *:py-0.5 *:sm:px-2 *:sm:py-1 *:md:text-sm *:md:px-4 *:md:py-2 *:text-center hover"
                >
                  <td>{index + 1}</td>
                  <td>
                    <p className="w-12 sm:w-auto text-ellipsis whitespace-nowrap overflow-hidden">
                      {p.user.nickname}
                    </p>
                  </td>
                  <td className="font-bold">
                    {(p.firstPlaceSeqs as number[] | null)?.length ?? 0}회
                  </td>
                  <td className="text-[#C0C0C0] font-semibold">
                    {(p.secondPlaceSeqs as number[] | null)?.length ?? 0}회
                  </td>
                  <td className="text-[#CD7F32] font-medium">
                    {(p.thirdPlaceSeqs as number[] | null)?.length ?? 0}회
                  </td>
                  <td>{p.totalScore}점</td>
                  <td>{p.notAttendCount}회</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </ContentBox>
  );
}
