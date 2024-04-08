"use client";

import type { Notice } from "@prisma/client";
import { createNoticeReply } from "./action";
import { useRef } from "react";

type Props = {
  notice: Notice;
  onSuccess?: () => void;
};

export default function CreateNoticeReplyForm({ notice, onSuccess }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function createReply() {
    if (!inputRef?.current || inputRef?.current?.value === "") {
      alert("댓글을 입력해주세요");
      return;
    }

    await createNoticeReply(notice.seq, inputRef.current.value);
    onSuccess?.();
  }

  return (
    <div className="flex flex-row justify-start items-end gap-2 mt-3">
      <input
        ref={inputRef}
        type="text"
        className="input input-bordered input-sm w-full max-w-md mt-3"
        name="contents"
      />
      <button className="btn btn-sm btn-neutral" onClick={createReply}>
        작성
      </button>
    </div>
  );
}
