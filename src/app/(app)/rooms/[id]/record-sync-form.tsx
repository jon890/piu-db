"use client";

import FormButton from "@/components/FormButton";
import { AssignmentRoom } from "@prisma/client";
import { useFormState } from "react-dom";
import { syncRecord } from "./record-sync-action";

type Props = {
  room: AssignmentRoom;
};

export default function RecordSyncForm({ room }: Props) {
  const [state, action] = useFormState(syncRecord, null);

  return (
    <form action={action} className="flex justify-center items-center">
      <input type="hidden" name="roomSeq" defaultValue={room.seq} />
      <FormButton text={"숙제 기록 동기화"} />
    </form>
  );
}
