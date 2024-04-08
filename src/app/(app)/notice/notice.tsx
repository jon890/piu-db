"use client";

import TimeUtil from "@/server/utils/time-util";
import { Notice, Reply as ReplyEntity } from "@prisma/client";
import { useState } from "react";
import CreateNoticeReplyForm from "./(create-reply)/form";
import getReplyAction from "./get-reply.action";
import Reply from "./reply";

type Props = {
  notice: Notice;
  defaultChecked?: boolean;
};

export default function Notice({ notice, defaultChecked }: Props) {
  const contents = notice.contents.replaceAll("\n", "<br />");

  const [replyVisible, setReplyVisible] = useState(false);
  const [replies, setReplies] = useState<
    (ReplyEntity & { user: { nickname: string } })[]
  >([]);

  async function fetchReply() {
    const res = await getReplyAction(notice.seq);
    setReplies(res);
  }

  async function handleOpenReply() {
    fetchReply();
    setReplyVisible((prev) => !prev);
  }

  async function onReplyAdded() {
    fetchReply();
  }

  return (
    <div className="collapse collapse-arrow bg-base-200">
      <input type="radio" name="my-accordion-2" defaultChecked />
      <div className="collapse-title text-xl font-medium">{notice.title}</div>
      <div className="collapse-content text-sm sm:text-base">
        <p dangerouslySetInnerHTML={{ __html: contents }} />
        <p className="text-end mt-3 text-xs">
          작성일자 : {TimeUtil.format(notice.updatedAt, "YYYY-MM-DD HH:mm:ss")}
        </p>

        <button
          className="btn-sm btn btn-primary justify-items-end"
          onClick={handleOpenReply}
        >
          댓글 열기
        </button>

        {replyVisible && (
          <div className="collapse bg-base-200 mt-3">
            <input
              type="radio"
              name="my-accordion-1"
              defaultChecked
              className="hidden"
            />
            <div className="collapse-content">
              {replies.length > 0 ? (
                replies.map((r) => <Reply key={r.seq} reply={r} />)
              ) : (
                <p className="text-xs">아직 댓글이 없습니다!</p>
              )}

              <CreateNoticeReplyForm notice={notice} onSuccess={onReplyAdded} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
