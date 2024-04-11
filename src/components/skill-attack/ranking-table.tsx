import classnames from "@/client/utils/classnames";
import SkillAttackDB from "@/server/prisma/skill-attack.db";
import AuthUtil from "@/server/utils/auth-util";
import TimeUtil from "@/server/utils/time-util";
import TrophyIcon from "@heroicons/react/24/solid/TrophyIcon";
import Link from "next/link";

type Props = {};

export default async function SkillAttackRankingTable({}: Props) {
  const userSeq = await AuthUtil.getUserSeqThrows();
  const rankings = await SkillAttackDB.getRanking(0);

  return (
    <>
      <h2 className="text-xl font-semibold">스킬 어택 랭킹</h2>

      <div className="overflow-x-auto max-w-full">
        <table className="table table-xs">
          <thead>
            <tr>
              <th></th>
              <th>스킬포인트</th>
              <th className="text-center">닉네임</th>
              <th>업데이트 시간</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((rank, index) => (
              <tr key={index}>
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
                    <div className="flex items-center justify-center">
                      {index + 1}위
                    </div>
                  )}
                </td>
                <td>{rank.skill_points.toFixed(3)}</td>
                <td className="text-center">
                  <Link
                    className="hover:text-gray-500"
                    href={
                      rank.user_seq === userSeq
                        ? `/profile`
                        : `/profile/${rank.uid}`
                    }
                  >
                    {rank.nickname}
                  </Link>
                </td>
                <td>
                  <div className="text-center">
                    <p>{TimeUtil.format(rank.created_at, "YYYY-MM-DD")}</p>
                    <p>{TimeUtil.format(rank.created_at, "HH:mm:ss")}</p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
