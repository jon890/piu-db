"use client";

import Card from "@/components/common/card";
import CheckBox from "@/components/common/check-box";
import RecordList from "@/components/records/record-list";
import ArrayUtil from "@/utils/array.util";
import NumberUtil from "@/utils/number.util";
import Decimal from "decimal.js";
import { useState } from "react";

type Props = {
  // TODO any 수정
  songAndRecords: any[];
};

export default function LevelRecordsDetail({ songAndRecords }: Props) {
  const [visibleClear, setVisibleClear] = useState<boolean>(false);

  const records = songAndRecords
    .map((it) => it.chart?.record)
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

  const arcadeRecrods = songAndRecords.filter((it) => it.songType === "ARCADE");
  const remixRecords = songAndRecords.filter((it) => it.songType === "REMIX");
  const fullRecords = songAndRecords.filter(
    (it) => it.songType === "FULL_SONG"
  );
  const shortRecords = songAndRecords.filter(
    (it) => it.songType === "SHORT_CUT"
  );

  return (
    <div className="flex flex-col justify-center items-center gap-3">
      <div className="flex flex-row gap-3 flex-wrap">
        <Card title="평균 점수">
          <p className="text-center">{NumberUtil.formatScore(avgScores)}</p>
        </Card>

        <Card title="클리어 수">
          <p className="text-center">
            {clearCounts} / {songAndRecords.length}
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
            songAndRecords={arcadeRecrods}
            visibleClear={visibleClear}
          />
        </>
      )}

      {remixRecords.length > 0 && (
        <>
          <h3 className="font-semibold text-2xl mt-10 mb-3">리믹스</h3>
          <RecordList
            songAndRecords={remixRecords}
            visibleClear={visibleClear}
          />
        </>
      )}

      {remixRecords.length > 0 && (
        <>
          <h3 className="font-semibold text-2xl mt-10 mb-3">풀송</h3>
          <RecordList
            songAndRecords={fullRecords}
            visibleClear={visibleClear}
          />
        </>
      )}

      {remixRecords.length > 0 && (
        <>
          <h3 className="font-semibold text-2xl mt-10 mb-3">숏컷</h3>
          <RecordList
            songAndRecords={shortRecords}
            visibleClear={visibleClear}
          />
        </>
      )}
    </div>
  );
}
