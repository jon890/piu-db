import classnames from "@/client/utils/classnames";
import { Chart } from "@prisma/client";
import { ButtonHTMLAttributes } from "react";

type Props = {
  chart: Chart;
} & ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * 레벨 볼 서버 컴포넌트
 * @param param0
 * @returns
 */
export default function LevelBallSC({ chart, className }: Props) {
  return (
    <button
      className={classnames(
        "text-xs sm:text-sm rounded-full",
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
