"use client";

import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { useLoginCookieAction } from "./action";
import { useEffect } from "react";
import useToast from "@/client/hooks/use-toast";

type Props = {
  email: string;
  password: string;
};

export default function UseLoginCookie({ email, password }: Props) {
  const router = useRouter();
  const [state, action] = useFormState(useLoginCookieAction, null);
  const toast = useToast();

  useEffect(() => {
    if (state?.ok) {
      toast.createToast({ type: "success", message: "설정이 완료되었습니다" });
      router.push("/rooms");
    }
  }, [state]);
  return (
    <form
      action={action}
      className="flex flex-col gap-10 justify-center items-center w-full flex-wrap"
    >
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="password" value={password} />

      <div className="flex flex-row gap-4">
        <button type="submit" className="btn btn-primary">
          해당 기능 사용하기
        </button>
        <button
          type="button"
          disabled
          className="btn btn-warning"
          // onClick={() => router.push("/rooms")}
        >
          사용하지 않기 (후추 1회 로그인 지원예정입니다)
        </button>
      </div>
    </form>
  );
}
