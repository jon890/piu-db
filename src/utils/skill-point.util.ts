import type { Chart } from "@prisma/client";
import Decimal from "decimal.js";

export const getSkillPoint = (score: number, chart: Chart) => {
  return new Decimal(score).div(1000000).mul(chart.level).toFixed(3);
};
