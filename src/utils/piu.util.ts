import {
  $Enums,
  type Chart,
  type RecordGrade,
  type RecordPlate,
} from "@prisma/client";
import Decimal from "decimal.js";

export const getSkillPoint = (score: number, chart: Chart) => {
  return new Decimal(score).div(1000000).mul(chart.level).toFixed(3);
};

export const GRADE_INDEX_MAP = new Map<RecordGrade, number>();
Object.values($Enums.RecordGrade).forEach((grade, i) => {
  const totalCount = Object.values($Enums.RecordGrade).length;
  GRADE_INDEX_MAP.set(grade, totalCount - i);
});

export function compareGrade(grade1: RecordGrade, grade2: RecordGrade) {
  return GRADE_INDEX_MAP.get(grade1)!! - GRADE_INDEX_MAP.get(grade2)!!;
}

export const PLATE_INDEX_MAP = new Map<RecordPlate, number>();
Object.values($Enums.RecordPlate).forEach((plate, i) => {
  PLATE_INDEX_MAP.set(plate, i);
});
