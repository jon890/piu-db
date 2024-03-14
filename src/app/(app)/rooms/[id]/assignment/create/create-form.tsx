"use client";

import InputWithLabel from "@/components/InputWithLabel";
import { SongWithCharts } from "@/server/prisma/chart.db";
import { Chart } from "@prisma/client";
import SelectedSongCard from "./selected-song";
import { useFormState } from "react-dom";
import FormButton from "@/components/FormButton";
import { createAssignment } from "./create-action";
import { useEffect } from "react";
import useToast from "@/client/hooks/use-toast";
import SongCardCC from "@/components/song-card.client";

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
    console.log(state);

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

          <div className="card-actions mt-5">
            <FormButton text="숙제곡 지정" />
          </div>
        </div>
      </div>
    </form>
  );
}
