import Drawer from "@/components/Drawer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Drawer>{children}</Drawer>
    </>
  );
}
