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
        <>
          <h3 className="font-semibold text-2xl mt-10 mb-3">아케이드</h3>
          <RecordList
            levelRecords={arcadeRecrods}
            visibleClear={visibleClear}
          />
        </>
      )}

      {remixRecords.length > 0 && (
        <>
          <h3 className="font-semibold text-2xl mt-10 mb-3">리믹스</h3>
          <RecordList levelRecords={remixRecords} visibleClear={visibleClear} />
        </>
      )}

      {remixRecords.length > 0 && (
        <>
          <h3 className="font-semibold text-2xl mt-10 mb-3">풀송</h3>
          <RecordList levelRecords={fullRecords} visibleClear={visibleClear} />
        </>
      )}

      {remixRecords.length > 0 && (
        <>
          <h3 className="font-semibold text-2xl mt-10 mb-3">숏컷</h3>
          <RecordList levelRecords={shortRecords} visibleClear={visibleClear} />
        </>
      )}
    </div>
  );
}
