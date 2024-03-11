import { auth, signOut } from "@/auth";
import Link from "next/link";
import Bars3Icon from "@heroicons/react/24/solid/Bars3Icon";

export default async function NavBar() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return (
    <nav className="w-full navbar bg-base-100">
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

      <div className="flex-none">
        <div className="dropdown dropdown-end dropdown-bottom">
          <button tabIndex={0} className="btn btn-primary btn-ghost">
            <div className="size-8 rounded-full bg-green-500 flex items-center justify-center">
              {session.user.name?.charAt(0)}
            </div>

            <span>{session.user.name}</span>
          </button>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link href="#" className="justify-between">
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
      </div>
    </nav>
  );
}
