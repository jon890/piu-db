import ContentBox from "@/components/layout/content-box";
import CreateRoomForm from "./form";

export default function CreateRoomPage() {
  return (
    <ContentBox title="숙제방 생성">
      <CreateRoomForm />
      <p className="mt-10">✅ 초기 방장은 방 개설자로 셋팅됩니다.</p>
    </ContentBox>
  );
}
