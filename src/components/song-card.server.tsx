import classnames from "@/utils/classnames";
import LevelBall from "@/components/level-ball";
import type { Chart, Song } from "@prisma/client";
import Link from "next/link";
import SongBadges from "./song-badges";
import { PATCHED_VERSION } from "@/constants/const";
import Image from "next/image";

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
    <div
      className={classnames("card bg-base-100 shadow-xl", {
        "image-full": Boolean(song.imageUrl),
      })}
    >
      {song.imageUrl && (
        <figure>
          <Image src={song.imageUrl} alt={song.name} fill priority={false} />
        </figure>
      )}

      <div className="card-body">
        <h2 className="card-title text-base sm:text-2xl">
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

        <div className="flex flex-row flex-wrap gap-2">
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
