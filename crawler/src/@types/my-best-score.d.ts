import { type ChartType } from "./chart-type";
import { type Grade } from "./grade";
import { type Plate } from "./plate";

export type MyBestScore = {
  type: ChartType;
  level: string;
  grade: Grade;
  plate: Plate;
  songName: string;
  score: number;
};
