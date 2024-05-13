"use client";

import useToast from "@/client/hooks/use-toast";
import { exitRoomAction } from "@/server/action/exit-room.action";
import { AssignmentRoom } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  room: AssignmentRoom;
};

export default function RoomExitButton({ room }: Props) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  async function exitRoom() {
    setLoading(true);

    if (!confirm("정말 숙제방에서 나가시겠습니까?")) {
      setLoading(false);
      return;
    }

    const res = await exitRoomAction(room.seq);

    toast.createToast({
      type: res.ok ? "success" : "error",
      message: res?.message ?? "",
    });

    setLoading(false);
    if (res.ok) {
      router.push("/rooms");
    }
  }

  return (
    <button onClick={exitRoom} disabled={loading} aria-disabled={loading}>
      {loading ? "잠시만 기다려주세요... " : "숙제방 나가기"}
      <div className="badge badge-secondary">NEW</div>
    </button>
  );
}
