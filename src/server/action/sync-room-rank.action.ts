"use server";

import type { AssignmentRoomParticipants } from "@prisma/client";
import AssignmentRecordDB from "../prisma/assignment-record.db";
import AssignmentDB from "../prisma/assignment.db";
import ChartDB from "../prisma/chart.db";
import prisma from "../prisma/client";
import ParticipantsDB from "../prisma/room-participants.db";
import dayjs from "dayjs";

type AssignmentUserRankMap = {
  firstPlaceSeqs: number[];
  secondPlaceSeqs: number[];
  thirdPlaceSeqs: number[];
  totalScore: number;
  notAttendCount: number;
  attendedDate: Date;
};

function toMap(array: AssignmentRoomParticipants[]) {
  const map = new Map<number, AssignmentUserRankMap>();

  for (const item of array) {
    map.set(item.userSeq, {
      firstPlaceSeqs: (item.firstPlaceSeqs ?? []) as number[],
      secondPlaceSeqs: (item.secondPlaceSeqs ?? []) as number[],
      thirdPlaceSeqs: (item.thirdPlaceSeqs ?? []) as number[],
      totalScore: item.totalScore,
      notAttendCount: item.notAttendCount,
      attendedDate: item.createdAt,
    });
  }

  return map;
}

async function forEachMap<K, V>(
  map: Map<K, V>,
  func: (k: K, v: V) => void | Promise<void>
) {
  const keyIterator = map.keys();

  while (true) {
    const next = keyIterator.next();
    if (next.done) {
      break;
    }

    const key = next.value;
    const value = map.get(key)!;

    await func(key, value);
  }
}

export async function syncRoomRankAction(roomSeq: number) {
  await prisma.$transaction(
    async (tx) => {
      const assignments = await AssignmentDB.readyRankProcess(roomSeq, tx);
      if (assignments.length === 0) return;

      const participants = await ParticipantsDB.getByRoom(roomSeq, tx);
      const updateMap = toMap(participants);

      for (const assignment of assignments) {
        const chart = await ChartDB.findBySeq(assignment.chartSeq);
        if (!chart) continue;

        const records = await AssignmentRecordDB.getRecordsByAssgimentSeq(
          assignment.seq,
          tx
        );

        // 숙제 불참 확인
        const attendedUsers = records.map((it) => it.user.seq);
        await forEachMap(updateMap, (userSeq, data) => {
          const isNotAttend =
            !attendedUsers.includes(userSeq) &&
            dayjs(data.attendedDate).isBefore(assignment.endDate);
          if (isNotAttend) data.notAttendCount = data.notAttendCount + 1;
        });

        for (let i = 0; i < records.length; i++) {
          const record = records[i];
          const score = records.length - i;

          const data = updateMap.get(record.user.seq)!;
          data.totalScore += score;
          if (i === 0) {
            data.firstPlaceSeqs.push(assignment.seq);
          } else if (i === 1) {
            data.secondPlaceSeqs.push(assignment.seq);
          } else if (i === 2) {
            data.thirdPlaceSeqs.push(assignment.seq);
          }
        }
      }

      await forEachMap(updateMap, async (userSeq, data) => {
        await ParticipantsDB.update(
          roomSeq,
          userSeq,
          data.firstPlaceSeqs,
          data.secondPlaceSeqs,
          data.thirdPlaceSeqs,
          data.totalScore,
          data.notAttendCount,
          tx
        );
      });
    },
    { isolationLevel: "RepeatableRead" }
  );

  return {
    ok: true,
    message: "동기화가 완료되었습니다",
  };
}
