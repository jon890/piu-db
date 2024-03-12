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
      <div className="card-body gap-2 px-6 py-8">
        <h2 className="card-title text-base sm:text-xl">
          {song.name}
          {song.patchVersion === "1.07" && (
            <div className="badge badge-secondary">NEW</div>
          )}
        </h2>

        <div className="grid grid-cols-2 md:card-actions md:justify-end justify-items-end gap-2 *:text-[9px] *:sm:text-xs">
          <div className="badge badge-outline">아티스트: {song.artist}</div>
          <div className="badge badge-outline">타입: {song.songType}</div>
          <div className="badge badge-outline">BPM: {song.bpm}</div>
          <div className="badge badge-outline">버전: {song.version}</div>
        </div>

        <LevelBall chart={chart} />
      </div>
    </div>
  );
}
