import RecordDB from "@/server/prisma/record.db";
import AuthUtil from "@/server/utils/auth-util";
import { Paging } from "./paging";
import dayjs from "dayjs";
import TimeUtil from "@/server/utils/time-util";

type MyRecordsProps = {
  page: number;
};

export default async function MyRecords({ page }: MyRecordsProps) {
  const userSeq = await AuthUtil.getUserSeqThrows();
  const { count, records, unit } = await RecordDB.getRecords(userSeq, page);

  return (
    <>
      <div className="overflow-x-auto w-full">
        <table className="table table-xs">
          <thead>
            <tr>
              <th></th>
              <th>게임 ID</th>
              <th>타입</th>
              <th>레벨</th>
              <th>곡명</th>
              <th>그레이드</th>
              <th>플레이트</th>
              <th>퍼펙트</th>
              <th>그레이트</th>
              <th>굿</th>
              <th>배드</th>
              <th>미스</th>
              <th>점수</th>
              <th>플레이시간</th>
            </tr>
          </thead>
          <tbody>
            {records.length > 0 ? (
              records.map((record, index) => (
                <tr key={record.seq} className="hover">
                  <td>{(page - 1) * unit + index + 1}</td>
                  <td>{record.piuProfile?.gameId}</td>
                  <td>{record.chart?.chartType}</td>
                  <td>{record.chart?.level}</td>
                  <td>{record.song?.name}</td>
                  <td>{record.grade}</td>
                  <td>{record.plate}</td>
                  <td>{record.perfect}</td>
                  <td>{record.great}</td>
                  <td>{record.good}</td>
                  <td>{record.bad}</td>
                  <td>{record.miss}</td>
                  <td>{record.score}</td>
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
                <td colSpan={13} className="text-center text-xl font-semibold">
                  데이터가 없습니다
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Paging page={page} count={count} unit={unit} basehref="/record" />
    </>
  );
}
