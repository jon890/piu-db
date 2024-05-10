"use client";

import useToast from "@/client/hooks/use-toast";
import { PiuProfile } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ContentBox from "@/components/layout/content-box";
import AuthTopBar from "@/components/layout/auth-top-bar";
import ValidateAccountForm from "./(validate-account)/form";
import Link from "next/link";

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

  const handleSelectProfile = async (profile: PiuProfile) => {
    setState((prev) => ({ ...prev, step: 2, selectedProfile: profile }));
    toast.createToast({
      type: "success",
      message: `${profile.gameId}를 주 계정으로 설정했습니다`,
    });
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
            <button className="btn btn-secondary">비밀번호 변경</button>
          </div>
        </>
      )}
    </>
  );
}
