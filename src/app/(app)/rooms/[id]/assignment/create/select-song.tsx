"use client";

import InputWithLabel from "@/components/InputWithLabel";
import { SongWithCharts } from "@/server/prisma/chart.db";
import { $Enums, Chart, ChartType, PiuVersion, SongType } from "@prisma/client";
import { useEffect, useState } from "react";
import DropDown from "./dropdown";
import SelectedSongCard from "./selected-song";
import SongCard from "./song-card";

type Props = {
  songWithCharts: SongWithCharts[];
};

export default function SelectSong({ songWithCharts }: Props) {
  const [searchCondition, setSearchCondition] = useState<{
    version?: PiuVersion;
    songType?: SongType;
    chartType?: ChartType;
  }>({});

  const [visibleSongs, setVisibleSongs] = useState<SongWithCharts[]>([
    ...songWithCharts,
  ]);

  const [selectedSongs, setSelectedSongs] = useState<{
    song: SongWithCharts;
    chart: Chart;
  } | null>(null);

  function handleChartSelect(song: SongWithCharts, chart: Chart) {
    setSelectedSongs({ song, chart });
  }

  useEffect(() => {
    console.log("change search condition", searchCondition);

    const { chartType, songType, version } = searchCondition;

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
      {!selectedSongs ? (
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
            onClick={() => setSelectedSongs(null)}
          >
            다시 선택하기
          </button>
          <div className="card lg:card-side bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title gap-2">
                선택한 곡을 확인하고 다음 내용을 입력해주세요
              </h2>
              <SelectedSongCard
                songWithChart={selectedSongs.song}
                chart={selectedSongs.chart}
              />
              <form>
                <InputWithLabel topLeft="시작일" type="date" />
                <InputWithLabel topLeft="종료일" type="date" />
              </form>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">숙제곡 지정</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
