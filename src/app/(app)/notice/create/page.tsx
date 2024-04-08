import ContentBox from "@/components/layout/content-box";
import CreateRoomForm from "./form";

/**
 * 숙제방 생성 페이지
 * @returns
 */
export default function CreateNoticePage() {
  return (
    <ContentBox title="공지사항 작성">
      <CreateRoomForm />
    </ContentBox>
  );
}
