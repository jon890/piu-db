"use client";

import useToast from "@/client/hooks/use-toast";
import FormButton from "@/components/common/form-button";
import InputWithLabel from "@/components/common/input-with-label";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { createNotice } from "./action";

export default function CreateNoticeForm() {
  const [state, action] = useFormState(createNotice, null);
  const toast = useToast();

  useEffect(() => {
    if (state?.ok === false) {
      toast.createToast({
        type: "error",
        message: state?.message ?? "오류가 발생했습니다",
      });
    }
  }, [state]);

  return (
    <form
      className="flex justify-center items-center max-w-md w-full flex-col"
      action={action}
    >
      <InputWithLabel
        topLeft="제목"
        placeholder="제목을 입력해주세요"
        name="title"
        errors={state?.errors.fieldErrors?.title}
      />

      <label className="form-control w-full max-w-md">
        <div className="label">
          <span className="label-text">내용</span>
        </div>
        <textarea
          className="textarea textarea-bordered textarea-lg w-full max-w-md min-h-60"
          placeholder="내용을 입력해주세요"
          name="contents"
        ></textarea>
      </label>

      <FormButton text="공지사항 작성" className="mt-5" />
    </form>
  );
}
