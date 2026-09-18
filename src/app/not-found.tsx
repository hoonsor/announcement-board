import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-20 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 dark:bg-primary-800 dark:text-accent-300">
        <Compass className="h-8 w-8" />
      </span>
      <h1 className="mt-6 text-2xl font-extrabold text-primary-800 dark:text-primary-100">
        找不到這個頁面
      </h1>
      <p className="mt-3 text-sm text-foreground-muted">
        您要查看的公告內容可能已被移動或不存在，請回到首頁重新選擇公告項目。
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary-700 px-5 py-2.5 text-sm font-bold text-white shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-primary-600"
      >
        <ArrowLeft className="h-4 w-4" />
        回到首頁
      </Link>
    </div>
  );
}
