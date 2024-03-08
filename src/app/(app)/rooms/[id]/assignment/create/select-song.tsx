"use client";

import { SongWithCharts } from "@/server/prisma/chart.db";
import { $Enums, Chart, ChartType, PiuVersion, SongType } from "@prisma/client";
import { useEffect, useState } from "react";
import AssignmentCreateForm from "./create-form";
import DropDown from "./dropdown";
import SongCard from "./song-card";

type Props = {
  songWithCharts: SongWithCharts[];
  roomSeq: number;
};

export default function SelectSong({ songWithCharts, roomSeq }: Props) {
  const [searchCondition, setSearchCondition] = useState<{
    version?: PiuVersion;
    songType?: SongType;
    chartType?: ChartType;
  }>({});

  const [visibleSongs, setVisibleSongs] = useState<SongWithCharts[]>([
    ...songWithCharts,
  ]);

  const [selectedSong, setSelectedSong] = useState<{
    song: SongWithCharts;
    chart: Chart;
  } | null>(null);

  function handleChartSelect(song: SongWithCharts, chart: Chart) {
    setSelectedSong({ song, chart });
  }

  useEffect(() => {
    // console.log("change search condition", searchCondition);

    const { songType, version } = searchCondition;

    const filtered = [...songWithCharts].filter((song) => {
      let filter = true;

      if (songType && song.songType !== songType) filter = false;
      if (version && song.version !== version) filter = false;

      return filter;
    });

    setVisibleSongs(filtered);
  }, [searchCondition]);

  return (
    <div className="flex gap-5 flex-col px-3 pb-10 w-full">
      {!selectedSong ? (
        <>
          <div className="flex flex-row gap-3 w-full justify-start items-start">
            <DropDown
              values={Object.values($Enums.PiuVersion)}
              btnText="버전 선택"
              onSelect={(version) =>
                setSearchCondition((prev) => ({ ...prev, version }))
              }
            />

            <DropDown
              values={Object.values($Enums.SongType)}
              btnText="아케이드/리믹스/풀송/숏컷 선택"
              onSelect={(songType) =>
                setSearchCondition((prev) => ({ ...prev, songType }))
              }
            />

            <DropDown
              values={Object.values($Enums.ChartType)}
              btnText="싱글/더블/코옵 선택"
              onSelect={(chartType) =>
                setSearchCondition((prev) => ({ ...prev, chartType }))
              }
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
            {visibleSongs.map((song) => (
              <SongCard
                songWithChart={song}
                key={song.seq}
                onSelect={handleChartSelect}
                chartType={searchCondition.chartType}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <button
            className="btn btn-primary"
            onClick={() => setSelectedSong(null)}
          >
            다시 선택하기
          </button>
          <AssignmentCreateForm selectedSong={selectedSong} roomSeq={roomSeq} />
        </>
      )}
    </div>
  );
}
