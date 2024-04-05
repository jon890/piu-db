import classnames from "@/client/utils/classnames";
import { Chart } from "@prisma/client";
import { ButtonHTMLAttributes } from "react";

type Props = {
  chart?: Chart;
  hasHover?: boolean;
  text?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * 레벨 볼 서버 컴포넌트
 */
export default function LevelBallSC({
  chart,
  hasHover,
  className,
  text,
}: Props) {
  return (
    <div
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
