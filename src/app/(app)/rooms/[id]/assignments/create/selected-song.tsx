import LevelBall from "@/components/level-ball.server";
import { PATCHED_VERSION } from "@/constants/const";
import { SongWithCharts } from "@/server/prisma/chart.db";
import { Chart } from "@prisma/client";

type Props = {
  songWithChart: SongWithCharts;
  chart: Chart;
};

export default function SelectedSongCard({ songWithChart, chart }: Props) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">
          {songWithChart.name}
          {songWithChart.patchVersion === PATCHED_VERSION && (
            <div className="badge badge-secondary">NEW</div>
          )}
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
            <LevelBall
              key={chart.seq}
              chart={chart}
              className="size-8 sm:size-14"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
