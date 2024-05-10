"use client";

import FormButton from "@/components/common/form-button";
import type { Rival } from "@prisma/client";
import { useFormState } from "react-dom";
import { applyRival } from "./apply-rival.action";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

type Props = {
  uid: string;
  rival: Rival | null;
};

export default function ApplyRivalForm(props: Props) {
  const router = useRouter();
  const [state, action] = useFormState(applyRival, null);

  useEffect(() => {
    if (state?.ok) {
      router.refresh();
    }
  }, [state?.ok, router]);

  return props.rival ? (
    props.rival.isAccpeted ? null : (
      <FormButton
        text="라이벌 신청을 완료했습니다. 상대방의 수락을 기다리고 있습니다."
        className="mx-auto"
        disabled
      />
    )
  ) : (
    <form className="w-full max-w-md mt-4" action={action}>
      <input type="hidden" name="uid" value={props.uid} />
      <FormButton text="라이벌 신청" className="mx-auto" />

      {state?.message && (
        <div className="mt-6 text-sm text-red-500 font-bold text-center">
          {state.message}
        </div>
      )}
    </form>
  );
}
