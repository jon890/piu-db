import ChartDB from "@/server/prisma/chart.db";
import RecordDB from "@/server/prisma/record.db";
import RecordModal from "./record-modal";

type Props = {
  params: {
    uid: string;
    record_seq: number;
  };
};

export default async function RecordModalWrapper({
  params: { record_seq },
}: Props) {
  const recordSeq = Number(record_seq);
  const record = isNaN(recordSeq) ? null : await RecordDB.findBySeq(recordSeq);
  const songWithChart = record
    ? await ChartDB.findSongBySeq(record?.chartSeq)
    : null;

  if (!record || !songWithChart?.chart || !songWithChart?.song) {
    return null;
  }

  return (
    <RecordModal
      record={record}
      song={songWithChart.song}
      chart={songWithChart.chart}
    />
  );
}
