"use client";

import SelectSong from "@/components/select-song";
import { SongWithCharts } from "@/server/prisma/chart.db";
import { Chart } from "@prisma/client";
import { useState } from "react";
import AssignmentCreateForm from "./create-form";

type Props = {
  songWithCharts: SongWithCharts[];
  roomSeq: number;
};

export default function SelectSongWrapper({ songWithCharts, roomSeq }: Props) {
  const [selectedSong, setSelectedSong] = useState<{
    song: SongWithCharts;
    chart: Chart;
  } | null>(null);

  function handleChartSelect(song: SongWithCharts, chart: Chart) {
    setSelectedSong({ song, chart });
  }

  return !selectedSong ? (
    <SelectSong
      songWithCharts={songWithCharts}
      onSelect={handleChartSelect}
      dropDowns={["piuVersion", "songType", "chartType"]}
    />
  ) : (
    <>
      <button className="btn btn-primary" onClick={() => setSelectedSong(null)}>
        다시 선택하기
      </button>
      <AssignmentCreateForm selectedSong={selectedSong} roomSeq={roomSeq} />
    </>
  );
}
