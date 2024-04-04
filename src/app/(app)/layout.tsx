import Drawer from "@/components/layout/Drawer";

type Props = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: Props) {
  return <Drawer>{children}</Drawer>;
}
