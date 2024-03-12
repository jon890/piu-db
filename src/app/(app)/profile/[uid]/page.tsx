import InputWithLabel from "@/components/InputWithLabel";
import UserDB from "@/server/prisma/user.db";
import { notFound } from "next/navigation";
import ApplyRivalForm from "./apply-rival.form";
import RivalDB from "@/server/prisma/rival.db";
import AuthUtil from "@/server/utils/auth-util";

type Props = {
  params: { uid: string };
};

export default async function ProfilePage(props: Props) {
  const uid = props.params.uid;
  const user = await UserDB.getUserByUID(uid);

  if (!user) {
    notFound();
  }

  const userSeq = await AuthUtil.getUserSeqThrows();
  const rival = await RivalDB.getMyRivalByUID(userSeq, uid);

  return (
    <div className="flex flex-col items-center justify-start w-full h-full gap-10 px-3 py-10">
      <h1 className="text-3xl font-semibold">프로필</h1>

      <div className="flex flex-col justify-center items-center gap-4 w-full">
        <div className="size-20 rounded-full bg-green-500 flex items-center justify-center text-2xl text-white dark:text-black">
          {user.nickname.charAt(0)}
        </div>

        <InputWithLabel topLeft="닉네임" value={user.nickname} disabled />

        <InputWithLabel
          topLeft="UID"
          value={user.uid}
          topRight="* 라이벌을 등록할 때 사용하는 코드입니다"
          topRightClass="text-red-500 font-semibold"
          disabled
        />

        {user.seq !== userSeq && (
          <ApplyRivalForm uid={user.uid} rival={rival} />
        )}
      </div>
    </div>
  );
}