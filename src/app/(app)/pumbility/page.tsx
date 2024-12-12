import ContentBox from "@/components/layout/content-box";
import { Suspense } from "react";
import PumbilityRankingTable from "./pumbility-ranking-table";
import MyPumbility from "./my-pumbility";

export default async function PumbilityPage() {
  return (
    <ContentBox title="펌빌리티">
      <Suspense fallback={<p>로딩 중 입니다...</p>}>
        <MyPumbility />
      </Suspense>

      <Suspense fallback={<p>로딩 중 입니다...</p>}>
        <PumbilityRankingTable />
      </Suspense>
    </ContentBox>
  );
}
