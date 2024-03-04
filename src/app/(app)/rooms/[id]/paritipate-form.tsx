"use client";

import FormButton from "@/components/FormButton";
import { participateRoom } from "@/app/(app)/rooms/[id]/action";
import { AssignmentRoom } from "@prisma/client";
import { useFormState } from "react-dom";

export interface ParticipateFormProps {
  room: AssignmentRoom;
}

export default function ParticipateForm({ room }: ParticipateFormProps) {
  const [state, action] = useFormState(participateRoom, null);

  return (
    <form action={action}>
      <input type="hidden" name="roomSeq" defaultValue={room.seq} />
      <FormButton text="참여하기" />
    </form>
  );
}
