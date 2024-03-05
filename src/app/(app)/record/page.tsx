import { redirect } from "next/navigation";
import { Suspense } from "react";
import MyRecords from "./my-records";

type Props = {
  searchParams: {
    page?: string;
  };
};

export default async function RecordPage(props: Props) {
  const maybePage = props?.searchParams?.page;
  if (!Boolean(maybePage)) {
    redirect("/record?page=1");
  }

  const page = Number(maybePage);

  return (
    <div className="flex flex-col items-center justify-start w-full h-full gap-10 px-3 py-10">
      <h1 className="text-3xl font-semibold">내 기록</h1>

      <Suspense fallback={<p>기록을 읽고 있습니다...</p>}>
        <MyRecords page={page} />
      </Suspense>
    </div>
  );
}
