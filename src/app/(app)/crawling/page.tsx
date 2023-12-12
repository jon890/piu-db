"use client";

import { useState } from "react";
import GetGameIdForm from "./get-game-id-form";
import PiuProfileList from "./piu-profile-list";

export default function CrawlingPage() {
  const [step, setStep] = useState<number>(0);

  const handlLoginSuccess = () => {
    alert("로그인 완료");
    setStep(1);
  };

  return (
    <div className="flex flex-col items-center justify-start w-full h-full space-y-10">
      {step === 0 && (
        <>
          <h1 className="text-3xl mt-10">Step1. 펌프잇업 로그인</h1>
          <GetGameIdForm onSuccess={handlLoginSuccess} />
        </>
      )}

      {step === 1 && (
        <>
          <h1 className="text-3xl mt-10">Step2. 캐릭터 선택</h1>
          <PiuProfileList />
        </>
      )}
    </div>
  );
}
