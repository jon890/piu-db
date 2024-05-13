"use client";

import useToast from "@/client/hooks/use-toast";
import { participateRoomAction } from "@/server/action/participate-room.action";
import { AssignmentRoom } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  room: AssignmentRoom;
  isParticipated: boolean;
};

export default function ParticipateButton({ room, isParticipated }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  async function participate() {
    setLoading(true);

    const res = await participateRoomAction(room.seq);

    toast.createToast({
      type: res.ok ? "success" : "error",
      message: res?.message ?? "",
    });

    setLoading(false);
    router.refresh();
  }

  if (isParticipated) return null;

  if (room.stopParticipating) {
    return (
      <button disabled aria-disabled className="btn btn-disabled">
        일시적으로 참여가 제한되어 있습니다
      </button>
    );
  }

  return isParticipated ? null : (
    <button onClick={participate} disabled={loading} aria-disabled={loading}>
      {loading ? "잠시만 기다려주세요... " : "숙제방 참여"}
    </button>
  );
}
