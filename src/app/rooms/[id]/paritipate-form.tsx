"use client";

import { participateRoom } from "@/server/action/participate-room";
import { AssignmentRoom } from "@prisma/client";
import { useFormState, useFormStatus } from "react-dom";

export interface ParticipateFormProps {
  room: AssignmentRoom;
}

export default function ParticipateForm({ room }: ParticipateFormProps) {
  const initialState = {
    errors: undefined,
    message: undefined,
  };
  const [state, action] = useFormState(participateRoom, initialState);
  const { pending } = useFormStatus();

  console.log(state);

  return (
    <form action={action}>
      <input type="hidden" name="roomSeq" defaultValue={room.seq} />
      <button className="btn btn-primary" aria-disabled={pending}>
        참여하기
      </button>
    </form>
  );
}
