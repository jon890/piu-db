import classnames from "@/client/utils/classnames";
import DropDown from "@/components/common/dropdown";
import ContentBox from "@/components/layout/content-box";
import RecordTable from "@/components/record/record-table";
import ChartDB from "@/server/prisma/chart.db";
import RecordDB from "@/server/prisma/record.db";
import AuthUtil from "@/server/utils/auth-util";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { z } from "zod";
import SelectLevel from "./selet-level";

type Props = {
  searchParams: {
    page?: string;
  };
};

const ParamSchema = z.object({
  page: z.coerce.number().min(1).optional(),
  userSeq: z.coerce.number().min(1),
});

export default async function RecordPage({ searchParams: { page } }: Props) {
  // const validated = ParamSchema.safeParse({
  //   page,
  //   userSeq: await AuthUtil.getUserSeq(),
  // });

  // if (!validated.success) {
  //   notFound();
  // }

  // if (!validated.data.page) {
  //   redirect("/records?page=1");
  // }

  const allSongs = ChartDB.findAllGroupBySong();

  return (
    <ContentBox title="내 기록">
      <div className="flex flex-row justify-center items-center gap-3 flex-wrap">
        <SelectLevel />
      </div>
    </ContentBox>
  );
}
