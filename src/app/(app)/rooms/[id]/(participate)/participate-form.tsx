"use client";

import { participateRoom } from "@/app/(app)/rooms/[id]/(participate)/participate-action";
import FormButton from "@/components/FormButton";
import { AssignmentRoom } from "@prisma/client";
import { useFormState } from "react-dom";

interface ParticipateFormProps {
  room: AssignmentRoom;
  isParticipated: boolean;
}

export default function ParticipateForm({
  room,
  isParticipated,
}: ParticipateFormProps) {
  const [state, action] = useFormState(participateRoom, null);

  return (
    <form action={action} className="flex justify-center items-center">
      <input type="hidden" name="roomSeq" defaultValue={room.seq} />
      <FormButton
        text={isParticipated ? "참여 중 입니다" : "참여하기"}
        disabled={isParticipated}
        className="text-xs sm:text-sm"
      />
    </form>
  );
}
