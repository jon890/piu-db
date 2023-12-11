"use client";

import InputWithLabel from "@/components/InputWithLabel";
import { getGameId } from "@/server/action/get-game-id";
import { useFormState, useFormStatus } from "react-dom";

export default function GetGameIdForm() {
  const initialState = {
    errors: undefined,
    message: undefined,
    data: undefined,
  };
  const [state, action] = useFormState(getGameId, initialState);
  const { pending } = useFormStatus();

  console.log(state);

  return (
    <form
      className="flex justify-center items-center w-1/2 flex-col"
      action={action}
    >
      <InputWithLabel
        topLeft="아이디"
        placeholder="아이디를 입력해주세요"
        name="email"
        errors={state?.errors?.email}
      />

      <InputWithLabel
        type="password"
        topLeft="비밀번호"
        placeholder="비밀번호를 입력해주세요"
        name="password"
        errors={state?.errors?.password}
      />

      <button
        className="btn btn-primary w-full max-w-md mt-5"
        type="submit"
        aria-disabled={pending}
      >
        펌프잇업에 로그인
      </button>

      <div className="mt-6 text-sm text-red-500 font-bold">{state.message}</div>
    </form>
  );
}
