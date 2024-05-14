"use client";

import Card from "@/components/common/card";
import CheckBox from "@/components/common/check-box";
import RecordList from "@/components/records/record-list";
import ArrayUtil from "@/utils/array.util";
import NumberUtil from "@/utils/number.util";
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

  return (
    <div className="flex flex-col justify-center items-center gap-3">
      <div className="flex flex-row gap-3 flex-wrap">
        <Card title="평균 점수">
          <p className="text-center">{NumberUtil.formatScore(avgScores)}</p>
        </Card>

        <Card title="클리어 수">
          <p className="text-center">
            {clearCounts} / {levelRecords.length}
          </p>
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
