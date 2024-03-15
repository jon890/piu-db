"use client";

import { SongWithCharts } from "@/server/prisma/chart.db";
import { $Enums, ChartType, type Chart, type Song } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import InputWithLabel from "./common/InputWithLabel";
import DropDown from "./dropdown";
import SongCardCC from "./song-card.client";

export type DropDown = "piuVersion" | "songType" | "chartType";

type Props = {
  songWithCharts: SongWithCharts[];
  dropDowns: DropDown[];
  onSelect?: (song: Song, chart: Chart) => void;
  moveSongDetail?: boolean;
  moveChartDetail?: boolean;
  showOnlySongs?: boolean;
};

export default function SelectSong({
  songWithCharts,
  dropDowns,
  onSelect,
  moveSongDetail,
  moveChartDetail,
  showOnlySongs,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const keywordRef = useRef<HTMLInputElement>(null);
  const [visibleSongs, setVisibleSongs] = useState<SongWithCharts[]>([
    ...songWithCharts,
  ]);

  useEffect(() => {
    const songType = searchParams.get("songType");
    const version = searchParams.get("version");
    const keyword = searchParams.get("keyword");

    const filtered = [...songWithCharts].filter((song) => {
      let filter = true;

      if (songType && song.songType !== songType) filter = false;
      if (version && song.version !== version) filter = false;
      if (
        keyword &&
        !song.name.includes(keyword) &&
        !song.artist.includes(keyword)
      )
        filter = false;

      return filter;
    });

    setVisibleSongs(filtered);
  }, [songWithCharts, searchParams]);

  function handleSearchClick() {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (keywordRef?.current?.value) {
      newSearchParams.set("keyword", keywordRef?.current?.value);
    } else {
      newSearchParams.delete("keyword");
    }
    router.push(pathname + "?" + newSearchParams.toString());
  }

  return (
    <div className="flex gap-5 flex-col px-3 pb-10 w-full">
      <div className="flex flex-row gap-3 w-full justify-start items-start">
        {dropDowns.map((dropdown) => {
          switch (dropdown) {
            case "piuVersion":
              return (
                <DropDown
                  key={dropdown}
                  values={Object.values($Enums.PiuVersion)}
                  btnText="버전 선택"
                  onSelect={(version) => {
                    const newSearchParams = new URLSearchParams(
                      searchParams.toString()
                    );
                    if (version) {
                      newSearchParams.set("version", version);
                    } else {
                      newSearchParams.delete("version");
                    }

                    console.log(version, newSearchParams.toString());
                    router.push(pathname + "?" + newSearchParams.toString());
                  }}
                />
              );
            case "songType":
              return (
                <DropDown
                  key={dropdown}
                  values={Object.values($Enums.SongType)}
                  btnText="아케이드/리믹스/풀송/숏컷 선택"
                  onSelect={(songType) => {
                    const newSearchParams = new URLSearchParams(
                      searchParams.toString()
                    );
                    if (songType) {
                      newSearchParams.set("songType", songType);
                    } else {
                      newSearchParams.delete("songType");
                    }
                    router.push(pathname + "?" + newSearchParams.toString());
                  }}
                />
              );
            case "chartType":
              return (
                <DropDown
                  key={dropdown}
                  values={Object.values($Enums.ChartType)}
                  btnText="싱글/더블/코옵 선택"
                  onSelect={(chartType) => {
                    const newSearchParams = new URLSearchParams(
                      searchParams.toString()
                    );
                    if (chartType) {
                      newSearchParams.set("chartType", chartType);
                    } else {
                      newSearchParams.delete("chartType");
                    }
                    router.push(pathname + "?" + newSearchParams.toString());
                  }}
                />
              );
          }
        })}
      </div>

      <div className="flex flex-row gap-2 items-end">
        <InputWithLabel
          name="이름"
          topLeft="검색어 입력"
          inputRef={keywordRef}
          // value={searchParams?.get("keyword") ?? ""}
        />
        <button className="btn btn-primary" onClick={handleSearchClick}>
          검색
        </button>
      </div>

      <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
        {visibleSongs.map((song) => (
          <SongCardCC
            song={song}
            charts={song.charts ?? []}
            key={song.seq}
            onSelect={(song, chart) => onSelect?.(song, chart)}
            moveToSongDetail={moveSongDetail}
            moveToChartDetail={moveChartDetail}
            chartType={
              (searchParams.get("chartType") as ChartType) ?? undefined
            }
            showOnlySongs={showOnlySongs}
          />
        ))}
      </div>
    </div>
  );
}
