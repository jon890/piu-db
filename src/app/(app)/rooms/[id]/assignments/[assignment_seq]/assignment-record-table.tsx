import classnames from "@/client/utils/classnames";
import RecordGrade from "@/components/record/record-grade";
import RecordPlate from "@/components/record/record-plate";
import AssignmentRecordDB from "@/server/prisma/assignment-record.db";
import AuthUtil from "@/server/utils/auth-util";
import TimeUtil from "@/server/utils/time-util";
import TrophyIcon from "@heroicons/react/24/solid/TrophyIcon";
import dayjs from "dayjs";
import Link from "next/link";

type Props = {
  assignmentSeq: number;
};

export default async function AssignmentRecordTable({ assignmentSeq }: Props) {
  const userSeq = await AuthUtil.getUserSeqThrows();
  const records = await AssignmentRecordDB.getRecordsByAssgimentSeq(
    assignmentSeq
  );

  return (
    <div className="overflow-x-auto shadow-md p-4 max-w-full">
      <h3 className="text-center font-semibold p-2">순위표</h3>
      <table className="table">
        <thead>
          <tr>
            <th>등수</th>
            <th>닉네임</th>
            <th>점수</th>
            <th>그레이드</th>
            <th>플레이트</th>
            <th>플레이시간</th>
          </tr>
        </thead>
        <tbody>
          {records.length ? (
            records
              .sort((a, b) => {
                if (b.record.score !== a.record.score) {
                  return b.record.score - a.record.score;
                } else {
                  const a_playedAt = dayjs(a.record.playedAt);
                  const b_playedAt = dayjs(b.record.playedAt);
                  if (a_playedAt.isBefore(b_playedAt)) {
                    return 1;
                  } else if (a_playedAt.isSame(b_playedAt)) {
                    return 0;
                  } else {
                    return -1;
                  }
                }
              })
              .map(({ record, user }, index) => (
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
                        user.seq === userSeq
                          ? "/profile"
                          : `/profile/${user.uid}`
                      }
                      className="hover:text-gray-600"
                    >
                      {user.nickname}
                    </Link>
                  </td>
                  <td>{record.score}</td>
                  <td>
                    <RecordGrade
                      grade={record.grade}
                      isBreakOff={record.isBreakOff}
                    />
                  </td>
                  <td>
                    {record.plate && <RecordPlate plate={record.plate} />}
                  </td>
                  <td>
                    {TimeUtil.format(record.playedAt, "YYYY-MM-DD HH:mm:ss")}
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
