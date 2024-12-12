import ResponsiveTableBody from "@/components/common/responsive-table-body";
import LevelBall from "@/components/level-ball";
import RecordGrade from "@/components/record/record-grade";
import RecordPlate from "@/components/record/record-plate";
import PumbilityRankingDb from "@/server/prisma/pumbility-ranking.db";
import TimeUtil from "@/server/utils/time-util";
import { Record } from "@prisma/client";
import Link from "next/link";

type Props = {};

export default async function PumbilityRankingTable({}: Props) {
  const rankings = await PumbilityRankingDb.findAll();

  return (
    <>
      <h2 className="text-xl font-semibold">펌빌리티 랭킹</h2>

      <div className="overflow-x-auto max-w-full">
        <table className="table table-xs">
          <thead>
            <tr className="text-center">
              <th>랭킹</th>
              <th>게임아이디</th>
              <th>점수</th>
              <th>점수 변동량</th>
              <th>랭킹 변동</th>
              <th>마지막 점수 변경시간</th>
            </tr>
          </thead>

          <ResponsiveTableBody>
            {(classname) =>
              rankings.length > 0 ? (
                rankings.map((ranking) => (
                  <tr key={ranking.seq} className={classname}>
                    <td>{ranking.rank}</td>
                    <td>{ranking.gameId}</td>
                    <td>{ranking.score}</td>
                    <td>{ranking.deltaScore}</td>
                    <td>{ranking.deltaRank}</td>
                    <td>
                      {TimeUtil.format(
                        ranking.officialUpdatedAt,
                        "YYYY-MM-DD hh:mm:ss"
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={13} className="text-center h-24">
                    랭킹 정보를 불러오지 못했습니다.
                  </td>
                </tr>
              )
            }
          </ResponsiveTableBody>
        </table>
      </div>
    </>
  );
}
