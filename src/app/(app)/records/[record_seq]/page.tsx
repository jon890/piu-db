import ContentBox from "@/components/layout/content-box";
import LevelBall from "@/components/level-ball";
import RecordGrade from "@/components/record/record-grade";
import RecordPlate from "@/components/record/record-plate";
import ChartDB from "@/server/prisma/chart.db";
import RecordDB from "@/server/prisma/record.db";
import TimeUtil from "@/server/utils/time-util";
import classnames from "@/utils/classnames";
import Image from "next/image";
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
    : notFound();

  const { chart, song } = songWithChart;

  if (!record || !song || !chart) {
    return notFound();
  }

  return (
    <ContentBox title="기록 상세">
      <div className="modal-box p-0 border-4">
        <div
          className={classnames("card p-0", song.imageUrl ? "image-full" : "")}
        >
          {song.imageUrl && (
            <figure className="relative opacity-90">
              <Image
                src={song.imageUrl}
                alt={song.name}
                fill
                priority={false}
                sizes="50vw"
              />
            </figure>
          )}

          <div className="card-body space-y-4">
            <h2 className="card-title text-black dark:text-white">
              {song.name}
            </h2>
            <div className="flex flex-row justify-between px-12 items-center">
              <LevelBall
                chart={chart}
                className="size-12 text-black dark:text-white"
              />
              <div className="flex flex-col items-center">
                <RecordGrade
                  grade={record.grade}
                  isBreakOff={record.isBreakOff}
                />
                <span className="text-black dark:text-white">
                  {record.score}
                </span>
              </div>
              {record?.plate && <RecordPlate plate={record.plate} />}
            </div>

            <div className="flex flex-row justify-between px-3 bg-black bg-opacity-75 text-center p-4 rounded-md">
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

            {record.playedAt && (
              <span className="text-xs text-end text-black dark:text-white">
                플레이 시간:{" "}
                {TimeUtil.format(record.playedAt, "YYYY-MM-DD hh:mm:ss")}
              </span>
            )}
          </div>
        </div>
      </div>
    </ContentBox>
  );
}
