"use client";

import { useSession } from "next-auth/react";
import InputWithLabel from "@/components/InputWithLabel";
import { SongWithCharts } from "@/server/prisma/chart.db";
import { $Enums, Chart, PiuVersion } from "@prisma/client";
import { useEffect, useState } from "react";
import LevelBall from "./level-ball";

type Props = {
  songWithCharts: SongWithCharts[];
};

export default function SelectSong({ songWithCharts }: Props) {
  const version = $Enums.PiuVersion;

  const [selectedVersion, setSelectedVersion] = useState<PiuVersion | null>(
    null
  );

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
    if (selectedVersion) {
      setVisibleSongs(
        songWithCharts.filter((it) => it.version === selectedVersion)
      );
    } else {
      setVisibleSongs(songWithCharts);
    }
  }, [selectedVersion]);

  return (
    <div className="flex gap-5 flex-col px-3 pb-10">
      {!selectedSongs ? (
        <>
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn m-1">
              {selectedVersion ?? "버전 선택하기"}
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              {Object.values(version).map((v) => (
                <li
                  onClick={() => {
                    setSelectedVersion(v);
                  }}
                  key={v}
                >
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
            {visibleSongs.map((song) => (
              <SelectSongCard
                songWithChart={song}
                key={song.seq}
                onSelect={handleChartSelect}
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

function SelectedSongCard({
  songWithChart,
  chart,
}: {
  songWithChart: SongWithCharts;
  chart: Chart;
}) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          {songWithChart.name}
          {/* <div className="badge badge-secondary">NEW</div> */}
        </h2>

        <div className="card-actions justify-end">
          <div className="badge badge-outline">
            아티스트: {songWithChart.artist}
          </div>
          <div className="badge badge-outline">
            타입: {songWithChart.songType}
          </div>
          <div className="badge badge-outline">BPM: {songWithChart.bpm}</div>
          <div className="badge badge-outline">
            버전: {songWithChart.version}
          </div>
          <div className="block">
            <LevelBall key={chart.seq} chart={chart} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SelectSongCard({
  songWithChart,
  onSelect,
}: {
  songWithChart: SongWithCharts;
  onSelect?: (song: SongWithCharts, chart: Chart) => void;
}) {
  const handleChartSelect = (song: SongWithCharts, chart: Chart) => {
    onSelect?.(song, chart);
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-base sm:text-xl">
          {songWithChart.name}
          <div className="badge badge-secondary"></div>
        </h2>

        <div className="card-actions justify-end *:text-[9px] *:sm:text-xs">
          <div className="badge badge-outline">
            아티스트: {songWithChart.artist}
          </div>
          <div className="badge badge-outline">
            타입: {songWithChart.songType}
          </div>
          <div className="badge badge-outline">BPM: {songWithChart.bpm}</div>
          <div className="badge badge-outline">
            버전: {songWithChart.version}
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-4 gap-2 sm:gap-3 mt-4 sm:mt-6">
            {songWithChart.charts?.map((chart) => (
              <LevelBall
                key={chart.seq}
                chart={chart}
                onClick={(chart) => handleChartSelect(songWithChart, chart)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
