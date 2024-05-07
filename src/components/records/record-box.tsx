import RecordGrade from "@/components/record/record-grade";
import RecordPlate from "@/components/record/record-plate";
import type { MaxRecord } from "@/server/prisma/record.db";
import classnames from "@/utils/classnames";
import NumberUtil from "@/utils/number.util";
import type { Chart, Song } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type Props = {
  song: Song & { chart: (Chart & { record?: MaxRecord }) | null };
  visibleClear?: boolean;
};

export default function RecordBox({ song, visibleClear }: Props) {
  const isBreakOn =
    song?.chart?.record && !Boolean(song.chart?.record?.is_break_off);

  return (
    <Link
      href={song.chart?.record ? `/records/${song.chart?.record?.seq}` : "#"}
      className={classnames("card bg-base-200 size-16 sm:size-20 md:size-24", {
        "image-full": Boolean(song.imageUrl),
      })}
    >
      {/* Clear Line */}
      {visibleClear && isBreakOn && (
        <hr className="w-1 h-full bg-red-500 rotate-45 absolute right-1/2 z-10" />
      )}

      {song.imageUrl && (
        <figure className="relative">
          <Image
            src={song.imageUrl}
            alt={song.name}
            fill
            priority={false}
            sizes="(max-width: 640px) 14vw, (max-width:768px) 12.5vw, (max-width:1024px) 12.5vw"
          />
        </figure>
      )}

      <div className="card-body size-16 sm:size-20 md:size-24 p-0 items-center justify-center">
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
      </div>
    </Link>
  );
}
