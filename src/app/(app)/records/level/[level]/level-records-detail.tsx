"use client";

import Card from "@/components/common/card";
import CheckBox from "@/components/common/check-box";
import RecordGrade from "@/components/record/record-grade";
import RecordPlate from "@/components/record/record-plate";
import RecordList from "@/components/records/record-list";
import ArrayUtil from "@/utils/array.util";
import classnames from "@/utils/classnames";
import NumberUtil from "@/utils/number.util";
import {
  GRADE_INDEX_MAP,
  PLATE_INDEX_MAP,
  compareGrade,
} from "@/utils/piu.util";
import Decimal from "decimal.js";
import { useState } from "react";
import { LevelRecord } from "./get-records";

type Props = {
  levelRecords: LevelRecord[];
};

export default function LevelRecordsDetail({ levelRecords }: Props) {
  const [visibleClear, setVisibleClear] = useState<boolean>(false);

  const records = levelRecords
    .map((it) => it.record)
    .filter(ArrayUtil.notEmpty);

  const clearCounts = records.filter((it) => it.is_break_off === 0).length;

  const avgScores =
    records.length === 0
      ? 0
      : records
          .reduce((acc, cur) => {
            return acc.plus(cur.score);
          }, new Decimal(0))
          .div(records.length);

  const maxPlate = ArrayUtil.maxBy(records, (record) => {
    return PLATE_INDEX_MAP.get(record.plate) ?? null;
  });

  const minGrade = ArrayUtil.maxBy(records, (record) => {
    return GRADE_INDEX_MAP.get(record.grade) ?? null;
  });

  const arcadeRecrods = levelRecords.filter(
    (it) => it.song.songType === "ARCADE"
  );
  const remixRecords = levelRecords.filter(
    (it) => it.song.songType === "REMIX"
  );
  const fullRecords = levelRecords.filter(
    (it) => it.song.songType === "FULL_SONG"
  );
  const shortRecords = levelRecords.filter(
    (it) => it.song.songType === "SHORT_CUT"
  );

  let borderColor = "";
  const allClear = clearCounts === levelRecords.length;

  if (allClear && minGrade) {
    if (compareGrade(minGrade.grade, "SSS") > 0)
      borderColor = "border-ultimate";

    if (compareGrade(minGrade.grade, "S") > 0) borderColor = "border-superb";

    if (compareGrade(minGrade.grade, "AAA") > 0)
      borderColor = "border-talented";

    if (compareGrade(minGrade.grade, "A") > 0) borderColor = "border-rough";
  }

  console.log(minGrade, allClear, borderColor);

  return (
    <div className="flex flex-col justify-center items-center gap-3">
      <div className="flex flex-row gap-3 flex-wrap">
        <Card
          title="평균 점수"
          classname={classnames(borderColor ? "border-4" : "", borderColor)}
        >
          <p className="text-center text-sm sm:text-base">
            {NumberUtil.formatScore(avgScores)}
          </p>
        </Card>

        <Card
          title="클리어 수"
          classname={classnames(borderColor ? "border-4" : "", borderColor)}
        >
          <p className="text-center text-sm sm:text-base">
            {clearCounts} / {levelRecords.length}
          </p>
        </Card>

        <Card
          title="최고 그레이드"
          classname={classnames(borderColor ? "border-4" : "", borderColor)}
        >
          <div className="text-sm sm:text-base flex flex-row gap-2 justify-center">
            {maxPlate ? <RecordPlate plate={maxPlate.plate} /> : "none"}
            <span>/</span>
            {minGrade ? (
              <RecordGrade grade={minGrade.grade} isBreakOff={false} />
            ) : (
              "none"
            )}
          </div>
        </Card>
      </div>

      <CheckBox
        topLeft="클리어 표시"
        onChange={(e) => setVisibleClear((prev) => !prev)}
      />

      {arcadeRecrods.length > 0 && (
        <RecordsByChartType
          title="아케이드"
          levelRecords={arcadeRecrods}
          visibleClear={visibleClear}
        />
      )}

      {remixRecords.length > 0 && (
        <RecordsByChartType
          title="리믹스"
          levelRecords={remixRecords}
          visibleClear={visibleClear}
        />
      )}

      {fullRecords.length > 0 && (
        <RecordsByChartType
          title="풀송"
          levelRecords={fullRecords}
          visibleClear={visibleClear}
        />
      )}

      {shortRecords.length > 0 && (
        <RecordsByChartType
          title="숏컷"
          levelRecords={shortRecords}
          visibleClear={visibleClear}
        />
      )}
    </div>
  );
}

function RecordsByChartType({
  title,
  levelRecords,
  visibleClear,
}: {
  title: string;
  levelRecords: LevelRecord[];
  visibleClear: boolean;
}) {
  return (
    <div className="flex flex-col w-full">
      <h3 className="font-semibold text-xl sm:text-2xl mt-5 sm:mt-10 mb-3">
        {title}
      </h3>
      <RecordList levelRecords={levelRecords} visibleClear={visibleClear} />
    </div>
  );
}
