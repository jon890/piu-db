import RecordTable from "@/components/record-table";
import RecordDB from "@/server/prisma/record.db";
import AuthUtil from "@/server/utils/auth-util";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { z } from "zod";

type Props = {
  searchParams: {
    page?: string;
  };
};

const ParamSchema = z.object({
  page: z.coerce.number().min(1).optional(),
  userSeq: z.coerce.number().min(1),
});

export default async function MyRecordPage({ searchParams: { page } }: Props) {
  const userSeq = await AuthUtil.getUserSeqThrows();

  const validated = ParamSchema.safeParse({
    page,
    userSeq,
  });

  if (!validated.success) {
    notFound();
  }

  if (!validated.data.page) {
    redirect("/records/my?page=1");
  }

  return (
    <section className="flex flex-col items-center justify-start w-full h-full gap-10 px-3 py-10">
      <Suspense fallback={<p>기록을 읽고 있습니다...</p>}>
        <RecordTableWrapper
          userSeq={validated.data.userSeq}
          currentPage={validated.data.page}
        />
      </Suspense>
    </section>
  );
}

async function RecordTableWrapper({
  userSeq,
  currentPage,
}: {
  userSeq: number;
  currentPage: number;
}) {
  const { count, records, unit } = await RecordDB.getRecords(
    userSeq,
    currentPage
  );

  return (
    <RecordTable
      records={records}
      paging={{ currentPage, totalElements: count, unit }}
    />
  );
}
