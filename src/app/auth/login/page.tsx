"use client";

import { authenticate } from "@/app/auth/login/action";
import FormButton from "@/components/FormButton";
import InputWithLabel from "@/components/common/InputWithLabel";
import ArrowLeftIcon from "@heroicons/react/24/solid/ArrowLeftIcon";
import Link from "next/link";
import { useFormState } from "react-dom";
import { LOGIN_CODE } from "./schema";

export default function LoginPage() {
  const [state, action] = useFormState(authenticate, null);

  return (
    <main className="w-full">
      <section className="w-full h-screen flex justify-center flex-col items-center p-10">
        <div className="flex flex-row items-center w-full max-w-md mb-10">
          <Link href="/">
            <ArrowLeftIcon className="size-6" />
          </Link>

          <h1 className="text-3xl font-bold mx-auto">로그인</h1>
        </div>

        <form
          action={action}
          className="flex justify-center items-center flex-col w-full max-w-md"
        >
          <InputWithLabel
            topLeft="아이디"
            placeholder="아이디를 입력해주세요"
            name="name"
            errors={state?.errors?.fieldErrors?.name}
          />
          <InputWithLabel
            type="password"
            topLeft="비밀번호"
            placeholder="비밀번호를 입력해주세요"
            name="password"
            errors={state?.errors?.fieldErrors?.password}
          />
          <FormButton
            text={"로그인"}
            loadingText="잠시만 기다려주세요"
            className="mt-5"
          />
        </form>

        <div className="flex h-8 items-end space-x-1">
          {state?.code !== LOGIN_CODE.SUCCESS && (
            <p
              aria-live="polite"
              className="text-sm text-red-500 font-semibold"
            >
              {state?.code === LOGIN_CODE.CredentialsSignin
                ? "아이디와 비밀번호를 다시 확인해주세요"
                : state?.message}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
