import classnames from "@/client/utils/classnames";
import RecordGrade from "@/components/record/record-grade";
import RecordPlate from "@/components/record/record-plate";
import type { MaxRecord } from "@/server/prisma/record.db";
import NumberUtil from "@/utils/number.util";
import type { Chart, Song } from "@prisma/client";
import Link from "next/link";

type Props = {
  song: Song & { chart: (Chart & { record?: MaxRecord }) | null };
};

export default function RecordBox({ song }: Props) {
  return Boolean(song.chart?.record) ? (
    <Link
      href={`/records/${song.chart?.record?.seq}`}
      className={classnames(
        "flex size-14 sm:size-20 md:size-24 rounded-md bg-base-200 justify-center items-center flex-col",
        "hover:bg-gray-500 active:bg-gray-500 transition-colors px-1"
      )}
    >
      <span className="text-center text-[8px] sm:text-xs max-w-full text-ellipsis overflow-hidden whitespace-nowrap">
        {song.name}
      </span>
      {song.chart && song.chart.record && (
        <div className="w-full text-center text-[10px] sm:text-base flex flex-col justify-center items-center gap-1">
          <div className="flex flex-rowjustify-center items-center gap-1">
            {song.chart.record.score && (
              <span className="text-[10px] sm:text-xs">
                {NumberUtil.formatScore(song.chart.record.score)}
              </span>
            )}

            {song.chart.record && (
              <RecordGrade
                className="text-[8px] sm:text-xs"
                grade={song.chart.record.grade}
                isBreakOff={Boolean(song.chart.record.is_break_off)}
              />
            )}
          </div>

          {song.chart.record?.plate && (
            <RecordPlate
              className="text-[10px] sm:text-xs max-w-full px-1 text-ellipsis overflow-hidden whitespace-nowrap"
              plate={song.chart.record.plate}
            />
          )}
        </div>
      )}
    </Link>
  ) : (
    <div
      className={classnames(
        "flex size-14 sm:size-20 md:size-24 rounded-md bg-base-200 justify-center items-center flex-col",
        "hover:bg-gray-500 active:bg-gray-500 transition-colors px-1"
      )}
    >
      <span className="text-center text-[8px] sm:text-xs max-w-full text-ellipsis overflow-hidden whitespace-nowrap">
        {song.name}
      </span>
    </div>
  );
}
