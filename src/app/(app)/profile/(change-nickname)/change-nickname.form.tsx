"use client";

import InputWithLabel from "@/components/common/input-with-label";
import { useRef, useState } from "react";
import { changeNicknameAction } from "./change-nickname.action";
import useToast from "@/client/hooks/use-toast";

type Props = {
  nickname: string;
};

export default function ChangeNicknameForm({ nickname }: Props) {
  const [state, setState] = useState<{
    isChanging: boolean;
    isLoading: boolean;
    newNickname: string;
  }>({
    isChanging: false,
    isLoading: false,
    newNickname: nickname,
  });
  const toast = useToast();

  function startChanging() {
    setState({ ...state, isChanging: true });
  }

  function reset() {
    setState({ ...state, isChanging: false, newNickname: nickname });
  }

  async function changeNickname() {
    const newNickname = state.newNickname;
    if (!newNickname || newNickname === "") {
      toast.warning("변경할 닉네임을 입력하세요");
      return;
    }

    if (newNickname === nickname) {
      toast.warning("변경하려는 닉네임이 동일합니다");
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true }));
    const res = await changeNicknameAction(newNickname);
    if (!res.ok) {
      toast.error(res.message ?? "오류가 발생했습니다");
      setState((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: false, isChanging: false }));
    toast.success("성공적으로 닉네임이 변경되었습니다");
  }

  return (
    <div className="flex flex-row justify-center items-end gap-2 max-w-md w-full">
      <InputWithLabel
        topLeft="닉네임"
        disabled={!state.isChanging || state.isLoading}
        topRight="* 하루에 한번 변경할 수 있습니다"
        value={state.newNickname}
        onChange={(e) =>
          setState((prev) => ({ ...prev, newNickname: e.target.value }))
        }
      />

      {state.isChanging ? (
        <>
          <button className="btn btn-primary" onClick={changeNickname}>
            완료
          </button>
          <button className="btn btn-error" onClick={reset}>
            취소
          </button>
        </>
      ) : (
        <button className="btn btn-primary" onClick={startChanging}>
          변경
        </button>
      )}
    </div>
  );
}
