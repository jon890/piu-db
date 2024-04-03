import ArrowLeftIcon from "@heroicons/react/24/solid/ArrowLeftIcon";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full">
      <section className="w-full min-h-screen flex justify-center flex-col items-center p-10">
        {children}
      </section>
    </main>
  );
}
