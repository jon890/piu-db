import { type ChartType } from "./chart-type";
import { type Grade } from "./grade";
import { type Plate } from "./plate";

export type RecentlyPlayed = {
  type: ChartType;
  level: string;
  grade: Grade;
  plate: Plate;
  isBreakOff: boolean;
  songName: string;
  score: number;
  perfect: number;
  great: number;
  good: number;
  bad: number;
  miss: number;
  playedTime: string;
};
