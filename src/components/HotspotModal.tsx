"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarClock,
  ClipboardCheck,
  Phone,
  ShieldAlert,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import type { MapHotspot } from "@/lib/types";
import RichText from "@/lib/richText";

/** 各清運點的現場實拍照片（置於 public/images/hotspots/，檔名對應清運點代號） */
const HOTSPOT_PHOTOS: Record<string, string> = {
  "pe-flowerbed": "/images/hotspots/pe-flowerbed.png",
  "courtyard-pond-1f": "/images/hotspots/courtyard-pond-1f.jpg",
  "courtyard-pond-3f": "/images/hotspots/courtyard-pond-3f.png",
  "leqiun-hall": "/images/hotspots/leqiun-hall.jpg",
  "gengdu-hall": "/images/hotspots/gengdu-hall.jpg",
  "lexue-hall": "/images/hotspots/lexue-hall.png",
};

const ACCENT: Record<
  MapHotspot["accent"],
  { from: string; to: string; ring: string; chip: string }
> = {
  teal: {
    from: "#2f6577",
    to: "#163a47",
    ring: "#7ea9b8",
    chip: "bg-primary-100 text-primary-700",
  },
  amber: {
    from: "#dfa136",
    to: "#a06a20",
    ring: "#edbb58",
    chip: "bg-accent-100 text-accent-700",
  },
  rose: {
    from: "#cf4038",
    to: "#8f2a24",
    ring: "#e2665f",
    chip: "bg-danger-400/15 text-danger-600",
  },
};

