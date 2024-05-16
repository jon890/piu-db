"use server";

import ChartDB from "@/server/prisma/chart.db";
import RecordDB from "@/server/prisma/record.db";
import SkillAttackDB from "@/server/prisma/skill-attack.db";
import AuthUtil from "@/server/utils/auth-util";
import ArrayUtil from "@/utils/array.util";
import { getSkillPoint } from "@/utils/piu.util";
import type { Chart } from "@prisma/client";
import Decimal from "decimal.js";

export async function syncSkillAttackAction() {
  const userSeq = await AuthUtil.getUserSeqThrows();

  const prevSkillAttack = await SkillAttackDB.findByUserLatest(userSeq);

  // 스킬어택 갱신 이후에 등록된 chartSeqs를 찾는다
  const latestSubmittedChartSeqs = await RecordDB.findAllChartSeqsByUser(
    userSeq,
    prevSkillAttack?.createdAt
  );
  if (latestSubmittedChartSeqs.length === 0) {
    return {
      ok: true,
      message:
        "새로운 기록이 등록되지 않았습니다\n 내 기록 목록에서 동기화를 진행해주세요",
    };
  }

  // 최신 스킬어택에 등록된 기록
  const prevSubmittedRecords = prevSkillAttack
    ? await RecordDB.findBySeqIn(prevSkillAttack.recordSeqs as number[])
    : [];
  // 그 이후에 등록된 최고 기록
  const maxRecords = await RecordDB.getMaxRecordsBy(
    userSeq,
    latestSubmittedChartSeqs
  );

  const allCharts = await ChartDB.findAll();
  const chartMap = ArrayUtil.associatedBy(allCharts, (chart) => chart.seq);

  // 스킬 점수 계산
  const skills = [
    ...prevSubmittedRecords.map((record) => ({
      seq: record.seq,
      chartSeq: record.chartSeq,
      score: record.score,
    })),
    ...maxRecords.map((maxRecord) => ({
      seq: maxRecord.seq,
      chartSeq: maxRecord.chart_seq,
      score: maxRecord.score,
    })),
  ]
    .map(({ chartSeq, score, seq }) => {
      const chart = chartMap.get(chartSeq);
      if (!chart) throw Error(`Target chart is null chartSeq:${chartSeq}`);

      return {
        recordSeq: seq,
        chartSeq,
        score,
        level: chart.level,
        skillPoint: Number(getSkillPoint(score, chart)),
      };
    })
    .filter(ArrayUtil.notEmpty)
    .sort((a, b) => b.skillPoint - a.skillPoint);

  // 50개만 다시 분류하여 계산하기
  // 같은 차트 중복 제거
  const targetRecords: { recordSeq: number; chartSeq: number }[] = [];
  let skillPoints = new Decimal(0);
  let index = 0;
  while (true) {
    if (targetRecords.length === 50) break;

    const skill = skills[index];
    if (!skill) break;

    const exist = targetRecords.find((it) => it.chartSeq === skill.chartSeq);
    if (exist) {
      index++;
      continue;
    }

    targetRecords.push({
      recordSeq: skill.recordSeq,
      chartSeq: skill.chartSeq,
    });
    skillPoints = skillPoints.add(skill.skillPoint);
  }

  const isRecorded = await SkillAttackDB.create({
    userSeq,
    skillPoints: skillPoints.toNumber(),
    recordSeqs: targetRecords.map((it) => it.recordSeq),
  });

  if (isRecorded) {
    return {
      ok: true,
      message: `스킬 어택 갱신이 완료되었습니다\n 증가 점수: +${isRecorded.delta}`,
    };
  } else {
    return {
      ok: true,
      message: "스킬 어택을 갱신했으나, 점수가 오르지 않았습니다",
    };
  }
}

function getChartSeqMap(charts: Chart[]) {
  const chartMap = new Map<number, Chart>();
  for (const chart of charts) {
    chartMap.set(chart.seq, chart);
  }

  return chartMap;
}
