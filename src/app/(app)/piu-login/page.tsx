"use client";

import useToast from "@/client/hooks/use-toast";
import { PiuProfile } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import GetGameId from "./(get-game-id)/form";
import PiuProfileList from "./(profile-list)/form";
import UseLoginCookie from "./(use-login-cookie)/form";

type State = {
  step: number;
  selectedProfile?: PiuProfile;
  email?: string;
  password?: string;
};

export default function CrawlingPage() {
  const router = useRouter();
  const [state, setState] = useState<State>({ step: 0 });
  const toast = useToast();

  const handlLoginSuccess = (email: string, password: string) => {
    setState((prev) => ({ ...prev, step: 1, email, password }));
  };

  const handleSelectProfile = (profile: PiuProfile) => {
    setState((prev) => ({ ...prev, step: 2, selectedProfile: profile }));
    toast.createToast({
      type: "success",
      message: `${profile.gameId}를 주 계정으로 설정했습니다`,
    });
  };

  const handleUseLoginCookie = () => {
    if (!state.email || !state.password) {
      toast.createToast({
        type: "error",
        message: "알 수 없는 오류로 실패했습니다.",
      });
      return;
    }
  };

  return (
    <section className="flex flex-col items-center justify-start w-full h-full gap-10 px-3 py-10">
      {state.step === 0 && (
        <>
          <h1 className="text-3xl mt-10">펌프잇업 로그인</h1>
          <h2 className="text-xl text-center">
            펌프잇업에 로그인하고 기록을 가져올
            <br /> 계정을 설정합니다
          </h2>
          <GetGameId onSuccess={handlLoginSuccess} />
        </>
      )}

      {state.step === 1 && (
        <>
          <h1 className="text-3xl mt-10">기록을 가져올 계정 선택</h1>
          <h2 className="text-xl text-center">
            펌프잇업에 로그인하고 기록을 가져올
            <br /> 계정을 설정합니다
          </h2>
          <PiuProfileList onSelect={handleSelectProfile} />
        </>
      )}

      {state.step === 2 && state.email && state.password && (
        <>
          <h1 className="text-3xl mt-10">(선택) 로그인 정보 브라우저에 저장</h1>
          <h2 className="text-xl text-center">
            숙제를 동기화할 때마다 로그인하지 않고
            <br />
            사용자의 브라우저에 로그인 정보를 암호화하여 저장합니다.
            <br />
            사용자는 언제든지 브라우저 설정을 통하여
            <br /> 해당 정보를 제거할 수 있습니다.
          </h2>
          <h3 className="text-lg text-center font-semibold text-red-500">
            * 정보는 최대 1달간 보관됩니다.
          </h3>

          <UseLoginCookie email={state.email} password={state.password} />
        </>
      )}
    </section>
  );
}
