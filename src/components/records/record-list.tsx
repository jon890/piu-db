import RecordBox from "@/components/records/record-box";

type Props = {
  songAndRecords: any[]; // getRecordsBy return type
  visibleClear?: boolean;
};

export default function RecordList({ songAndRecords, visibleClear }: Props) {
  return (
    <div className="flex flex-row justify-center items-center gap-1 flex-wrap">
      {songAndRecords.map((song) => (
        <RecordBox song={song} key={song.seq} visibleClear={visibleClear} />
      ))}
    </div>
  );
}
