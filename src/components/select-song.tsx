"use client";

import SearchParamUtil from "@/utils/search-param.util";
import { SongWithCharts } from "@/server/prisma/chart.db";
import {
  $Enums,
  type Chart,
  type ChartType,
  type PiuVersion,
  type Song,
  type SongType,
} from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import InputWithLabel from "./common/input-with-label";
import DropDown from "./common/dropdown";
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

  const [inputs, setInputs] = useState<{
    level: string;
    keyword: string;
  }>({
    level: searchParams.get("level") ?? "",
    keyword: searchParams.get("keyword") ?? "",
  });

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
    searchMultiple({ ...inputs });
  }

  function searchMultiple(condition: Record<string, string | undefined>) {
    const param = SearchParamUtil.fromUseSearchParam(searchParams);

    Object.entries(condition).forEach(([key, value]) => {
      SearchParamUtil.replaceIfExistElseDelete(param, key, value);
    });

    router.push(pathname + "?" + param.toString());
  }

  function search(key: string, value?: string) {
    const param = SearchParamUtil.fromUseSearchParam(searchParams);
    SearchParamUtil.replaceIfExistElseDelete(param, key, value);
    router.push(pathname + "?" + param.toString());
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
                  initialValue={searchParams.get("version") as PiuVersion}
                  onSelect={(version) => search("version", version)}
                />
              );
            case "songType":
              return (
                <DropDown
                  key={dropdown}
                  values={Object.values($Enums.SongType)}
                  btnText="아케이드/리믹스/풀송/숏컷 선택"
                  initialValue={searchParams.get("songType") as SongType}
                  onSelect={(songType) => search("songType", songType)}
                />
              );
            case "chartType":
              return (
                <DropDown
                  key={dropdown}
                  values={Object.values($Enums.ChartType)}
                  btnText="싱글/더블/코옵 선택"
                  initialValue={searchParams.get("chartType") as ChartType}
                  onSelect={(chartType) => search("chartType", chartType)}
                />
              );
          }
        })}
      </div>

      <div className="flex flex-row gap-2 items-end">
        <InputWithLabel
          type="number"
          topLeft="레벨"
          wrapperClassName="!w-20"
          value={inputs.level}
          onChange={(e) =>
            setInputs((prev) => ({ ...prev, level: e.target.value }))
          }
        />
        <InputWithLabel
          topLeft="검색어 입력"
          onChange={(e) =>
            setInputs((prev) => ({ ...prev, keyword: e.target.value }))
          }
          value={inputs.keyword}
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
            level={
              searchParams.get("level")
                ? Number(searchParams.get("level"))
                : undefined
            }
            showOnlySongs={showOnlySongs}
          />
        ))}
      </div>
    </div>
  );
}
