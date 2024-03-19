"use client";

import { createRoom } from "@/app/(app)/rooms/create/action";
import useToast from "@/client/hooks/use-toast";
import FormButton from "@/components/FormButton";
import InputWithLabel from "@/components/common/InputWithLabel";
import { useEffect } from "react";
import { useFormState } from "react-dom";

export default function CreateRoomForm() {
  const [state, action] = useFormState(createRoom, null);
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
      className="flex justify-center items-center max-w-md w-full flex-col"
      action={action}
    >
      <InputWithLabel
        topLeft="방 이름"
        placeholder="이름을 입력해주세요"
        name="name"
        aria-describedby="name-error"
        errors={state?.errors.fieldErrors?.name}
      />

      <InputWithLabel
        topLeft="설명"
        placeholder="설명을 입력해주세요 (선택)"
        name="description"
        aria-describedby="name-error"
        errors={state?.errors.fieldErrors.description}
      />

      <InputWithLabel
        topLeft="배너 이미지"
        placeholder="배너 이미지 링크 (선택)"
        name="bannerImage"
        aria-describedby="bannerImage-error"
        errors={state?.errors.fieldErrors.bannerImage}
      />

      <FormButton text="방 생성" className="mt-5" />
    </form>
  );
}
