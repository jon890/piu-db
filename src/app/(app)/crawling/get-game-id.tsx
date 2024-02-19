"use client";

import InputWithLabel from "@/components/InputWithLabel";
import { getGameId } from "@/server/action/get-game-id";
import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";

export type GetGameIdProps = {
  onSuccess?: (email: string, password: string) => void | Promise<void>;
};

export default function GetGameId({ onSuccess }: GetGameIdProps) {
  const initialState = {
    ok: false,
    errors: undefined,
    message: undefined,
  };
  const [state, action] = useFormState(getGameId, initialState);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state?.ok && emailRef.current && passwordRef.current) {
      onSuccess?.(emailRef.current.value, passwordRef.current.value);
    }
  }, [state?.ok, onSuccess, emailRef.current, passwordRef.current]);

  return (
    <form
      className="flex justify-center items-center w-1/2 flex-col"
      action={action}
    >
      <InputWithLabel
        topLeft="아이디"
        placeholder="아이디를 입력해주세요"
        name="email"
        errors={state?.errors?.email}
        inputRef={emailRef}
      />

      <InputWithLabel
        type="password"
        topLeft="비밀번호"
        placeholder="비밀번호를 입력해주세요"
        name="password"
        errors={state?.errors?.password}
        inputRef={passwordRef}
      />

      <SubmitButton />

      <div className="mt-6 text-sm text-red-500 font-bold">
        <p>{state?.message}</p>
        {state?.errors?.crawler && <p>{state?.errors?.crawler}</p>}
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      className="btn btn-primary w-full max-w-md mt-5"
      type="submit"
      aria-disabled={pending}
      disabled={pending}
    >
      {pending
        ? "로그인 중 입니다.. 잠시만 기다려 주세요"
        : "펌프잇업에 로그인"}
    </button>
  );
}
