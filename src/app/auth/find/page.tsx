"use client";

import useToast from "@/client/hooks/use-toast";
import AuthTopBar from "@/components/layout/auth-top-bar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ResetPasswordForm from "./(reset-password)/form";
import ValidateAccountForm from "./(validate-account)/form";

type State = {
  step: number;
  userId?: string;
};

export default function CrawlingPage() {
  const router = useRouter();
  const [state, setState] = useState<State>({ step: 0 });
  const toast = useToast();

  const handlLoginSuccess = (userId: string) => {
    setState((prev) => ({ ...prev, step: 1, userId }));
  };

  const handleResetPasswordSuccess = () => {
    toast.createToast({
      message: "비밀번호 초기화가 정상적으로 완료되었습니다",
      type: "success",
    });
    router.replace("/auth/login");
  };

  return (
    <>
      <AuthTopBar title="아이디/비밀번호 찾기" />
      {state.step === 0 && (
        <ValidateAccountForm onSuccess={handlLoginSuccess} />
      )}

      {state.step === 1 && (
        <>
          <h2 className="my-auto text-xl text-center">
            가입된 계정은 <strong>{state.userId}</strong> 입니다.
          </h2>

          <div className="flex flex-col w-full max-w-md gap-5 justify-center">
            <Link href="/auth/login" className="btn btn-primary">
              로그인 하러 가기
            </Link>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setState((prev) => ({ ...prev, step: 2 }));
              }}
            >
              비밀번호 초기화
            </button>
          </div>
        </>
      )}

      {state.step === 2 && state?.userId && (
        <ResetPasswordForm
          onSuccess={handleResetPasswordSuccess}
          userId={state.userId}
        />
      )}
    </>
  );
}
