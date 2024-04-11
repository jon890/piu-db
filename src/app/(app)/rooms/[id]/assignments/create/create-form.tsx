"use client";

import useToast from "@/client/hooks/use-toast";
import FormButton from "@/components/FormButton";
import InputWithLabel from "@/components/common/input-with-label";
import SongCardCC from "@/components/song-card.client";
import { SongWithCharts } from "@/server/prisma/chart.db";
import { Chart } from "@prisma/client";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { createAssignment } from "./create-action";

type Props = {
  selectedSong: { song: SongWithCharts; chart: Chart };
  roomSeq: number;
};

export default function AssignmentCreateForm({
  selectedSong: { song, chart },
  roomSeq,
}: Props) {
  const toast = useToast();
  const [state, dispatch] = useFormState(createAssignment, null);

  useEffect(() => {
    if (state?.message) {
      toast.createToast({ message: state?.message, type: "info" });
    }
  }, [state]);

  return (
    <form action={dispatch}>
      <input type="hidden" name="room_seq" value={roomSeq} />
      <input type="hidden" name="song_seq" value={song.seq} />
      <input type="hidden" name="chart_seq" value={chart.seq} />

      <div className="card lg:card-side bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title gap-2 m-4">
            선택한 곡을 확인하고 다음 내용을 입력해주세요
          </h2>

          <SongCardCC song={song} charts={[chart]} />

          <InputWithLabel
            topLeft="시작일"
            type="date"
            name="start_date"
            errors={state?.errors?.fieldErrors?.start_date}
          />

          <InputWithLabel
            topLeft="종료일"
            type="date"
            name="end_date"
            errors={state?.errors?.fieldErrors?.end_date}
          />

          <InputWithLabel
            topLeft="메모 (선택)"
            type="text"
            name="memo"
            errors={state?.errors?.fieldErrors?.memo}
          />

          <div className="form-control w-full max-w-md">
            <label className="label cursor-pointer">
              <span className="label-text">브레이크 오프 기록 허용 여부</span>
              <input
                type="checkbox"
                name="enable_break_off"
                className="checkbox checkbox-primary"
              />
            </label>
            {state?.errors?.fieldErrors?.enable_break_off && (
              <div
                id={`${"stopParticipating"}-error`}
                aria-live="polite"
                className="text-sm text-red-500 font-semibold text-center mt-1"
              >
                {state?.errors?.fieldErrors?.enable_break_off.map(
                  (error: string) => <p key={error}>{error}</p>
                )}
              </div>
            )}
          </div>

          <div className="card-actions mt-5">
            <FormButton text="숙제곡 지정" />
          </div>
        </div>
      </div>
    </form>
  );
}
