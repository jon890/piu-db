import LevelBall from "@/components/level-ball.server";
import { Paging } from "@/components/paging";
import RecordGrade from "@/components/record-grade";
import RecordPlate from "@/components/record-plate";
import ChartDB from "@/server/prisma/chart.db";
import SongDB from "@/server/prisma/song.db";
import TimeUtil from "@/server/utils/time-util";
import { Record } from "@prisma/client";
import Link from "next/link";

type Paging = {
  unit: number;
  currentPage: number;
  totalElements: number;
};

type Props = {
  records: (Record & { piuProfile?: { gameId: string } })[];
  paging: Paging;
};

export default async function RecordTable({ records, paging }: Props) {
  const recordWithSong = await Promise.all(
    records.map(async (record) => {
      const chart = await ChartDB.findChartBySeqInCache(record.chartSeq);
      const song = chart?.songSeq
        ? await SongDB.findSongBySeqInCache(chart.songSeq)
        : null;

      return { ...record, chart, song };
    })
  );

  return (
    <>
      <h2 className="text-xl font-semibold">기록 목록</h2>

      <div className="overflow-x-auto w-full">
        <p className="text-red-500 text-xs text-right">
          * 플레이시간으로 정렬 중 입니다.
        </p>

        <table className="table table-xs">
          <thead>
            <tr>
              <th></th>
              <th>게임 ID</th>
              <th>레벨/타입</th>
              <th>곡명</th>
              <th>점수</th>
              <th>그레이드</th>
              <th>플레이트</th>
              <th>퍼펙트</th>
              <th>그레이트</th>
              <th>굿</th>
              <th>배드</th>
              <th>미스</th>
              <th>플레이시간</th>
            </tr>
          </thead>
          <tbody>
            {recordWithSong.length > 0 ? (
              recordWithSong.map((record, index) => (
                <tr key={record.seq} className="hover">
                  <td>{(paging.currentPage - 1) * paging.unit + index + 1}</td>
                  <td>{record.piuProfile?.gameId}</td>
                  <td>
                    {record.chart && (
                      <LevelBall className="size-6" chart={record.chart} />
                    )}
                  </td>
                  <td>
                    {record.song?.name && record.song?.seq && (
                      <Link
                        href={`/songs/${record.song.seq}`}
                        className="hover:text-gray-600"
                      >
                        {record.song?.name}
                      </Link>
                    )}
                  </td>
                  <td>{record.score}</td>
                  <td>
                    <RecordGrade grade={record.grade} />
                  </td>
                  <td>
                    <RecordPlate plate={record.plate} />
                  </td>
                  <td>{record.perfect}</td>
                  <td>{record.great}</td>
                  <td>{record.good}</td>
                  <td>{record.bad}</td>
                  <td>{record.miss}</td>

                  <td>
                    <span>
                      {TimeUtil.format(record.playedAt, "YYYY-MM-DD")}
                    </span>
                    <br />
                    <span>{TimeUtil.format(record.playedAt, "HH:mm:ss")}</span>
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

      <Paging
        page={paging.currentPage}
        count={paging.totalElements}
        unit={paging.unit}
        basehref="/record"
      />
    </>
  );
}
