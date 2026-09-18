"use client";

import { useEffect } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { resolveTheme, useThemeMode, type ThemeMode } from "@/lib/useThemeMode";

const OPTIONS: { mode: ThemeMode; label: string; icon: typeof Sun }[] = [
  { mode: "light", label: "淺色", icon: Sun },
  { mode: "dark", label: "深色", icon: Moon },
  { mode: "system", label: "跟隨系統", icon: Monitor },
];

export default function ThemeToggle() {
  const [mode, setMode] = useThemeMode();

  // 將目前偏好實際套用到 <html data-theme="...">；若選擇「跟隨系統」，
  // 另外監聽系統深色模式變化即時切換。這是操作 DOM 屬性的副作用，
  // 因此放在 useEffect 中，而非直接在渲染期間呼叫 setState。
  useEffect(() => {
    const apply = () => {
      document.documentElement.setAttribute("data-theme", resolveTheme(mode));
    };
    apply();

    if (mode !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [mode]);

  return (
    <div
      role="radiogroup"
      aria-label="切換佈景主題"
      className="no-print flex items-center gap-0.5 rounded-full border border-primary-900/10 bg-surface-muted p-0.5 dark:border-white/10"
    >
      {OPTIONS.map((opt) => {
        const Icon = opt.icon;
        const active = mode === opt.mode;
        return (
          <button
            key={opt.mode}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={opt.label}
            title={opt.label}
            onClick={() => setMode(opt.mode)}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-300 ease-out ${
              active
                ? "bg-primary-600 text-white shadow-soft dark:bg-accent-400 dark:text-primary-900"
                : "text-foreground-muted hover:bg-primary-100 hover:text-primary-700 dark:hover:bg-primary-700/40 dark:hover:text-accent-100"
            }`}
          >
            <Icon className="h-4 w-4" strokeWidth={2.25} />
          </button>
        );
      })}
    </div>
  );
}
