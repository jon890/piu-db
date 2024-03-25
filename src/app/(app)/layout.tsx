import Drawer from "@/components/layout/Drawer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Drawer>{children}</Drawer>;
}
