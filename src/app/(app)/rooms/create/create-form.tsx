"use client";

import InputWithLabel from "@/components/InputWithLabel";
import { createRoom } from "@/server/action/create-room";
import { useFormState } from "react-dom";

export default function CreateForm() {
  const initialState = { message: undefined, errors: undefined };
  const [state, action] = useFormState(createRoom, initialState);

  return (
    <form
      className="flex justify-center items-center w-1/2 flex-col"
      action={action}
    >
      <InputWithLabel
        topLeft="방 이름"
        placeholder="이름을 입력해주세요"
        name="name"
        aria-describedby="name-error"
      />
      {state.errors?.name ? (
        <div
          id="name-error"
          aria-live="polite"
          className="mt-2 text-sm text-red-500"
        >
          {state.errors.name.map((error: string) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      ) : null}

      <InputWithLabel
        topLeft="설명"
        placeholder="설명을 입력해주세요 (선택)"
        name="description"
        aria-describedby="name-error"
      />
      {state.errors?.description ? (
        <div
          id="description-error"
          aria-live="polite"
          className="mt-2 text-sm text-red-500"
        >
          {state.errors.description.map((error: string) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      ) : null}

      <InputWithLabel
        topLeft="배너 이미지"
        placeholder="배너 이미지 링크(선택)"
        name="bannerImage"
        aria-describedby="bannerImage-error"
      />
      {state.errors?.bannerIamge ? (
        <div
          id="bannerImage-error"
          aria-live="polite"
          className="mt-2 text-sm text-red-500"
        >
          {state.errors.bannerIamge.map((error: string) => (
            <p key={error}>{error}</p>
          ))}
        </div>
      ) : null}

      <button className="btn btn-primary w-full max-w-md mt-5" type="submit">
        방 생성
      </button>
    </form>
  );
}
