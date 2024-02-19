export type Type = "Single" | "Double" | "Unknown";

export type Grade =
  | "SSS_PLUS"
  | "SSS"
  | "SS_PLUS"
  | "SS"
  | "S_PLUS"
  | "S"
  | "AAA_PLUS"
  | "AAA"
  | "AA_PLUS"
  | "AA"
  | "A_PLUS"
  | "A"
  | "B"
  | "C"
  | "D"
  | "F";

export type Plate =
  | "ROUGH_GAME"
  | "FAIR_GAME"
  | "TALENTED_GAME"
  | "MARVELOUS_GAME"
  | "SUPERB_GAME"
  | "EXTREME_GAME"
  | "ULTIMATE_GAME"
  | "PERFECT_GAME"
  | null;

export type RecentlyPlayed = {
  type: Type;
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
