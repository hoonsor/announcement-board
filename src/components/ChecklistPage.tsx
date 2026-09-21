"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Mail,
  Phone,
  Printer,
  RotateCcw,
  User,
} from "lucide-react";
import type { ChecklistPageData } from "@/lib/types";
import { useLocalStorageJSON } from "@/lib/useLocalStorageJSON";
import { DEPLOY_TIMESTAMP } from "@/lib/deployTime";
import RichText from "@/lib/richText";

export default function ChecklistPage({ data }: { data: ChecklistPageData }) {
  const allIds = useMemo(
    () => data.sections.flatMap((s) => s.items.map((i) => i.id)),
    [data]
  );
  const storageKey = `checklist:${data.slug}`;
  const [checked, setChecked, clearChecked] = useLocalStorageJSON<
    Record<string, boolean>
  >(storageKey, {});

  const toggle = (id: string) =>
    setChecked({ ...checked, [id]: !checked[id] });
  const reset = () => clearChecked();

  const checkedCount = allIds.filter((id) => checked[id]).length;
  const total = allIds.length;
  const percent = total === 0 ? 0 : Math.round((checkedCount / total) * 100);

  // 僅用於「列印時」抬頭顯示的日期，屬於自然隨渲染時間而變動的內容，
  // 以 suppressHydrationWarning 標示，避免與 React 官方建議牴觸的作法。
  const printDate = new Date().toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="print-area">
      {/* ---------- Hero / header ---------- */}
      <section className="no-print relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, white 0, transparent 45%), radial-gradient(circle at 85% 75%, white 0, transparent 40%)",
          }}
        />
        <div className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wider text-accent-200 backdrop-blur">
                公告 {data.badge}
              </span>
              <h1 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
                {data.title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-primary-100 sm:text-base">
                <RichText text={data.subtitle} />
              </p>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              title="列印本頁檢核表"
              aria-label="列印本頁檢核表"
              className="group flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white shadow-soft backdrop-blur transition-all hover:bg-accent-400 hover:text-primary-900 sm:h-12 sm:w-12"
            >
              <Printer className="h-5 w-5 transition-transform group-hover:scale-110 sm:h-5.5 sm:w-5.5" />
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-primary-100">
            <span>最後更新：{DEPLOY_TIMESTAMP}</span>
            <span className="inline-flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {data.contact.unit}
              {data.contact.person ? `．${data.contact.person}` : ""}
            </span>
            {data.contact.phone && (
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-4 w-4" />
                {data.contact.phone}
              </span>
            )}
            {data.contact.email && (
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-4 w-4" />
                {data.contact.email}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ---------- Print-only header ---------- */}
      <div className="print-only px-2 py-2">
        <h1 className="text-xl font-bold">{data.title}</h1>
        <p className="mt-1 text-sm">{data.subtitle}</p>
        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs">
          <span>公告編號：{data.badge}</span>
          <span>最後更新：{DEPLOY_TIMESTAMP}</span>
          <span>
            承辦：{data.contact.unit}
            {data.contact.person ? `／${data.contact.person}` : ""}
          </span>
          {data.contact.phone && <span>電話：{data.contact.phone}</span>}
          <span suppressHydrationWarning>列印日期：{printDate}</span>
        </div>
        <hr className="mt-3 border-black/30" />
      </div>

      {/* ---------- Progress bar ---------- */}
      <div className="no-print sticky top-(--header-height) z-30 border-b border-primary-900/10 bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs font-medium text-foreground-muted">
              <span>
                自我檢核進度：{checkedCount} / {total} 項
              </span>
              <span>{percent}%</span>
            </div>
            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-surface-muted">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary-400 to-accent-400"
                initial={false}
                animate={{ width: `${percent}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={reset}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-primary-900/10 px-3 py-2 text-xs font-medium text-foreground-muted transition-colors hover:border-danger-400 hover:text-danger-500"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            清除勾選
          </button>
        </div>
      </div>

      {/* ---------- Sections ---------- */}
      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {data.sections.map((section, sIdx) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: Math.min(sIdx, 5) * 0.06 }}
              className="rounded-2xl border border-primary-900/8 bg-surface p-5 shadow-soft sm:p-7 break-inside-avoid print:opacity-100"
            >
              <h2 className="text-base font-bold text-primary-800 sm:text-lg dark:text-primary-100">
                {section.title}
              </h2>
              {section.description && (
                <p className="mt-1 text-sm text-foreground-muted">
                  <RichText text={section.description} />
                </p>
              )}

              <ul className="mt-4 space-y-1">
                {section.items.map((item) => {
                  const isChecked = !!checked[item.id];
                  return (
                    <li key={item.id}>
                      <label className="group flex cursor-pointer items-start gap-3 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-surface-muted print:px-0 print:py-1">
                        <span className="no-print relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggle(item.id)}
                            className="peer absolute h-5 w-5 cursor-pointer opacity-0"
                          />
                          <Circle
                            className="absolute h-5 w-5 text-primary-900/20 transition-opacity peer-checked:opacity-0 group-hover:text-primary-400"
                            strokeWidth={2}
                          />
                          <CheckCircle2
                            className="absolute h-5 w-5 scale-75 text-primary-600 opacity-0 transition-all peer-checked:scale-100 peer-checked:opacity-100 dark:text-accent-400"
                            strokeWidth={2}
                          />
                        </span>
                        <span
                          className={`print-only-inline mt-px h-3.5 w-3.5 shrink-0 items-center justify-center rounded-[3px] border border-black/60 ${
                            isChecked ? "bg-black" : ""
                          }`}
                        >
                          {isChecked && (
                            <svg
                              viewBox="0 0 16 16"
                              className="h-2.5 w-2.5"
                              fill="none"
                              stroke="white"
                              strokeWidth={2.5}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M3 8.5 L6.5 12 L13 4" />
                            </svg>
                          )}
                        </span>
                        <span
                          className={`text-sm leading-relaxed sm:text-[0.95rem] ${
                            isChecked
                              ? "text-foreground-muted line-through decoration-primary-300 print:text-black print:no-underline"
                              : "text-foreground print:text-black"
                          }`}
                        >
                          <RichText text={item.text} />
                          {item.note && (
                            <span className="mt-0.5 block text-xs text-foreground-muted">
                              <RichText text={item.note} />
                            </span>
                          )}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="print-only mt-8 flex justify-end gap-10 pr-4 text-sm">
          <span>檢核人簽名：＿＿＿＿＿＿＿＿＿＿</span>
          <span>日期：＿＿＿＿＿＿＿＿＿＿</span>
        </div>

        <p className="no-print mt-8 text-center text-xs text-foreground-muted">
          勾選狀態僅儲存於您目前使用的瀏覽器，供自我檢核參考；如需留存紀錄，建議點擊右上角
          <Printer className="mx-1 inline h-3.5 w-3.5 align-text-bottom" />
          圖示列印本頁作為書面表單。
        </p>
      </section>
    </div>
  );
}
