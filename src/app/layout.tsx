import ToastContextProvier from "@/client/provider/toast-context.provider";
import classnames from "@/client/utils/classnames";
import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PIU DB",
  description: "Pump it up Record Management Safely",
  applicationName: "PIU DB",
  authors: { name: "bifos" },
  creator: "bifos",
  generator: "Next.js",
  keywords: "Pump it up, Pump it up Database",
  publisher: "Google",
};

type Props = {
  children: React.ReactNode;
  modal: React.ReactNode;
};

export default function RootLayout({ children, modal }: Props) {
  return (
    <html lang="ko">
      <body
        className={classnames(notoSansKR.className)}
        suppressHydrationWarning={true}
      >
        <ToastContextProvier>
          <main id="app">{children}</main>
          <div id="toast-container" />
          {modal}
        </ToastContextProvier>
      </body>
    </html>
  );
}
