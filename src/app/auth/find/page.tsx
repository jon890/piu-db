"use client";

import InputWithLabel from "@/components/common/input-with-label";
import AuthTopBar from "@/components/layout/auth-top-bar";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { findIdAction } from "./action";
import useToast from "@/client/hooks/use-toast";
import FormButton from "@/components/common/form-button";

export default function IdPasswordFindPage() {
  const [state, action] = useFormState(findIdAction, null);
  const toast = useToast();

  useEffect(() => {
    if (state?.ok === false) {
      toast.createToast({
        message: state?.message ?? "오류가 발생했습니다",
        type: "error",
      });
    } else {
      alert(JSON.stringify(state));
    }
  }, [state]);

  return (
    <>
      <AuthTopBar title="아이디/비밀번호 찾기" />
      <p>* 연동된 펌프잇업 계정으로 아이디/비밀번호를 찾습니다</p>
      <form
        action={action}
        className="flex justify-center items-center flex-col w-full max-w-md mt-5"
      >
        <InputWithLabel
          topLeft="펌프잇업 아이디"
          topRight="* 공식 홈페이지 로그인 계정 정보를 입력해주세요"
          topRightClass="text-red-500"
          placeholder="아이디를 입력해주세요"
          name="email"
          errors={state?.paramErrors?.fieldErrors?.email}
        />

        <InputWithLabel
          type="password"
          topLeft="펌프잇업 비밀번호"
          placeholder="비밀번호를 입력해주세요"
          name="password"
          errors={state?.paramErrors?.fieldErrors?.password}
        />

        <FormButton
          text="로그인"
          className="mt-5"
          loadingText="잠시만 기다려주세요... (최대 10초정도 소요됩니다..)"
        />
      </form>
    </>
  );
}
