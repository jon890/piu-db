import { signOut } from "@/auth";
import MessageDB from "@/server/prisma/message.db";
import UserDB from "@/server/prisma/user.db";
import AuthUtil from "@/server/utils/auth-util";
import Bars3Icon from "@heroicons/react/24/solid/Bars3Icon";
import BellIcon from "@heroicons/react/24/solid/BellIcon";
import Link from "next/link";
import ServerToastHelper from "../server-toast-helper";
import classnames from "@/utils/classnames";

export default async function NavBar() {
  const userSeq = await AuthUtil.getUserSeqThrows();
  const user = await UserDB.getUserBySeq(userSeq);

  if (!user) {
    return (
      <ServerToastHelper
        toast={{ message: "게정 정보를 찾지 못했습니다", type: "error" }}
        action="SIGN_OUT"
      />
    );
  }

  const messages = await MessageDB.getMessagesByUser(userSeq);
  const messageNotReadCount = messages.filter((it) => !it.isRead).length;

  return (
    <nav className="w-full navbar bg-base-100 fixed z-50">
      <div className="flex-none lg:hidden">
        <label
          htmlFor="my-drawer-3"
          aria-label="open sidebar"
          className="btn btn-square btn-ghost"
        >
          <Bars3Icon className="size-6" />
        </label>
      </div>

      <div className="flex-1">
        <Link href="/rooms" className="btn btn-ghost normal-case text-xl">
          PIU DB
        </Link>
      </div>

      <div className="navbar-end">
        <div className="dropdown dropdown-end dropdown-bottom">
          <button tabIndex={0} className="btn btn-primary btn-ghost">
            <div className="size-8 rounded-full bg-green-500 flex items-center justify-center text-white dark:text-black">
              {user.nickname.charAt(0)}
            </div>

            <span>{user.nickname}</span>
          </button>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link href="/profile" className="justify-between">
                프로필
                <span className="badge">New</span>
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <button>로그아웃</button>
              </form>
            </li>
          </ul>
        </div>

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
                >
                  <strong className="font-semibold text-sm">
                    {message.title}
                  </strong>
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
      </div>
    </nav>
  );
}
