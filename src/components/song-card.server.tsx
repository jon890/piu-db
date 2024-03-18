import classnames from "@/client/utils/classnames";
import LevelBall from "@/components/level-ball.server";
import type { Chart, Song } from "@prisma/client";
import Link from "next/link";

type Props = {
  song: Song;
  charts: Chart[];
  moveToSongDetail?: boolean;
  moveToChartDetail?: boolean;
};

export default function SongCardSC({
  song,
  charts,
  moveToSongDetail,
  moveToChartDetail,
}: Props) {
  return (
    <div className="card bg-base-100 shadow-xl mx-4">
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
          {charts.map((chart) => {
            return moveToChartDetail ? (
              <Link
                key={chart.seq}
                href={`/songs/${song.seq}/charts/${chart.seq}`}
              >
                <LevelBall chart={chart} className="size-8 sm:size-12" />
              </Link>
            ) : (
              <LevelBall
                key={chart.seq}
                chart={chart}
                className="size-8 sm:size-12"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
