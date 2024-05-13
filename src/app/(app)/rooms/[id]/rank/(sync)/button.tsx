"use client";

import useToast from "@/client/hooks/use-toast";
import { participateRoomAction } from "@/server/action/participate-room.action";
import { syncRoomRankAction } from "@/server/action/sync-room-rank.action";
import { AssignmentRoom } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  room: AssignmentRoom;
};

export default function SyncRoomRankButton({ room }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  async function participate() {
    setLoading(true);

    const res = await syncRoomRankAction(room.seq);

    toast.createToast({
      type: res.ok ? "success" : "error",
      message: res.message ?? "",
    });

    setLoading(false);

    router.refresh();
  }

  return (
    <button
      onClick={participate}
      disabled={loading}
      aria-disabled={loading}
      className="btn btn-primary"
    >
      {loading ? "잠시만 기다려주세요... " : "동기화"}
    </button>
  );
}
