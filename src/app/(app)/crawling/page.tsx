"use client";

import { PiuProfile } from "@prisma/client";
import { useState } from "react";
import GetGameId from "./(get-game-id)/form";
import GetRecentlyPlayed from "./(get-recently-played)/form";
import PiuProfileList from "./(profile-list)/form";

type State = {
  step: number;
  selectedProfile?: PiuProfile;
  email?: string;
  password?: string;
};

export default function CrawlingPage() {
  const [state, setState] = useState<State>({ step: 0 });

  const handlLoginSuccess = (email: string, password: string) => {
    console.log("login success");
    setState((prev) => ({ ...prev, step: 1, email, password }));
  };

  const handleSelectProfile = (profile: PiuProfile) => {
    console.log("selected profile");
    setState((prev) => ({ ...prev, step: 2, selectedProfile: profile }));
  };

  return (
    <div className="flex flex-col items-center justify-start h-full gap-10 w-[calc(100vw-20rem)] flex-1">
      {state.step === 0 && (
        <>
          <h1 className="text-3xl mt-10">Step1. 펌프잇업 로그인</h1>
          <GetGameId onSuccess={handlLoginSuccess} />
        </>
      )}

      {state.step === 1 && (
        <>
          <h1 className="text-3xl mt-10">Step2. 캐릭터 선택</h1>
          <PiuProfileList onSelect={handleSelectProfile} />
        </>
      )}

      {state.step === 2 && state.selectedProfile && (
        <>
          <h1 className="text-3xl mt-10">Step3. 최근 기록 불러오기</h1>
          <GetRecentlyPlayed
            profile={state.selectedProfile}
            email={state.email ?? ""}
            password={state.password ?? ""}
          />
        </>
      )}
    </div>
  );
}
