"use client";

import classnames from "@/utils/classnames";
import BellIcon from "@heroicons/react/24/solid/BellIcon";
import type { Message } from "@prisma/client";
import { readMessageAction } from "./read-message.action";

type Props = {
  messages: Message[];
};

export default function NavBarMessages({ messages }: Props) {
  const messageNotReadCount = messages.filter((it) => !it.isRead).length;

  async function handleMessageClick(messageSeq: number) {
    try {
      await readMessageAction(messageSeq);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="dropdown dropdown-end dropdown-bottom">
      <button tabIndex={1} className="btn btn-ghost btn-circle">
        {messageNotReadCount ? (
          <div className="indicator">
            <BellIcon className="size-6" />
            <span className="badge badge-xs badge-primary indicator-item">
              {messageNotReadCount}
            </span>
          </div>
        ) : (
          <BellIcon className="size-6" />
        )}
      </button>

      <ul
        tabIndex={1}
        className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
      >
        {messages.map((message) => (
          <li key={message.seq}>
            <button
              className={classnames(
                "btn justify-start h-auto",
                message.isRead ? "" : "btn-ghost"
              )}
              onClick={() => handleMessageClick(message.seq)}
            >
              <strong className="font-semibold text-sm">{message.title}</strong>
              {":"}
              <p className="font-normal text-xs">{message.content}</p>
            </button>
          </li>
        ))}
        <li>
          <button className="btn btn-outline btn-neutral text-sm h-auto min-h-fit">
            더보기
          </button>
        </li>
      </ul>
    </div>
  );
}
