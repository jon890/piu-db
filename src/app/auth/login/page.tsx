"use client";

import InputWithLabel from "@/app/components/InputWithLabel";
import { authenticate } from "@/app/server-action/authenticate";
import { useFormState, useFormStatus } from "react-dom";

export default function LoginPage() {
  const [code, action] = useFormState(authenticate, undefined);
  const { pending } = useFormStatus();

  return (
    <main className="w-full">
      <section className="w-full flex justify-center flex-col items-center">
        <h1 className="text-3xl font-bold mb-10">로그인</h1>
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
          <button
            className="btn btn-primary w-full max-w-md mt-5"
            aria-disabled={pending}
          >
            로그인
          </button>
        </form>
        <div className="flex h-8 items-end space-x-1">
          {code === "CredentialSignin" && (
            <>
              <p aria-live="polite" className="text-sm text-red-500">
                Invalid credentials
              </p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
