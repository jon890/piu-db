"use client";

import useToast from "@/client/hooks/use-toast";
import FormButton from "@/components/FormButton";
import { AssignmentRoom } from "@prisma/client";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { syncRecord } from "./record-sync-action";

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
  }, [state]);

  return (
    <form action={action} className="flex justify-center items-center">
      <input type="hidden" name="roomSeq" defaultValue={room.seq} />
      <FormButton text={"숙제 기록 동기화"} className="text-xs sm:text-sm" />
    </form>
  );
}