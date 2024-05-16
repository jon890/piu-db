"use client";

import useToast from "@/client/hooks/use-toast";
import CheckBox from "@/components/common/check-box";
import FormButton from "@/components/common/form-button";
import InputWithLabel from "@/components/common/input-with-label";
import type { RoomParticipantsWithUser } from "@/server/prisma/room-participants.db";
import type { AssignmentRoom } from "@prisma/client";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { changeRoomSettings } from "./action";
import { kickOutAction } from "./kick-out.action";
import { useRouter } from "next/navigation";

type Props = {
  room: AssignmentRoom;
  participants: RoomParticipantsWithUser;
};

export default function RoomSettingsForm({ room, participants }: Props) {
  const toast = useToast();
  const router = useRouter();
  const [state, action] = useFormState(changeRoomSettings, null);

  useEffect(() => {
    if (state?.ok === false) {
      toast.createToast({
        type: "error",
        message: state?.message ?? "오류가 발생했습니다",
      });
    }
  }, [state]);

  async function kickOut(userSeq: number) {
    if (!confirm("정말 추방하시겠습니까?\n해당 작업은 되돌릴 수 없습니다")) {
      return;
    }

    const res = await kickOutAction(room.seq, userSeq);

    if (res.ok) {
      toast.success(res.message);
      router.refresh();
    } else {
      toast.error(res.message);
    }
  }

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
        <h2 className="text-center font-semibold my-3">참여자 관리</h2>
        <table className="table table-xs">
          <thead>
            <tr>
              <th></th>
              <th>닉네임</th>
              <th>선곡권한</th>
              <th>추방</th>
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
                <td>
                  {user.userSeq !== room.adminUserSeq && (
                    <button
                      type="button"
                      className="btn btn-error"
                      onClick={() => kickOut(user.userSeq)}
                    >
                      추방
                    </button>
                  )}
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
