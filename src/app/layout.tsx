import classnames from "@/client/utils/classnames";
import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PIU DB",
  description: "Pump it up Record Management Safely",
  applicationName: "PIU DB",
  authors: { name: "bifos", url: "https://github.com/jon890" },
  creator: "bifos",
  generator: "Next.js",
  keywords: "Pump it up, Pump it up Database",
  publisher: "Vercel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={classnames(notoSansKR.className)}>
        <main id="app" className={classnames("w-screen min-h-screen")}>
          {children}
        </main>
      </body>
    </html>
  );
}
