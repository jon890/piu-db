import { Chart } from "@prisma/client";
import { ButtonHTMLAttributes } from "react";
import LevelBallSC from "./level-ball.server";

type Props = {
  chart: Chart;
  handleSelect?: (chart: Chart) => void;
} & ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * 레벨 볼 클라이언트 컴포넌트
 * @param param0
 * @returns
 */
export default function LevelBallCC({ chart, handleSelect, className }: Props) {
  return (
    <LevelBallSC
      onClick={() => handleSelect?.(chart)}
      chart={chart}
      className={className ?? ""}
    />
  );
}
