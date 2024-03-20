"use client";

import useToast from "@/client/hooks/use-toast";
import { participateRoom } from "@/server/action/participate.action";
import { AssignmentRoom } from "@prisma/client";
import { useState } from "react";

interface ParticipateFormProps {
  room: AssignmentRoom;
  isParticipated: boolean;
}

export default function ParticipateButton({
  room,
  isParticipated,
}: ParticipateFormProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  async function participate() {
    setLoading(true);

    const res = await participateRoom(room.seq);

    toast.createToast({
      type: res.ok ? "success" : "error",
      message: res.message ?? "",
    });

    setLoading(false);
  }

  if (isParticipated) return null;

  if (room.stopParticipating) {
    return (
      <button
        className="btn btn-primary text-xs sm:text-sm"
        disabled
        aria-disabled
      >
        해당 방은 참여가 제한되어있습니다
      </button>
    );
  }

  return isParticipated ? null : (
    <button
      onClick={() => {
        participate;
      }}
      className="btn btn-primary text-xs sm:text-sm"
      disabled={loading}
      aria-disabled={loading}
    >
      {loading ? "잠시만 기다려주세요... " : "숙제방 참여"}
    </button>
  );
}
