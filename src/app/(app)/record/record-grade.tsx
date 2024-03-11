import classnames from "@/client/utils/classnames";
import type { RecordGrade as RecordGradeDataType } from "@prisma/client";

type Props = {
  grade: RecordGradeDataType;
};

export default function RecordGrade({ grade }: Props) {
  return (
    <span
      className={classnames("plate", {
        "text-rough":
          grade === "F" ||
          grade === "D" ||
          grade === "C" ||
          grade === "B" ||
          grade === "A" ||
          grade === "A_PLUS" ||
          grade === "AA" ||
          grade === "AA_PLUS",

        "text-talented": grade === "AAA" || grade === "AAA_PLUS",

        "text-superb":
          grade === "S" ||
          grade === "S_PLUS" ||
          grade === "SS" ||
          grade === "SS_PLUS",

        "text-ultimate": grade === "SSS" || grade === "SSS_PLUS",
      })}
    >
      {grade.includes("_")
        ? grade.substring(0, grade.indexOf("_")) + "+"
        : grade}
    </span>
  );
}
