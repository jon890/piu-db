import classnames from "@/client/utils/classnames";
import { Chart } from "@prisma/client";
import { ButtonHTMLAttributes } from "react";

type Props = {
  chart: Chart;
  onClick?: (chart: Chart) => void;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function LevelBall({ chart, onClick, className }: Props) {
  return (
    <button
      onClick={() => onClick?.(chart)}
      className={classnames(
        "size-8 sm:size-14 text-sm sm:text-base rounded-full",
        "flex justify-center items-center",
        "ring-2 ring-offset-1 ring-black",
        "cursor-pointer hover:opacity-30 active:opacity-30 transition-opacity",
        {
          "bg-red-500": chart.chartType === "SINGLE",
          "bg-green-500": chart.chartType === "DOUBLE",
          "bg-yellow-500": chart.chartType === "CO_OP",
        },
        className ?? ""
      )}
    >
      {chart.level}
    </button>
  );
}
