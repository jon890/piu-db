"use server";

import { syncRecentlyPlayedAction } from "@/server/action/sync-recently-played.action";
import ChartDB from "@/server/prisma/chart.db";
import RecordDB from "@/server/prisma/record.db";
import SkillAttackDB from "@/server/prisma/skill-attack.db";
import AuthUtil from "@/server/utils/auth-util";
import type { PiuAuth } from "@/types/piu-auth";
import { getSkillPoint } from "@/utils/piu.util";
import type { Chart } from "@prisma/client";
import Decimal from "decimal.js";

export async function syncSkillAttackAction(piuAuth: PiuAuth) {
  const userSeq = await AuthUtil.getUserSeqThrows();

  // 기록 동기화
  const crawlingRes = await syncRecentlyPlayedAction(piuAuth, userSeq);
  if (!crawlingRes.ok) {
    return { ok: false, message: crawlingRes.message };
  }

  // 이전 스킬어택 기록과, 그 이후 새로 등록된 기록을 모두 가져온다
  const prevSkillAttack = await SkillAttackDB.findByUserLatest(userSeq);
  const records = prevSkillAttack
    ? [
        ...(await RecordDB.findBySeqIn(prevSkillAttack.recordSeqs as number[])),
        ...(await RecordDB.findAllMaxRecordsGroupByChart(
          userSeq,
          prevSkillAttack.createdAt
        )),
      ]
    : await RecordDB.findAllMaxRecordsGroupByChart(userSeq);

  const chartSeqs = records.map((it) => it.chartSeq);
  const charts = await ChartDB.findBySeqIn(chartSeqs);
  const chartMap = getChartSeqMap(charts);

  // 스킬 점수 계산
  const skills = records
    .map(({ chartSeq, score, seq }) => {
      const chart = chartMap.get(chartSeq);
      if (!chart) {
        console.warn("Cannot find chart with", chartSeq);
        return null;
      }
      if (!score) {
        console.warn("Score is null");
        return null;
      }

      const skillPoint = getSkillPoint(score, chart);

      return {
        recordSeq: seq,
        chartSeq,
        score,
        level: chart.level,
        skillPoint: Number(skillPoint),
      };
    })
    .filter((it) => it != null)
    .sort((a, b) => (b?.skillPoint ?? 0) - (a?.skillPoint ?? 0));

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

  await SkillAttackDB.create({
    userSeq,
    skillPoints: skillPoints.toNumber(),
    recordSeqs: targetRecords.map((it) => it.recordSeq),
  });

  return { ok: true, message: "스킬 어택 갱신이 완료되었습니다" };
}

function getChartSeqMap(charts: Chart[]) {
  const chartMap = new Map<number, Chart>();
  for (const chart of charts) {
    chartMap.set(chart.seq, chart);
  }

  return chartMap;
}
