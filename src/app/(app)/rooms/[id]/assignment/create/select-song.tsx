"use client";

import classnames from "@/client/utils/classnames";
import { SongWithCharts } from "@/server/prisma/chart.db";
import { $Enums, ChartType, PiuVersion } from "@prisma/client";
import { useEffect, useState } from "react";

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
          <SongCard songWithChart={song} key={song.seq} />
        ))}
      </div>

      {/* <div className="card lg:card-side bg-base-100 shadow-xl">
        <figure></figure>
        <div className="card-body">
          <h2 className="card-title gap-2">
            <span>선택한 버전</span>
            <span>:</span>
            <span>{selectedVersion}</span>
          </h2>
          <p>
            <span>곡 제목</span>
            <span>:</span>
            <span></span>
          </p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">선택완료</button>
          </div>
        </div>
      </div> */}
    </div>
  );
}

function SongCard({ songWithChart }: { songWithChart: SongWithCharts }) {
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
          <div className="grid grid-cols-4 md:grid-cols-4 gap-2 md:gap-3 mt-10">
            {songWithChart.charts?.map((chart) => (
              <LevelBall
                key={chart.seq}
                type={chart.chartType}
                level={chart.level}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LevelBall({ type, level }: { type: ChartType; level: number }) {
  return (
    <div
      className={classnames(
        "size-12 md-size:16 rounded-full flex justify-center items-center ring-2 ring-offset-1 ring-black",
        {
          "bg-red-500": type === "SINGLE",
          "bg-green-500": type === "DOUBLE",
          "bg-yellow-500": type === "CO_OP",
        }
      )}
    >
      {level}
    </div>
  );
}
