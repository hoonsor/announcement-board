import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "工科技藝競賽公告網頁",
  description: "專案活動公告與檔案下載平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen antialiased`} suppressHydrationWarning>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
