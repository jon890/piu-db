import classnames from "@/client/utils/classnames";
import SkillAttackDB from "@/server/prisma/skill-attack.db";
import TrophyIcon from "@heroicons/react/24/solid/TrophyIcon";

type Props = {};

export default async function SkillAttackRankingTable({}: Props) {
  const ranking = await SkillAttackDB.getRanking(0);

  return (
    <>
      <h2 className="text-xl font-semibold">스킬 어택 랭킹</h2>

      <div className="overflow-x-auto max-w-full">
        <table className="table table-xs">
          <thead>
            <tr>
              <th></th>

              <th>스킬포인트</th>
              <th>닉네임</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((it, index) => (
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
                    <div className="flex items-center">{index + 1}위</div>
                  )}
                </td>
                <td>{it.skillPoint?.toFixed(3)}</td>
                <td>{it.user?.nickname}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
