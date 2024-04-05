import ContentBox from "@/components/layout/content-box";
import SelectLevel from "./selet-level";

type Props = {};

export default async function RecordPage({}: Props) {
  return (
    <ContentBox title="내 기록">
      <div className="flex flex-row justify-center items-center gap-3 flex-wrap">
        <SelectLevel />
      </div>
    </ContentBox>
  );
}
