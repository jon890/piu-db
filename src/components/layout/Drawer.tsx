import Menu from "./Menu";
import NavBar from "./NavBar";

export default function Drawer({ children }: { children: React.ReactNode }) {
  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <NavBar />

        <section className="flex flex-row min-h-screen">
          <div className="hidden lg:block transition-all">
            <Menu />
          </div>
          {children}
        </section>
      </div>

      <div className="drawer-side !w-screen">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <Menu />
      </div>
    </div>
  );
}
