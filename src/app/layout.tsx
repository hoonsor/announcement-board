import type { Metadata } from "next";
import Script from "next/script";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { THEME_STORAGE_KEY } from "@/lib/useThemeMode";
import "./globals.css";

// 在任何 React 程式碼執行 / hydrate 之前，依 localStorage 內的使用者偏好
// （或系統深色模式設定）先行設定 <html data-theme="...">，避免畫面先以
// 預設淺色閃一下、再切換成深色的「主題閃爍」問題。
const THEME_INIT_SCRIPT = `(function(){try{var m=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY
)});var resolved=(m==="light"||m==="dark")?m:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",resolved);}catch(e){}})();`;

export const metadata: Metadata = {
  title: {
    default: "115年全國工科技藝競賽 服務組公告網",
    template: "%s｜115年全國工科技藝競賽 服務組公告網",
  },
  description:
    "115年全國工科技藝競賽服務組公告網站：彙整各工作組、各競賽職種、協辦單位、外派聯絡人注意事項，以及競賽期間清運點互動地圖。",
  applicationName: "115年全國工科技藝競賽 服務組公告網",
};

export const viewport = {
  themeColor: "#163a47",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
