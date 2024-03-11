"use client";

import type { Chart, Song } from "@prisma/client";
import LevelBall from "../create/level-ball";

type Props = {
  song: Song;
  chart: Chart;
};

export default function SongCard({ song, chart }: Props) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-base sm:text-xl">
          {song.name}
          {song.patchVersion === "1.07" && (
            <div className="badge badge-secondary">NEW</div>
          )}
        </h2>

        <div className="card-actions justify-end *:text-[9px] *:sm:text-xs">
          <div className="badge badge-outline">아티스트: {song.artist}</div>
          <div className="badge badge-outline">타입: {song.songType}</div>
          <div className="badge badge-outline">BPM: {song.bpm}</div>
          <div className="badge badge-outline">버전: {song.version}</div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-4 gap-2 sm:gap-3 mt-4 sm:mt-6">
            <LevelBall chart={chart} />
          </div>
        </div>
      </div>
    </div>
  );
}
