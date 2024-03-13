"use client";

import { SongWithCharts } from "@/server/prisma/chart.db";
import { $Enums, Chart, ChartType, PiuVersion, SongType } from "@prisma/client";
import { useEffect, useState } from "react";
import DropDown from "./dropdown";
import SongCardCC from "./song-card.client";

type DropDown = "piuVersion" | "songType" | "chartType";

type Props = {
  songWithCharts: SongWithCharts[];
  dropDowns: DropDown[];
};

export default function SelectSong({ songWithCharts, dropDowns }: Props) {
  const [searchCondition, setSearchCondition] = useState<{
    version?: PiuVersion;
    songType?: SongType;
    chartType?: ChartType;
  }>({});

  const [visibleSongs, setVisibleSongs] = useState<SongWithCharts[]>([
    ...songWithCharts,
  ]);

  useEffect(() => {
    const { songType, version } = searchCondition;

    const filtered = [...songWithCharts].filter((song) => {
      let filter = true;

      if (songType && song.songType !== songType) filter = false;
      if (version && song.version !== version) filter = false;

      return filter;
    });

    setVisibleSongs(filtered);
  }, [songWithCharts, searchCondition]);

  return (
    <div className="flex gap-5 flex-col px-3 pb-10 w-full">
      <div className="flex flex-row gap-3 w-full justify-start items-start">
        {dropDowns.map((dropdown) => {
          switch (dropdown) {
            case "piuVersion":
              return (
                <DropDown
                  values={Object.values($Enums.PiuVersion)}
                  btnText="버전 선택"
                  onSelect={(version) =>
                    setSearchCondition((prev) => ({ ...prev, version }))
                  }
                />
              );
            case "songType":
              return (
                <DropDown
                  values={Object.values($Enums.SongType)}
                  btnText="아케이드/리믹스/풀송/숏컷 선택"
                  onSelect={(songType) =>
                    setSearchCondition((prev) => ({ ...prev, songType }))
                  }
                />
              );
            case "chartType":
              return (
                <DropDown
                  values={Object.values($Enums.ChartType)}
                  btnText="싱글/더블/코옵 선택"
                  onSelect={(chartType) =>
                    setSearchCondition((prev) => ({ ...prev, chartType }))
                  }
                />
              );
          }
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
        {visibleSongs.map((song) => (
          <SongCardCC song={song} charts={song.charts ?? []} key={song.seq} />
        ))}
      </div>
    </div>
  );
}
