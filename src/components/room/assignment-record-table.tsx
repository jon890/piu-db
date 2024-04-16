import classnames from "@/utils/classnames";
import RecordGrade from "@/components/record/record-grade";
import RecordPlate from "@/components/record/record-plate";
import AssignmentRecordDB from "@/server/prisma/assignment-record.db";
import AuthUtil from "@/server/utils/auth-util";
import TimeUtil from "@/server/utils/time-util";
import TrophyIcon from "@heroicons/react/24/solid/TrophyIcon";
import type { AssignmentRoom } from "@prisma/client";
import Link from "next/link";

type Props = {
  room: AssignmentRoom;
  assignmentSeq: number;
};

export default async function AssignmentRecordTable({
  room,
  assignmentSeq,
}: Props) {
  const userSeq = await AuthUtil.getUserSeqThrows();
  const records =
    await AssignmentRecordDB.getRecordsByAssgimentSeq(assignmentSeq);

  return (
    <div className="overflow-x-auto shadow-md p-4 max-w-full">
      <h3 className="text-center font-semibold p-2">순위표</h3>
      <p className="text-xs text-gray-500 text-end">
        * 플레이트가 존재하지 않는 기록은 브레이크 오프기록 입니다.
        <br />* 점수를 클릭하면 자세하게 볼 수 있습니다
      </p>
      <table className="table">
        <thead>
          <tr className="*:text-center">
            <th>등수</th>
            <th>닉네임</th>
            <th>점수</th>
            <th></th>
            <th></th>
            <th>플레이시간</th>
          </tr>
        </thead>
        <tbody>
          {records.length ? (
            records.map(({ record, user }, index) => (
              <tr
                key={index}
                className="*:text-xs *:px-2 *:py-1 *:sm:text-sm *:sm:px-4 *:sm:py-2 hover"
              >
                <td>
                  {index < 3 ? (
                    <div className="flex items-center">
                      <TrophyIcon
                        className={classnames("size-6", {
                          "text-[#ffd700]": index === 0,
                          "text-[#C0C0C0]": index === 1,
                          "text-[#CD7F32]": index === 2,
                        })}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center">{index + 1}위</div>
                  )}
                </td>
                <td>
                  <Link
                    href={
                      user.seq === userSeq ? "/profile" : `/profile/${user.uid}`
                    }
                    className="hover:text-gray-600"
                  >
                    {user.nickname}
                  </Link>
                </td>
                <td>
                  <Link
                    href={`/records/${record.seq}`}
                    className="hover:text-gray-500"
                  >
                    {record.score}
                  </Link>
                </td>
                <td>
                  <RecordGrade
                    grade={record.grade}
                    isBreakOff={record.isBreakOff}
                  />
                </td>
                <td>{record.plate && <RecordPlate plate={record.plate} />}</td>
                <td className="text-center">
                  {TimeUtil.format(record.playedAt, "YYYY-MM-DD")}
                  <br />
                  {TimeUtil.format(record.playedAt, "HH:mm:ss")}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center h-24">
                아직 플레이 기록이 없습니다! <br />
                플레이하고 기록을 등록해보세요
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
