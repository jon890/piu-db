"use client";

import { authenticate } from "@/app/auth/login/action";
import FormButton from "@/components/FormButton";
import InputWithLabel from "@/components/InputWithLabel";
import Link from "next/link";
import { useFormState } from "react-dom";

export default function LoginPage() {
  const [code, action] = useFormState(authenticate, undefined);

  return (
    <main className="w-full">
      <section className="w-full h-screen flex justify-center flex-col items-center">
        <div className="flex flex-row items-center w-1/2 mb-10">
          <Link href="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
              />
            </svg>
          </Link>

          <h1 className="text-3xl font-bold mx-auto">로그인</h1>
        </div>

        <form
          action={action}
          className="flex justify-center items-center w-1/2 flex-col"
        >
          <InputWithLabel
            topLeft="아이디"
            placeholder="아이디를 입력해주세요"
            name="name"
          />
          <InputWithLabel
            type="password"
            topLeft="비밀번호"
            placeholder="비밀번호를 입력해주세요"
            name="password"
          />
          <FormButton text={"로그인"} loadingText="잠시만 기다려주세요" />
        </form>
        <div className="flex h-8 items-end space-x-1">
          {code === "CredentialSignin" && (
            <>
              <p aria-live="polite" className="text-sm text-red-500">
                정확히 정보를 입력해주세요
              </p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
