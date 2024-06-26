import ContentBox from "@/components/layout/content-box";
import Notice from "@/components/notice/notice";
import NoticeDB from "@/server/prisma/notice.db";
import UserDB from "@/server/prisma/user.db";
import AuthUtil from "@/server/utils/auth-util";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
  searchParams: {
    page?: number;
  };
};

export default async function NoticePage({
  searchParams: { page: _page },
}: Props) {
  const page = Number(_page);
  if (!_page && isNaN(page)) {
    redirect("/notice?page=1");
  }

  const userSeq = await AuthUtil.getUserSeqThrows();
  const user = await UserDB.getUserBySeq(userSeq);
  const notices = await NoticeDB.getNotices(page);

  return (
    <ContentBox title="공지사항">
      {user?.name === "bifos" && (
        <Link
          href="/notice/create"
          className="btn btn-primary text-xs sm:text-sm"
        >
          공지사항 작성
        </Link>
      )}

      {notices.map((notice) => (
        <Notice key={notice.seq} notice={notice} />
      ))}
    </ContentBox>
  );
}
