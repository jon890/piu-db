"use client";

import useToast from "@/client/hooks/use-toast";
import FormButton from "@/components/common/form-button";
import CheckBox from "@/components/common/check-box";
import InputWithLabel from "@/components/common/input-with-label";
import type { RoomParticipants } from "@/server/prisma/room.db";
import type { AssignmentRoom } from "@prisma/client";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { changeRoomSettings } from "./action";

type Props = {
  room: AssignmentRoom;
  participants: RoomParticipants;
};

export default function RoomSettingsForm({ room, participants }: Props) {
  const [state, action] = useFormState(changeRoomSettings, null);
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
      className="flex justify-center items-center max-w-md w-full flex-col gap-3"
      action={action}
    >
      <input type="hidden" name="room_seq" value={room.seq} />

      <InputWithLabel
        topLeft="방 이름"
        placeholder="이름을 입력해주세요"
        name="name"
        errors={state?.paramErrors?.fieldErrors?.name}
        defaultValue={room.name}
      />

      <InputWithLabel
        topLeft="설명"
        placeholder="설명을 입력해주세요 (선택)"
        name="description"
        errors={state?.paramErrors?.fieldErrors.description}
        defaultValue={room.description ?? ""}
      />

      <InputWithLabel
        topLeft="배너 이미지"
        placeholder="배너 이미지 링크 (선택)"
        name="bannerImage"
        errors={state?.paramErrors?.fieldErrors.bannerImage}
        defaultValue={room.bannerImage ?? ""}
      />

      <CheckBox
        topLeft="다른 유저 참여 제한"
        name="stopParticipating"
        errors={state?.paramErrors?.fieldErrors?.stopParticipating}
        defaultChecked={room.stopParticipating}
      />

      <div className="overflow-x-auto w-full border rounded-md shadow-md p-3">
        <h2 className="text-center font-semibold my-3">선곡 권한</h2>
        <table className="table table-xs">
          <thead>
            <tr>
              <th></th>
              <th>닉네임</th>
              <th>선곡권한</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((user, index) => (
              <tr className="hover" key={user.userSeq}>
                <td>{index + 1}</td>
                <td>{user.user.nickname}</td>
                <td>
                  <input
                    type="checkbox"
                    name="selectSongAuthorityUsers"
                    value={user.userSeq}
                    defaultChecked={
                      // todo 나중에 not null로 처리할 수 있도록 수정
                      room.selectSongAuthorityUsers == null ||
                      (room.selectSongAuthorityUsers as number[]).includes(
                        user.userSeq
                      )
                    }
                    className="checkbox"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <FormButton text="변경" className="mt-5" />
    </form>
  );
}
