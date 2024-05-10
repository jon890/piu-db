"use client";

import useToast from "@/client/hooks/use-toast";
import FormButton from "@/components/common/form-button";
import InputWithLabel from "@/components/common/input-with-label";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { resetPasswordAction } from "./action";

type Props = {
  userId: string;
  onSuccess?: () => void;
};

export default function ResetPasswordForm({ onSuccess, userId }: Props) {
  const [state, action] = useFormState(resetPasswordAction, {
    step: 0,
    userId,
    ok: false,
  });
  const toast = useToast();

  useEffect(() => {
    if (state?.ok === false && state?.step === 1) {
      toast.createToast({
        message: state?.message ?? "오류가 발생했습니다",
        type: "error",
      });
    } else if (state?.ok == true && state?.step === 2) {
      onSuccess?.();
    }
  }, [state]);

  return (
    <>
      <form
        action={action}
        className="flex justify-center items-center flex-col w-full max-w-md mt-5"
      >
        <InputWithLabel
          type="password"
          topLeft="새 비밀번호"
          placeholder="비밀번호를 입력해주세요"
          name="password"
          errors={state?.paramErrors?.fieldErrors?.password}
        />

        <InputWithLabel
          type="password"
          topLeft="비밀번호 확인"
          placeholder="비밀번호를 입력해주세요"
          name="passwordConfirm"
          errors={state?.paramErrors?.fieldErrors?.password}
        />

        <FormButton
          text="비밀번호 초기화"
          className="mt-5"
          loadingText="잠시만 기다려주세요..."
        />
      </form>
    </>
  );
}
