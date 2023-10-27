import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "../client/providers";
import classnames from "@/client/utils/classnames";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en">
      <body className={classnames(inter.className)}>
        <div
          id="app"
          className={classnames(
            "w-screen flex justify-center items-center min-h-screen"
          )}
        >
          <Providers>{children}</Providers>
        </div>
      </body>
    </html>
  );
}
