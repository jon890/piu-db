import RecordTable from "@/components/record-table";
import RecordDB from "@/server/prisma/record.db";
import AuthUtil from "@/server/utils/auth-util";
import { redirect } from "next/navigation";
import { Suspense } from "react";

type Props = {
  searchParams: {
    page?: string;
  };
};

export default async function RecordPage({ searchParams: { page } }: Props) {
  if (!page) {
    redirect("/record?page=1");
  }

  const currentPage = Number(page);

  const userSeq = await AuthUtil.getUserSeqThrows();
  const { count, records, unit } = await RecordDB.getRecords(
    userSeq,
    currentPage
  );

  return (
    <div className="flex flex-col items-center justify-start w-full h-full gap-10 px-3 py-10">
      <Suspense fallback={<p>기록을 읽고 있습니다...</p>}>
        <RecordTable
          records={records}
          paging={{ currentPage, totalElements: count, unit }}
        />
      </Suspense>
    </div>
  );
}
