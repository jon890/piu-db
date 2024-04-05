import CommonInView from "@/components/common/common-inview";
import ContentBox from "@/components/layout/content-box";
import RoomDB from "@/server/prisma/room.db";
import CookieUtil from "@/server/utils/cookie-util";
import Link from "next/link";
import { Suspense } from "react";
import HelpButton from "./help-button";
import Room from "./room";

export default async function RoomListPage() {
  const piuAuthValue = await CookieUtil.getPiuAuthValue();

  return (
    <ContentBox title="숙제방 목록">
      {!piuAuthValue && (
        <CommonInView>
          <div className="flex flex-col gap-2 justify-center items-center flex-wrap">
            <p className="text-lg font-semibold">처음 오셨나요?</p>
            <Link href="/piu-login" className="btn btn-success">
              펌프잇업 계정연동하러 가기
            </Link>
          </div>
        </CommonInView>
      )}

      <div className="flex flex-row gap-3">
        <Link
          href="/rooms/create"
          className="btn btn-primary text-xs sm:text-sm"
        >
          숙제방 생성
        </Link>

        <HelpButton />
      </div>

      <Suspense fallback={<RoomListSkeleton />}>
        <RoomList />
      </Suspense>
    </ContentBox>
  );
}

async function RoomList() {
  const rooms = await RoomDB.getRooms();

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-5 w-full">
      {rooms.map((r) => (
        <Room
          key={r.seq}
          room={r}
          count={r._count.assignmentRoomParticipants}
        />
      ))}
    </div>
  );
}

function RoomListSkeleton() {
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-5 w-full">
      {[...Array(10)].map((v, i) => (
        <div className="skeleton w-full h-48" key={i}></div>
      ))}
    </div>
  );
}
