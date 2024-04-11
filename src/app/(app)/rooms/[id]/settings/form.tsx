"use client";

import useToast from "@/client/hooks/use-toast";
import FormButton from "@/components/FormButton";
import InputWithLabel from "@/components/common/input-with-label";
import type { AssignmentRoom } from "@prisma/client";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { changeRoomSettings } from "./action";

type Props = {
  room: AssignmentRoom;
};

export default function RoomSettingsForm({ room }: Props) {
  const [state, action] = useFormState(changeRoomSettings, null);
  const toast = useToast();

  useEffect(() => {
    if (state?.ok === false) {
      toast.createToast({
        type: "error",
        message: state?.message ?? "오류가 발생했습니다",
      });
    }
  }, [state]);

  return (
    <form
      className="flex justify-center items-center max-w-md w-full flex-col gap-3"
      action={action}
    >
      <input type="hidden" name="room_seq" value={room.seq} />
      <InputWithLabel
        topLeft="방 이름"
        placeholder="이름을 입력해주세요"
        name="name"
        aria-describedby="name-error"
        errors={state?.paramErrors?.fieldErrors?.name}
        defaultValue={room.name}
      />

      <InputWithLabel
        topLeft="설명"
        placeholder="설명을 입력해주세요 (선택)"
        name="description"
        aria-describedby="name-error"
        errors={state?.paramErrors?.fieldErrors.description}
        defaultValue={room.description ?? ""}
      />

      <InputWithLabel
        topLeft="배너 이미지"
        placeholder="배너 이미지 링크 (선택)"
        name="bannerImage"
        aria-describedby="bannerImage-error"
        errors={state?.paramErrors?.fieldErrors.bannerImage}
        defaultValue={room.bannerImage ?? ""}
      />

      <div className="form-control w-full max-w-md">
        <label className="label cursor-pointer">
          <span className="label-text">다른 유저 참여 제한</span>
          <input
            type="checkbox"
            name="stopParticipating"
            defaultChecked={room.stopParticipating}
            className="checkbox checkbox-primary"
          />
        </label>
        {state?.paramErrors?.fieldErrors?.stopParticipating && (
          <div
            id={`${"stopParticipating"}-error`}
            aria-live="polite"
            className="text-sm text-red-500 font-semibold text-center mt-1"
          >
            {state?.paramErrors?.fieldErrors?.stopParticipating.map(
              (error: string) => <p key={error}>{error}</p>
            )}
          </div>
        )}
      </div>

      <FormButton text="변경" className="mt-5" />
    </form>
  );
}
