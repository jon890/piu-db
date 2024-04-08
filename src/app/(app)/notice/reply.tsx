import TimeUtil from "@/server/utils/time-util";
import { Reply as ReplyEntity } from "@prisma/client";
import CreateNoticeReplyForm from "./(create-reply)/form";

type Props = {
  reply: ReplyEntity & { user: { nickname: string } };
};

export default function Reply({ reply }: Props) {
  return (
    <div className="chat chat-start">
      <div className="chat-image">
        <div className="size-10 rounded-full bg-green-500 flex items-center justify-center text-white dark:text-black">
          {reply.user.nickname.charAt(0)}
        </div>
      </div>
      <div className="chat-bubble flex flex-row gap-3 items-center">
        <span>{reply.contents}</span>
        <span className="text-xs">
          {TimeUtil.format(reply.updatedAt, "YYYY-MM-DD HH:mm:ss")}
        </span>
      </div>
    </div>
  );
}
