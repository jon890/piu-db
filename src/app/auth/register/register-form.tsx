"use client";

import InputWithLabel from "@/components/InputWithLabel";
import { registerUser } from "@/server/action/register-user";
import { useFormState, useFormStatus } from "react-dom";

export default function RegisterForm() {
  const initialState = { message: undefined, errors: undefined };
  const [state, action] = useFormState(registerUser, initialState);
  const { pending } = useFormStatus();

  return (
    <form
      className="flex justify-center items-center w-1/2 flex-col"
      action={action}
    >
      <InputWithLabel
        topLeft="아이디"
        placeholder="아이디를 입력해주세요"
        name="name"
        errors={state?.errors?.name}
      />

      <InputWithLabel
        type="password"
        topLeft="비밀번호"
        placeholder="비밀번호를 입력해주세요"
        name="password"
        errors={state?.errors?.password}
      />
      <InputWithLabel
        type="password"
        topLeft="비밀번호 확인"
        placeholder="비밀번호 확인을 입력해주세요"
        name="passwordConfirm"
        errors={state?.errors?.passwordConfirm}
      />
      <InputWithLabel
        topLeft="닉네임"
        placeholder="닉네임을 입력해주세요"
        name="nickname"
        errors={state?.errors?.nickname}
      />

      <button
        className="btn btn-primary w-full max-w-md mt-5"
        type="submit"
        aria-disabled={pending}
      >
        회원가입
      </button>

      <div className="mt-6 text-sm text-red-500 font-bold">{state.message}</div>
    </form>
  );
}