/** 以插畫方式呈現該清運點示意圖（非現場實拍照片，供版面與版型示意使用） */
function HotspotIllustration({ hotspot }: { hotspot: MapHotspot }) {
  const a = ACCENT[hotspot.accent];
  return (
    <svg viewBox="0 0 400 220" className="h-full w-full">
      <defs>
        <linearGradient id={`sky-${hotspot.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={a.from} />
          <stop offset="100%" stopColor={a.to} />
        </linearGradient>
      </defs>
      <rect width="400" height="220" fill={`url(#sky-${hotspot.id})`} />
      {/* decorative circles */}
      <circle cx="40" cy="34" r="60" fill="white" opacity="0.06" />
      <circle cx="360" cy="190" r="90" fill="white" opacity="0.07" />
      <circle cx="330" cy="40" r="26" fill="white" opacity="0.1" />

      {/* ground */}
      <path d="M0 178 Q 200 150 400 178 L400 220 L0 220 Z" fill="rgba(0,0,0,0.18)" />

      {/* sign post */}
      <rect x="192" y="120" width="8" height="60" rx="2" fill="#f4efe4" opacity="0.85" />

      {/* sign board */}
      <g transform="translate(120, 60)">
        <rect width="160" height="66" rx="10" fill="#fdfbf6" opacity="0.96" />
        <rect width="160" height="66" rx="10" fill="none" stroke="rgba(16,30,40,0.15)" />
        <foreignObject x="8" y="6" width="144" height="54">
          <div className="flex h-full w-full flex-col items-center justify-center text-center leading-tight">
            <span className="text-[11px] font-bold text-primary-800">
              清運點標示牌
            </span>
            <span className="mt-1 line-clamp-2 text-[10px] font-medium text-primary-600">
              {hotspot.name}
            </span>
          </div>
        </foreignObject>
      </g>

      {/* trash bins */}
      <g transform="translate(70, 150)">
        <rect x="0" y="10" width="34" height="40" rx="5" fill="#f2f5f2" opacity="0.92" />
        <rect x="-3" y="4" width="40" height="10" rx="4" fill="#dfe6df" />
        <Recycle x={17} />
      </g>
      <g transform="translate(280, 150)">
        <rect x="0" y="10" width="34" height="40" rx="5" fill="#2c3a32" opacity="0.85" />
        <rect x="-3" y="4" width="40" height="10" rx="4" fill="#1e2a24" />
      </g>

      {/* small people icon for scale */}
      <g transform="translate(220, 158)" opacity="0.9">
        <circle cx="0" cy="0" r="7" fill="#fdfbf6" />
        <path d="M -9 34 C -9 14, 9 14, 9 34 Z" fill="#fdfbf6" />
      </g>
    </svg>
  );
}

function Recycle({ x }: { x: number }) {
  return (
    <text
      x={x}
      y={30}
      textAnchor="middle"
      fontSize="14"
      fill="#3f7a52"
      fontWeight="700"
    >
      ♻
    </text>
  );
}

export default function HotspotModal({
  hotspot,
  onClose,
}: {
  hotspot: MapHotspot | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!hotspot) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [hotspot, onClose]);

  return (
    <AnimatePresence>
      {hotspot && (
        <motion.div
          className="no-print fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <button
            aria-label="關閉視窗"
            onClick={onClose}
            className="absolute inset-0 bg-primary-900/60 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={hotspot.name}
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="relative flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-surface shadow-soft-lg"
          >
            <div className="relative shrink-0">
              {HOTSPOT_PHOTOS[hotspot.id] ? (
                // 完整呈現整張照片（不裁切）：以該清運點的主題色作為信封底色，
                // 讓非填滿整個版面比例的照片仍有一致、美觀的留白背景。
                <div
                  className="flex max-h-[46vh] items-center justify-center overflow-hidden sm:max-h-[420px]"
                  style={{
                    background: `linear-gradient(135deg, ${ACCENT[hotspot.accent].from}, ${ACCENT[hotspot.accent].to})`,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={HOTSPOT_PHOTOS[hotspot.id]}
                    alt={`${hotspot.name}現場實拍照片`}
                    className="max-h-[46vh] w-auto max-w-full object-contain sm:max-h-[420px]"
                  />
                </div>
              ) : (
                <div className="h-44 sm:h-52">
                  <HotspotIllustration hotspot={hotspot} />
                </div>
              )}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent"
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="關閉"
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur transition-colors hover:bg-black/45"
              >
                <X className="h-5 w-5" />
              </button>
              {hotspot.zoneLabel && (
                <div className="absolute bottom-3 left-4 right-4">
                  <span className="inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-primary-800 shadow-soft">
                    {hotspot.zoneLabel}
                  </span>
                </div>
              )}
            </div>

            <div className="overflow-y-auto p-5 sm:p-6">
              <h3 className="text-lg font-bold text-primary-800 dark:text-primary-100">
                {hotspot.name}
              </h3>

              <dl className="mt-4 space-y-3.5 text-sm">
                <div className="flex items-start gap-3">
                  <CalendarClock className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary-500" />
                  <div>
                    <dt className="font-semibold text-foreground">清運時段</dt>
                    <dd className="text-foreground-muted">{hotspot.schedule}</dd>
                  </div>
                </div>
                {hotspot.method && (
                  <div className="flex items-start gap-3">
                    <ClipboardCheck className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary-500" />
                    <div>
                      <dt className="font-semibold text-foreground">處理方式</dt>
                      <dd className="text-foreground-muted">{hotspot.method}</dd>
                    </div>
                  </div>
                )}
                {hotspot.owner && (
                  <div className="flex items-start gap-3">
                    <UserRound className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary-500" />
                    <div>
                      <dt className="font-semibold text-foreground">負責單位</dt>
                      <dd className="text-foreground-muted">{hotspot.owner}</dd>
                    </div>
                  </div>
                )}
                {hotspot.contactPhone && (
                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-4.5 w-4.5 shrink-0 text-primary-500" />
                    <div>
                      <dt className="font-semibold text-foreground">聯絡電話</dt>
                      <dd className="text-foreground-muted">{hotspot.contactPhone}</dd>
                    </div>
                  </div>
                )}
              </dl>

              <div className="mt-5 rounded-xl bg-surface-muted p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <ShieldAlert className="h-4 w-4 text-accent-500" />
                  注意事項
                </div>
                <ul className="mt-2 space-y-1.5">
                  {hotspot.notes.map((n, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs leading-relaxed text-foreground-muted sm:text-sm"
                    >
                      <Trash2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-400" />
                      <RichText text={n} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
