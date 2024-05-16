"use client";

import LevelBall from "@/components/level-ball";
import RecordGrade from "@/components/record/record-grade";
import RecordPlate from "@/components/record/record-plate";
import type { Chart, Record, Song } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useRef } from "react";

type Props = {
  record: Record;
  chart: Chart;
  song: Song;
};

export default function RecordModal({ record, chart, song }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  return (
    <dialog
      id={`record_modal_${record.seq}`}
      className="modal"
      open
      ref={dialogRef}
      onClose={() => router.back()}
    >
      <div className="modal-box space-y-5">
        <h3 className="font-semibold text-base">{song.name}</h3>
        <div className="flex flex-row justify-between px-16 items-center">
          <LevelBall chart={chart} className="size-12" />
          <div className="flex flex-col items-center">
            {record && (
              <RecordGrade
                grade={record.grade}
                isBreakOff={record.isBreakOff}
              />
            )}
            {record && <span>{record.score}</span>}
          </div>
          {record?.plate && <RecordPlate plate={record.plate} />}
        </div>
        <div className="flex flex-row justify-between px-3 bg-slate-500 text-center p-4 rounded-md">
          <div className="flex flex-col">
            <span className="text-blue-500 font-semibold">PERFECT</span>
            <span className="text-white">{record?.perfect ?? 0}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-green-500 font-semibold">GREAT</span>
            <span className="text-white">{record?.great ?? 0}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-yellow-500 font-semibold">GOOD</span>
            <span className="text-white">{record?.good ?? 0}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-violet-500 font-semibold">BAD</span>
            <span className="text-white">{record?.bad ?? 0}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-red-500 font-semibold">MISS</span>
            <span className="text-white">{record?.miss ?? 0}</span>
          </div>
        </div>

        <div className="modal-action">
          <form method="dialog">
            {/* If there is a button in formn, it will close the modal */}
            <button className="btn">닫기</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
