"use client";

import SelectSong, { DropDown } from "@/components/select-song";
import { SongWithCharts } from "@/server/prisma/chart.db";
import { Chart } from "@prisma/client";
import { useState } from "react";

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

  return (
    <SelectSong
      songWithCharts={songWithCharts}
      dropDowns={["piuVersion", "songType", "chartType"]}
    />
  );
}
