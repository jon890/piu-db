import Link from "next/link";
import NavBar from "./NavBar";

export default function Drawer({ children }: { children: React.ReactNode }) {
  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <NavBar />
        {children}
      </div>

      <div className="drawer-side">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200">
          <li>
            <Link href="#">Sidebar Item 1</Link>
          </li>
          <li>
            <Link href="#">Sidebar Item 2</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
