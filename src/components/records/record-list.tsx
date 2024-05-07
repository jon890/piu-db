import { LevelRecord } from "@/app/(app)/records/level/[level]/get-records";
import RecordBox from "@/components/records/record-box";

type Props = {
  levelRecords: LevelRecord[]; // getRecordsBy return type
  visibleClear?: boolean;
};

export default function RecordList({ levelRecords, visibleClear }: Props) {
  return (
    <div className="flex flex-row justify-center items-center gap-1 flex-wrap">
      {levelRecords.map((lr) => (
        <RecordBox
          key={lr.song.seq}
          song={lr.song}
          chart={lr.chart}
          record={lr.record}
          visibleClear={visibleClear}
        />
      ))}
    </div>
  );
}
