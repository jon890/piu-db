import classnames from "@/client/utils/classnames";
import { Chart } from "@prisma/client";
import { ButtonHTMLAttributes } from "react";

type Props = {
  chart: Chart;
  hasHover?: boolean;
  handleSelect?: (chart: Chart) => void;
} & ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * 레벨 볼 클라이언트 컴포넌트
 * @param param0
 * @returns
 */
export default function LevelBallCC({
  chart,
  handleSelect,
  hasHover,
  className,
}: Props) {
  return (
    <div
      onClick={() => handleSelect?.(chart)}
      className={classnames(
        "text-xs sm:text-sm rounded-full",
        "flex justify-center items-center",
        "ring-2 ring-offset-1 ring-black",
        "transition-opacity",
        {
          "bg-red-500": chart.chartType === "SINGLE",
          "bg-green-500": chart.chartType === "DOUBLE",
          "bg-yellow-500": chart.chartType === "CO_OP",
        },
        {
          "hover:opacity-30 active:opacity-30 cursor-pointer":
            Boolean(hasHover),
        },
        className ?? ""
      )}
    >
      {chart.level}
    </div>
  );
}
