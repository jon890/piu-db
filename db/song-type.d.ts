import { ChartType, PiuVersion, SongType } from "@prisma/client";

export type SongData = {
  name: string;
  artist: string;
  bpm: string;
  version: PiuVersion;
  songType: SongType;
  charts: { level: number; chartType: ChartType }[];
};
