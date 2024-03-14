"use client";

import classnames from "@/client/utils/classnames";
import type { Chart, Song } from "@prisma/client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import LevelBallCC from "./level-ball.client";

type Props = {
  song: Song;
  charts: Chart[];
  activeChartSeq?: number;
  moveToSongDetail?: boolean;
  moveToChartDetail?: boolean;
  onSelect?: (song: Song, chart: Chart) => void;
};

export default function SongCardCC({
  song,
  charts,
  activeChartSeq,
  moveToSongDetail,
  moveToChartDetail,
  onSelect,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleLevelBallClick(chart: Chart) {
    if (moveToChartDetail) {
      const query = new URLSearchParams(searchParams.toString());
      query.set("chartSeq", chart.seq.toString());
      router.push(pathname + "?" + query.toString());
    } else {
      onSelect?.(song, chart);
    }
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-base sm:text-2xl">
          {moveToSongDetail ? (
            <Link href={`/songs/${song.seq}`} className="hover:text-gray-600">
              {song.name}
            </Link>
          ) : (
            <span>{song.name}</span>
          )}
          {song.patchVersion === "1.07" && (
            <div className="badge badge-secondary">NEW</div>
          )}
        </h2>

        <div className="grid grid-cols-2 justify-items-end gap-2 *:text-[9px] *:sm:text-xs">
          <div className="badge badge-outline">아티스트: {song.artist}</div>
          <div className="badge badge-outline">타입: {song.songType}</div>
          <div className="badge badge-outline">BPM: {song.bpm}</div>
          <div className="badge badge-outline">버전: {song.version}</div>
        </div>

        <div
          className={classnames(
            "gap-2 sm:gap-3 mt-4 sm:mt-6 justify-end w-full",
            {
              "flex flex-row items-end": charts.length < 2,
              "grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-4":
                charts.length >= 2,
            }
          )}
        >
          {charts.map((chart) => (
            <LevelBallCC
              key={chart.seq}
              chart={chart}
              className={classnames(
                "size-8 sm:size-12",
                activeChartSeq === chart.seq ? "opacity-30" : ""
              )}
              handleSelect={handleLevelBallClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
