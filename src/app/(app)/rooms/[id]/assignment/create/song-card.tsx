import { SongWithCharts } from "@/server/prisma/chart.db";
import { Chart, ChartType } from "@prisma/client";
import LevelBall from "./level-ball";
import { useEffect, useState } from "react";

type Props = {
  songWithChart: SongWithCharts;
  onSelect?: (song: SongWithCharts, chart: Chart) => void;
  chartType?: ChartType;
};

export default function SongCard({
  songWithChart,
  onSelect,
  chartType,
}: Props) {
  const handleChartSelect = (song: SongWithCharts, chart: Chart) => {
    onSelect?.(song, chart);
  };

  const [visibleCharts, setvisibleCharts] = useState<Chart[] | undefined>(
    songWithChart.charts
  );

  useEffect(() => {
    if (chartType) {
      const filtered = songWithChart.charts?.filter(
        (chart) => chart.chartType === chartType
      );
      setvisibleCharts(filtered);

      // console.log("visibleCharts", filtered, songWithChart.name);
    }
  }, [chartType]);

  return (
    visibleCharts &&
    visibleCharts.length > 0 && (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-base sm:text-xl">
            {songWithChart.name}
            {songWithChart.patchVersion === "1.07" && (
              <div className="badge badge-secondary">NEW</div>
            )}
          </h2>

          <div className="card-actions justify-end *:text-[9px] *:sm:text-xs">
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
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-4 gap-2 sm:gap-3 mt-4 sm:mt-6">
              {visibleCharts?.map((chart) => (
                <LevelBall
                  key={chart.seq}
                  chart={chart}
                  onClick={(chart) => handleChartSelect(songWithChart, chart)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  );
}
