"use client";

import { useState } from "react";
import { ChevronDown, History } from "lucide-react";
import RichText from "@/lib/richText";
import type { ChangelogEntry } from "@/lib/types";

/**
 * 首頁「版本更新紀錄」區塊。
 * 每筆紀錄預設收合（僅顯示日期＋標題），雙擊標題列即可展開查看詳細內容，
 * 再雙擊一次收合。最新一筆預設展開，方便一進站就看到最近做了什麼調整。
 */
export default function ChangelogSection({ entries }: { entries: ChangelogEntry[] }) {
  const [expanded, setExpanded] = useState<Set<string>>(
    () => new Set(entries[0] ? [entries[0].id] : [])
  );

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (entries.length === 0) return null;

  return (
    <section className="bg-surface-muted py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-700 text-white shadow-soft">
              <History className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-extrabold text-primary-800 sm:text-2xl dark:text-primary-100">
              版本更新紀錄
            </h2>
          </div>
          <p className="text-xs text-foreground-muted">
            雙擊每一筆紀錄的標題列，可展開／收合詳細內容
          </p>
        </div>

        <p className="mt-3 max-w-3xl text-sm text-foreground-muted">
          記錄歷次請 Claude 協助更新本網站的內容，方便追蹤網站曾經做過哪些調整。
        </p>

        <ol className="mt-8 space-y-3">
          {entries.map((entry) => {
            const isOpen = expanded.has(entry.id);
            return (
              <li
                key={entry.id}
                className="overflow-hidden rounded-2xl border border-primary-900/8 bg-surface shadow-soft"
              >
                <div
                  role="button"
                  tabIndex={0}
                  aria-expanded={isOpen}
                  onDoubleClick={() => toggle(entry.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggle(entry.id);
                    }
                  }}
                  className="flex w-full cursor-pointer select-none items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-primary-50/60 dark:hover:bg-primary-800/30"
                >
                  <span className="shrink-0 rounded-full bg-primary-100 px-2.5 py-1 text-[11px] font-bold text-primary-700 dark:bg-primary-700/30 dark:text-primary-200">
                    {entry.date}
                  </span>
                  <span className="flex-1 min-w-0 text-sm font-bold text-foreground">
                    {entry.title}
                  </span>
                  <ChevronDown
                    aria-hidden
                    className={`h-4 w-4 shrink-0 text-foreground-muted transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {isOpen && entry.details.length > 0 && (
                  <div className="border-t border-primary-900/8 bg-surface-muted/60 px-5 py-4 dark:border-white/10">
                    <ul className="space-y-1.5">
                      {entry.details.map((d, i) => (
                        <li
                          key={i}
                          className="flex gap-2 text-xs leading-relaxed text-foreground-muted sm:text-sm"
                        >
                          <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary-400" />
                          <RichText as="span" text={d} />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
