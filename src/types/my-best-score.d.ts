import type { Grade, Plate, RecordType } from "./recently-played";

export type MyBestScore = {
  type: RecordType;
  level: string;
  grade: Grade;
  plate: Plate;
  songName: string;
  score: number;
};
