"use client";

import classnames from "@/utils/classnames";
import { Chart } from "@prisma/client";
import { HTMLAttributes } from "react";

type Props = {
  chart?: Chart; // 차트 값이 없으면 단순 text용
  hasHover?: boolean;
  text?: string;
  handleSelect?: (chart: Chart) => void;
} & HTMLAttributes<HTMLButtonElement>;

export default function LevelBall({
  chart,
  hasHover,
  className,
  text,
  handleSelect,
}: Props) {
  return (
    <div
      onClick={() => {
        if (chart && handleSelect) {
          handleSelect(chart);
        }
      }}
      className={classnames(
        "text-xs sm:text-sm rounded-full",
        "flex justify-center items-center",
        "ring-2 ring-offset-1 ring-black",
        "transition-opacity",
        chart
          ? {
              "bg-red-500": chart.chartType === "SINGLE",
              "bg-green-500": chart.chartType === "DOUBLE",
              "bg-yellow-500": chart.chartType === "CO_OP",
            }
          : "",
        {
          "hover:opacity-30 active:opacity-30": Boolean(hasHover),
        },
        className ?? ""
      )}
    >
      {chart ? chart.level : text}
    </div>
  );
}
