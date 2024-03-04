import { auth } from "@/auth";
import RecordDB from "@/server/prisma/record.db";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type Props = {
  searchParams: {
    page?: string;
  };
};

export default function RecordPage(props: Props) {
  if (!Boolean(props.searchParams.page)) {
    redirect("/record?page=1");
  }

  return (
    <div className="flex flex-col items-center justify-start w-full h-full space-y-10">
      <h1 className="text-3xl mt-10">내 기록</h1>

      <Suspense fallback={<p>기록을 읽고 있습니다...</p>}>
        <MyRecords page={props.searchParams.page ?? "1"} />
      </Suspense>
    </div>
  );
}

async function MyRecords({ page }: { page: string }) {
  const session = await auth();
  const maybeUserSeq = session?.user?.email;

  if (maybeUserSeq == null) {
    return null;
  }

  const records = await RecordDB.getRecords(Number(maybeUserSeq), Number(page));

  return (
    <div className="overflow-x-auto w-full">
      <table className="table table-xs">
        <thead>
          <tr>
            <th></th>
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
                <td>{index + 1}</td>
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
                <td>{record.playedAt.toISOString()}</td>
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
  );
}
