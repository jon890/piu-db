"use client";

import { getGameIdAction } from "@/app/(app)/crawling/(get-game-id)/action";
import FormButton from "@/components/FormButton";
import InputWithLabel from "@/components/InputWithLabel";
import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";

export type GetGameIdProps = {
  onSuccess?: (email: string, password: string) => void | Promise<void>;
};

export default function GetGameId({ onSuccess }: GetGameIdProps) {
  const [state, action] = useFormState(getGameIdAction, null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state?.ok && emailRef.current && passwordRef.current) {
      onSuccess?.(emailRef.current.value, passwordRef.current.value);
    }
  }, [state?.ok, onSuccess]);

  return (
    <form
      className="flex justify-center items-center w-full max-w-md flex-col"
      action={action}
    >
      <InputWithLabel
        topLeft="아이디"
        placeholder="아이디를 입력해주세요"
        name="email"
        errors={state?.paramErrors?.fieldErrors?.email}
        inputRef={emailRef}
      />

      <InputWithLabel
        type="password"
        topLeft="비밀번호"
        placeholder="비밀번호를 입력해주세요"
        name="password"
        errors={state?.paramErrors?.fieldErrors?.password}
        inputRef={passwordRef}
      />

      <FormButton text="펌프잇업 로그인" className="mt-5" />

      <div className="mt-6 text-sm text-red-500 font-bold">
        <p>{state?.message}</p>
        {state?.error && <p>{state?.error}</p>}
      </div>
    </form>
  );
}
