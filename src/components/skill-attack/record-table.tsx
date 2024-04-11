import LevelBall from "@/components/level-ball.server";
import RecordGrade from "@/components/record/record-grade";
import RecordPlate from "@/components/record/record-plate";
import ChartDB from "@/server/prisma/chart.db";
import SongDB from "@/server/prisma/song.db";
import { Record } from "@prisma/client";
import Link from "next/link";
import { getSkillPoint } from "@/utils/skill-point.util";

type Props = {
  records: Record[];
};

export default async function SkillAttackRecordTable({ records }: Props) {
  const recordWithSong = await Promise.all(
    records.map(async (record) => {
      const chart = await ChartDB.findBySeq(record.chartSeq);
      const song = chart?.songSeq
        ? await SongDB.findBySeq(chart.songSeq)
        : null;

      return {
        ...record,
        chart,
        song,
        skillPoint: chart ? getSkillPoint(record.score, chart) : "0",
      };
    })
  );

  return (
    <>
      <h2 className="text-xl font-semibold">스킬 어택 대상곡 목록</h2>

      <div className="overflow-x-auto max-w-full">
        <p className="text-xs text-gray-500 text-end mb-3">
          * 곡 이름 클릭 시 상세 페이지로 이동합니다
        </p>

        <table className="table table-xs">
          <thead>
            <tr>
              <th></th>
              <th>곡명</th>
              <th>레벨</th>
              <th>점수</th>
              <th>스킬포인트</th>
              <th>그레이드</th>
              <th>플레이트</th>
            </tr>
          </thead>
          <tbody>
            {recordWithSong.length > 0 ? (
              recordWithSong
                .sort((a, b) => Number(b.skillPoint) - Number(a.skillPoint))
                .map((record, index) => (
                  <tr
                    key={record.seq}
                    className="*:text-xs *:px-1 *:py-1 *:sm:px-2 *:sm:py-1 *:md:text-sm *:md:px-4 *:md:py-2 hover"
                  >
                    <td>{index + 1}</td>
                    <td>
                      {record.song && record.chart && (
                        <Link
                          href={`/songs/${record.song.seq}?page=1&chartSeq=${record.chartSeq}`}
                          className="hover:text-gray-600 max-w-20 sm:max-w-32 block text-ellipsis whitespace-nowrap overflow-hidden"
                        >
                          {record.song.name}
                        </Link>
                      )}
                    </td>
                    <td>
                      {record.chart && (
                        <LevelBall className="size-6" chart={record.chart} />
                      )}
                    </td>
                    <td>{record.score}</td>
                    <td>{record.chart && record.skillPoint}</td>
                    <td>
                      <RecordGrade
                        grade={record.grade}
                        isBreakOff={record.isBreakOff}
                      />
                    </td>
                    <td>
                      {record.plate && <RecordPlate plate={record.plate} />}
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan={13} className="text-center h-24">
                  아직 플레이 기록이 없습니다! <br />
                  플레이하고 기록을 등록해보세요
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
