"use client";

import { registerUser } from "@/app/auth/register/action";
import FormButton from "@/components/FormButton";
import InputWithLabel from "@/components/common/input-with-label";
import AuthTopBar from "@/components/layout/auth-top-bar";
import { ChangeEventHandler, useState } from "react";
import { useFormState } from "react-dom";

export default function RegisterPage() {
  const [state, action] = useFormState(registerUser, null);
  const [name, setName] = useState<string>("");

  const handleChangeName: ChangeEventHandler<HTMLInputElement> = (e) => {
    const replaced = e.target.value.replaceAll(
      /[`~!@#$%^&*()_|+\-=?;:'"<>\{\}\[\]\\\/ ]/g,
      ""
    );
    setName(replaced);
  };

  return (
    <>
      <AuthTopBar title="회원가입" />
      <form
        className="flex justify-center items-center w-full flex-col max-w-md"
        action={action}
      >
        <InputWithLabel
          topLeft="아이디"
          topRight="* 아이디는 특수문자를 입력할 수 없습니다."
          topRightClass="text-red-500"
          placeholder="아이디를 입력해주세요"
          name="name"
          errors={state?.errors?.fieldErrors.name}
          onChange={handleChangeName}
          value={name}
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
        <FormButton
          text={"회원가입"}
          loadingText="잠시만 기다려주세요..."
          className="mt-5"
        />

        <div className="mt-6 text-sm text-red-500 font-bold">
          {state?.message}
        </div>
      </form>
    </>
  );
}
