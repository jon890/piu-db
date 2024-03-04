import prisma from "@/server/prisma/client";
import { Type } from "@/types/recently-played";
import { ChartType } from "@prisma/client";

function getChart(songName: string, chartType: Type, level: number) {
  let _chartType: ChartType | undefined;
  if (chartType === "Single") {
    _chartType = "SINGLE";
  } else if (chartType === "Double") {
    _chartType = "DOUBLE";
  }

  // todo co-op, ucs?
  if (!_chartType) {
    return;
  }

  return prisma.chart.findUnique({
    where: {
      chartType: _chartType,
      level,
      song: {
        name: {
          equals: songName,
        },
      },
    },
  });
}

const ChartDB = {
  getChart,
};

export default ChartDB;
