"use client";

import TimeUtil from "@/server/utils/time-util";
import { type PumbilityRanking } from "@prisma/client";
import { Line, LineChart, XAxis, YAxis } from "recharts";

type Props = {
  data: PumbilityRanking[];
};

export default function PumbilityChart({ data }: Props) {
  const chartData = data.map((it) => ({
    date: TimeUtil.format(it.createdAt, "YYYY-MM-DD"),
    score: it.score,
  }));

  return (
    <LineChart width={400} height={400} data={chartData}>
      <XAxis dataKey="date" />
      <YAxis dataKey="score" />
      <Line type="monotone" dataKey="score" stroke="#8884d8" />
    </LineChart>
  );
}
