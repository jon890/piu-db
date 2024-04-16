import type { ChartType } from "@prisma/client";
import Link from "next/link";
import LevelBall from "../level-ball";
import classnames from "@/client/utils/classnames";

type Props = {
  level: number;
  chartType?: ChartType;
};

export default function SelectChartType({ level, chartType }: Props) {
  return (
    <div className="flex flex-row gap-4">
      <Link href={`/records/level/${level}?CHART_TYPE=SINGLE`}>
        <LevelBall
          className={classnames(
            "size-12 sm:size-20 cursor-pointer bg-red-500",
            chartType === "SINGLE" ? "opacity-30" : ""
          )}
          text="싱글"
          hasHover
        />
      </Link>

      <Link href={`/records/level/${level}?CHART_TYPE=DOUBLE`}>
        <LevelBall
          className={classnames(
            "size-12 sm:size-20 cursor-pointer bg-green-500",
            chartType === "DOUBLE" ? "opacity-30" : ""
          )}
          text="더블"
          hasHover
        />
      </Link>
    </div>
  );
}
