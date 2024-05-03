"use client";

import classnames from "@/utils/classnames";
import { PATCHED_VERSION } from "@/constants/const";
import type { Chart, ChartType, Song } from "@prisma/client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import LevelBall from "./level-ball";
import SongBadges from "./song-badges";
import Image from "next/image";

type Props = {
  song: Song;
  charts: Chart[];
  activeChartSeq?: number;
  moveToSongDetail?: boolean;
  moveToChartDetail?: boolean;
  onSelect?: (song: Song, chart: Chart) => void;
  chartType?: ChartType;
  showOnlySongs?: boolean;
  level?: number;
};

export default function SongCardCC({
  song,
  charts,
  activeChartSeq,
  moveToSongDetail,
  moveToChartDetail,
  onSelect,
  chartType,
  showOnlySongs,
  level,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  let visibleCharts = charts.filter((it) => {
    let filter = true;
    if (chartType && it.chartType !== chartType) filter = false;
    if (level && it.level !== level) filter = false;
    return filter;
  });

  if (!showOnlySongs && visibleCharts.length === 0) {
    return null;
  }

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
    <div
      className={classnames("card bg-base-100 shadow-xl", {
        "image-full": Boolean(song.imageUrl),
      })}
    >
      {song.imageUrl && (
        <figure>
          <Image
            src={song.imageUrl}
            alt={song.name}
            width={400}
            height={400}
            priority={false}
            className="bg-clip-text"
          />
        </figure>
      )}

      <div className="card-body p-4 sm:p-6 md:p-8">
        <h2 className="card-title text-base sm:text-xl">
          {moveToSongDetail ? (
            <Link href={`/songs/${song.seq}`} className="hover:text-gray-600">
              {song.name}
            </Link>
          ) : (
            <span>{song.name}</span>
          )}
          {song.patchVersion === PATCHED_VERSION && (
            <div className="badge badge-secondary">NEW</div>
          )}
        </h2>

        <SongBadges song={song} />

        {!showOnlySongs && (
          <div className="flex flex-row flex-wrap gap-2">
            {visibleCharts.map((chart) => (
              <LevelBall
                key={chart.seq}
                chart={chart}
                className={classnames(
                  "size-8 sm:size-12",
                  activeChartSeq === chart.seq ? "opacity-30" : ""
                )}
                handleSelect={handleLevelBallClick}
                hasHover={moveToChartDetail}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
