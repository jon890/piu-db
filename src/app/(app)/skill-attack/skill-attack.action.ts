"use server";

import ChartDB from "@/server/prisma/chart.db";
import RecordDB from "@/server/prisma/record.db";
import AuthUtil from "@/server/utils/auth-util";
import Decimal from "decimal.js";
import type { Chart } from "@prisma/client";
import SkillAttackDB from "@/server/prisma/skill-attack.db";
import { getSkillPoint } from "./skill-point.util";
import { redirect } from "next/navigation";

export async function skillAttackAction() {
  const userSeq = await AuthUtil.getUserSeqThrows();

  const records = await RecordDB.findAllMaxRecordsGroupByChart(userSeq);

  const chartSeqs = records.map((it) => it.chartSeq);
  const charts = await ChartDB.findBySeqIn(chartSeqs);
  const chartMap = getChartSeqMap(charts);

  // 점수 계산
  // 0 ~ 100점으로 계산
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

  const targetRecords = [];
  let skillPoints = new Decimal(0);
  for (let i = 0; i < Math.min(50, skills.length); i++) {
    const skill = skills[i];
    if (!skill) continue;
    targetRecords.push(skill.recordSeq);
    skillPoints = skillPoints.add(skill.skillPoint);
  }

  await SkillAttackDB.create({
    userSeq,
    skillPoints: skillPoints.toNumber(),
    recordSeqs: targetRecords,
  });

  redirect("/skill-attack");
}

function getChartSeqMap(charts: Chart[]) {
  const chartMap = new Map<number, Chart>();
  for (const chart of charts) {
    chartMap.set(chart.seq, chart);
  }

  return chartMap;
}
