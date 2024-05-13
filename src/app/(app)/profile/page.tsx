import CopyButton from "@/components/common/copy-btn";
import InputWithLabel from "@/components/common/input-with-label";
import ContentBox from "@/components/layout/content-box";
import UserDB from "@/server/prisma/user.db";
import AuthUtil from "@/server/utils/auth-util";
import { notFound } from "next/navigation";

export default async function ProfilePage() {
  const userSeq = await AuthUtil.getUserSeqThrows();
  const user = await UserDB.getUserBySeq(userSeq);

  if (!user) {
    return notFound();
  }

  return (
    <ContentBox title="프로필">
      <div className="flex flex-col justify-center items-center gap-4 w-full">
        <div className="size-20 rounded-full bg-green-500 flex items-center justify-center text-2xl text-white dark:text-black">
          {user.nickname.charAt(0)}
        </div>
        <InputWithLabel topLeft="아이디" value={user.name} disabled />
        <InputWithLabel topLeft="닉네임" value={user.nickname} disabled />
        <div className="flex flex-row justify-center items-end gap-4 max-w-md w-full">
          <InputWithLabel
            topLeft="UID"
            value={user?.uid}
            topRight="* 라이벌을 등록할 때 사용하는 코드입니다"
            topRightClass="text-red-500 font-semibold"
            disabled
          />
          <CopyButton text={user.uid ?? ""} />
        </div>
      </div>
    </ContentBox>
  );
}
