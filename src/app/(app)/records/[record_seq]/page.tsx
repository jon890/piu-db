import ContentBox from "@/components/layout/content-box";
import LevelBall from "@/components/level-ball";
import RecordGrade from "@/components/record/record-grade";
import RecordPlate from "@/components/record/record-plate";
import ChartDB from "@/server/prisma/chart.db";
import RecordDB from "@/server/prisma/record.db";
import { notFound } from "next/navigation";

type Props = {
  params: {
    record_seq: number;
  };
};

export default async function RecordDetailPage({
  params: { record_seq },
}: Props) {
  const recordSeq = Number(record_seq);
  const record = isNaN(recordSeq)
    ? notFound()
    : await RecordDB.findBySeq(recordSeq);
  const songWithChart = record
    ? await ChartDB.findSongBySeq(record?.chartSeq)
    : null;

  return (
    <ContentBox title="기록 상세">
      <div className="modal-box space-y-5">
        <h3 className="font-semibold text-base">{songWithChart?.song?.name}</h3>
        <div className="flex flex-row justify-between px-16 items-center">
          {songWithChart && songWithChart.chart && (
            <LevelBall chart={songWithChart?.chart} className="size-12" />
          )}
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
      </div>
    </ContentBox>
  );
}
