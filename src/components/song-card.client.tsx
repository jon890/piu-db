"use client";

import classnames from "@/client/utils/classnames";
import { Chart, Song } from "@prisma/client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import LevelBallCC from "./level-ball.client";

type Props = {
  song: Song;
  charts: Chart[];
  activeChartSeq?: number;
};

export default function SongCardCC({ song, charts, activeChartSeq }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleLevelBallClick(chart: Chart) {
    const query = new URLSearchParams(searchParams.toString());
    query.set("chartSeq", chart.seq.toString());

    router.push(pathname + "?" + query.toString());
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-base sm:text-2xl">
          <Link href={`/songs/${song.seq}`} className="hover:text-gray-600">
            {song.name}
          </Link>
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
    </div>
  );
}
