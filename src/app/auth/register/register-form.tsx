"use client";

import { registerUser } from "@/app/auth/register/action";
import FormButton from "@/components/FormButton";
import InputWithLabel from "@/components/InputWithLabel";
import { useFormState } from "react-dom";

export default function RegisterForm() {
  const [state, action] = useFormState(registerUser, null);

  return (
    <form
      className="flex justify-center items-center w-1/2 flex-col"
      action={action}
    >
      <InputWithLabel
        topLeft="아이디"
        placeholder="아이디를 입력해주세요"
        name="name"
        errors={state?.errors?.fieldErrors.name}
      />

      <InputWithLabel
        type="password"
        topLeft="비밀번호"
        placeholder="비밀번호를 입력해주세요"
        name="password"
        errors={state?.errors?.fieldErrors?.password}
      />
      <InputWithLabel
        type="password"
        topLeft="비밀번호 확인"
        placeholder="비밀번호 확인을 입력해주세요"
        name="passwordConfirm"
        errors={state?.errors?.fieldErrors?.passwordConfirm}
      />
      <InputWithLabel
        topLeft="닉네임"
        placeholder="닉네임을 입력해주세요"
        name="nickname"
        errors={state?.errors?.fieldErrors?.nickname}
      />
      <FormButton text={"회원가입"} loadingText="잠시만 기다려주세요..." />

      <div className="mt-6 text-sm text-red-500 font-bold">
        {state?.message}
      </div>
    </form>
  );
}
