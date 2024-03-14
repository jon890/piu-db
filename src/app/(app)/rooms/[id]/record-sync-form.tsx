"use client";

import FormButton from "@/components/FormButton";
import { AssignmentRoom } from "@prisma/client";
import { useFormState } from "react-dom";
import { syncRecord } from "./record-sync-action";
import { useEffect } from "react";
import useToast from "@/client/hooks/use-toast";

type Props = {
  room: AssignmentRoom;
};

export default function RecordSyncForm({ room }: Props) {
  const toast = useToast();
  const [state, action] = useFormState(syncRecord, null);

  useEffect(() => {
    if (state?.message) {
      toast.createToast({ message: state?.message, type: "info" });
    }
  }, [state?.message, toast]);

  return (
    <form action={action} className="flex justify-center items-center">
      <input type="hidden" name="roomSeq" defaultValue={room.seq} />
      <FormButton text={"숙제 기록 동기화"} />
    </form>
  );
}
