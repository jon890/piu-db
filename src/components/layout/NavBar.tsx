import { signOut } from "@/auth";
import MessageDB from "@/server/prisma/message.db";
import UserDB from "@/server/prisma/user.db";
import AuthUtil from "@/server/utils/auth-util";
import Bars3Icon from "@heroicons/react/24/solid/Bars3Icon";
import Link from "next/link";
import ServerToastHelper from "../server-toast-helper";
import NavBarMessages from "./navbar-messages";

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

        <NavBarMessages messages={messages} />
      </div>
    </nav>
  );
}
