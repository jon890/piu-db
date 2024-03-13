import LevelBall from "@/components/level-ball.server";
import { Chart, Song } from "@prisma/client";
import Link from "next/link";

type Props = {
  song: Song;
  charts: Chart[];
};

export default function SongCard({ song, charts }: Props) {
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
              <LevelBall
                key={chart.seq}
                chart={chart}
                className="size-8 sm:size-12"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
