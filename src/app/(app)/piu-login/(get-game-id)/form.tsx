"use client";

import { getGameIdAction } from "@/app/(app)/piu-login/(get-game-id)/action";
import useToast from "@/client/hooks/use-toast";
import FormButton from "@/components/FormButton";
import InputWithLabel from "@/components/common/InputWithLabel";
import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";

type Props = {
  onSuccess?: (email: string, password: string) => void | Promise<void>;
};

export default function GetGameId({ onSuccess }: Props) {
  const [state, action] = useFormState(getGameIdAction, null);
  const toast = useToast();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state?.ok && emailRef.current && passwordRef.current) {
      onSuccess?.(emailRef.current.value, passwordRef.current.value);
    }
  }, [state?.ok, onSuccess]);

  useEffect(() => {
    if (state?.ok === false) {
      toast.createToast({
        message: state?.message ?? "오류가 발생했습니다",
        type: "error",
      });
    }
  }, [state?.message, state?.ok]);

  return (
    <form
      className="flex justify-center items-center w-full max-w-md flex-col gap-3"
      action={action}
    >
      <InputWithLabel
        topLeft="펌프잇업 아이디"
        topRight="* 공식 홈페이지 로그인 계정 정보를 입력해주세요"
        topRightClass="text-red-500"
        placeholder="아이디를 입력해주세요"
        name="email"
        errors={state?.paramErrors?.fieldErrors?.email}
        inputRef={emailRef}
      />

      <InputWithLabel
        type="password"
        topLeft="펌프잇업 비밀번호"
        placeholder="비밀번호를 입력해주세요"
        name="password"
        errors={state?.paramErrors?.fieldErrors?.password}
        inputRef={passwordRef}
      />

      <FormButton
        text="로그인"
        className="mt-5"
        loadingText="잠시만 기다려주세요... (최대 10초정도 소요됩니다..)"
      />
    </form>
  );
}
