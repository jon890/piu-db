"use client";

import { deleteAssignmentAction } from "@/app/(app)/rooms/[id]/assignments/[assignment_seq]/update/delete.action";
import { updateAssignmentAction } from "@/app/(app)/rooms/[id]/assignments/[assignment_seq]/update/update.action";
import useToast from "@/client/hooks/use-toast";
import FormButton from "@/components/FormButton";
import InputWithLabel from "@/components/common/input-with-label";
import CheckBox from "@/components/common/check-box";
import TimeUtil from "@/server/utils/time-util";
import type { Assignment } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";

type Props = {
  assignment: Assignment;
  disabled?: boolean;
};

export default function AssignmentInfoForm({ assignment, disabled }: Props) {
  const toast = useToast();
  const router = useRouter();
  const [updateState, updateAction] = useFormState(
    updateAssignmentAction,
    null
  );

  async function handleDelete() {
    const _confirm = confirm("정말 숙제를 삭제하시겠습니까?");

    if (_confirm) {
      const res = await deleteAssignmentAction(assignment.seq);
      if (res.ok) {
        toast.createToast({ message: "삭제되었습니다", type: "success" });
        router.replace(`/roooms/${assignment.roomSeq}`);
      }
      toast.createToast({
        message: res?.message ?? "오류가 발생했습니다",
        type: "error",
      });
    }
  }

  return (
    <form className="w-full max-w-md flex flex-col gap-2" action={updateAction}>
      <input type="hidden" name="assignment_seq" value={assignment.seq} />
      <input type="hidden" name="room_seq" value={assignment.roomSeq} />

      <InputWithLabel
        type="date"
        name="start_date"
        topLeft="시작일"
        topRight={`한국시간 : ${TimeUtil.format(assignment.startDate, "YYYY-MM-DD HH:mm:ss")}`}
        defaultValue={TimeUtil.formatUTC(assignment.startDate, "YYYY-MM-DD")}
        disabled={disabled}
      />
      <InputWithLabel
        type="date"
        name="end_date"
        topLeft="종료일"
        topRight={`한국시간 : ${TimeUtil.format(assignment.endDate, "YYYY-MM-DD HH:mm:ss")}`}
        defaultValue={TimeUtil.formatUTC(assignment.endDate, "YYYY-MM-DD")}
        disabled={disabled}
      />
      <InputWithLabel
        type="text"
        name="memo"
        topLeft="메모"
        defaultValue={assignment.memo ?? ""}
        disabled={disabled}
      />

      <CheckBox
        topLeft="브레이크 오프 허용 여부"
        name="enable_break_off"
        defaultChecked={assignment.enableBreakOff}
        disabled={disabled}
      />

      {!disabled && (
        <div className="flex flex-row gap-2 w-full">
          <button
            className="flex-1 btn btn-error"
            onClick={handleDelete}
            type="button"
          >
            삭제
          </button>
          <FormButton text="변경" className="flex-1" />
        </div>
      )}
    </form>
  );
}
