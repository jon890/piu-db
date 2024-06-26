import CommonInView from "@/components/common/common-inview";
import ContentBox from "@/components/layout/content-box";
import RoomHelpButton from "@/components/room/room-help-button";
import RoomList from "@/components/room/room-list";
import RoomListSkeleton from "@/components/room/room-list-skeleton";
import PiuProfileDB from "@/server/prisma/piu-profile.db";
import AuthUtil from "@/server/utils/auth-util";
import Link from "next/link";
import { Suspense } from "react";

export default async function RoomListPage() {
  const userSeq = await AuthUtil.getUserSeqThrows();
  const isExistProfile = await PiuProfileDB.isExist(userSeq);

  return (
    <ContentBox title="숙제방 목록">
      {!isExistProfile && (
        <CommonInView>
          <div className="flex flex-col gap-2 justify-center items-center flex-wrap">
            <p className="text-lg font-semibold">처음 오셨나요?</p>
            <Link href="/piu-login" className="btn btn-success">
              펌프잇업 계정연동하러 가기
            </Link>
          </div>
        </CommonInView>
      )}

      <div className="flex flex-row gap-3 flex-wrap">
        <Link
          href="/rooms/create"
          className="btn btn-primary text-xs sm:text-sm"
        >
          숙제방 생성
        </Link>

        <RoomHelpButton />
      </div>

      <Suspense fallback={<RoomListSkeleton />}>
        <RoomList />
      </Suspense>
    </ContentBox>
  );
}
