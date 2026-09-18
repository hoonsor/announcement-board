"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import type { MapHotspot } from "@/lib/types";
import { mapHotspots } from "@/data/mapHotspots";
import HotspotModal from "@/components/HotspotModal";

interface Building {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sublabel?: string;
  tone: "blue" | "green" | "amber" | "violet" | "slate" | "rose";
  fontSize?: number;
}

const TONE_FILL: Record<Building["tone"], string> = {
  blue: "url(#tone-blue)",
  green: "url(#tone-green)",
  amber: "url(#tone-amber)",
  violet: "url(#tone-violet)",
  slate: "url(#tone-slate)",
  rose: "url(#tone-rose)",
};

const TONE_TEXT: Record<Building["tone"], string> = {
  blue: "#1b3a52",
  green: "#1f4030",
  amber: "#5a3c12",
  violet: "#3a2a55",
  slate: "#33404a",
  rose: "#5a2230",
};

const buildings: Building[] = [
  // 上排
  { x: 40, y: 40, w: 260, h: 100, label: "電子電機大樓", tone: "amber" },
  { x: 320, y: 40, w: 260, h: 100, label: "北區技術教學中心", tone: "amber" },
  { x: 600, y: 40, w: 175, h: 100, label: "畜牧場", tone: "green" },
  { x: 795, y: 40, w: 165, h: 100, label: "教職員宿舍", tone: "slate" },

  // 左側科館
  { x: 40, y: 160, w: 200, h: 65, label: "舊工機科", tone: "blue" },
  { x: 40, y: 235, w: 200, h: 65, label: "教業館", tone: "slate" },
  { x: 40, y: 330, w: 200, h: 60, label: "汽車科", tone: "blue" },
  { x: 40, y: 400, w: 200, h: 60, label: "動力機械科", tone: "green" },
  { x: 40, y: 470, w: 200, h: 70, label: "機械科", tone: "green" },
  { x: 40, y: 550, w: 95, h: 130, label: "模具科", tone: "green", fontSize: 15 },
  { x: 145, y: 550, w: 95, h: 130, label: "化工科", tone: "green", fontSize: 15 },

  // 右側科館
  { x: 760, y: 160, w: 200, h: 70, label: "生機科", tone: "green" },
  { x: 760, y: 240, w: 200, h: 95, label: "曳引車教練場", tone: "slate" },
  { x: 760, y: 345, w: 200, h: 65, label: "農經科", tone: "violet" },

  // 中央運動場周邊
  { x: 260, y: 480, w: 250, h: 55, label: "體育二乙（含水溝）", tone: "rose", fontSize: 14 },
  { x: 520, y: 480, w: 220, h: 55, label: "體育二甲（含水溝花圃）", tone: "rose", fontSize: 13 },
  { x: 760, y: 420, w: 200, h: 80, label: "排球場（農經三）", tone: "rose", fontSize: 14 },

  // 中庭與生活機能
  { x: 650, y: 545, w: 100, h: 150, label: "學生活動中心", tone: "slate", fontSize: 14 },
  { x: 760, y: 545, w: 200, h: 145, label: "農場", tone: "green" },
  { x: 760, y: 700, w: 200, h: 130, label: "農場", tone: "green" },

  // 下排左側
  { x: 40, y: 690, w: 180, h: 110, label: "樂群堂", sublabel: "體育一甲", tone: "blue" },
  { x: 40, y: 810, w: 180, h: 60, label: "圖書館", tone: "amber" },
  { x: 40, y: 880, w: 85, h: 60, label: "木工室", tone: "slate", fontSize: 13 },
  { x: 135, y: 880, w: 85, h: 60, label: "宿舍", tone: "slate", fontSize: 13 },

  // 下排中央
  { x: 260, y: 800, w: 150, h: 90, label: "維也納森林", tone: "green", fontSize: 14 },
  { x: 430, y: 800, w: 150, h: 90, label: "名仕林", tone: "green" },
  { x: 260, y: 900, w: 150, h: 60, label: "學生停車場", tone: "slate", fontSize: 13 },
  { x: 430, y: 900, w: 150, h: 60, label: "醫務室", tone: "rose" },

  // 下排右側
  { x: 610, y: 830, w: 130, h: 130, label: "樂學樓", sublabel: "生機二．電子二甲", tone: "violet", fontSize: 14 },
  { x: 760, y: 850, w: 200, h: 60, label: "耕讀館", tone: "amber" },
  { x: 760, y: 920, w: 95, h: 90, label: "育賢樓", tone: "amber", fontSize: 13 },
  { x: 865, y: 920, w: 95, h: 90, label: "電腦教室", tone: "blue", fontSize: 12 },
];

export default function CampusMap() {
  const [active, setActive] = useState<MapHotspot | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-3xl border border-primary-900/10 bg-[#eef2ee] shadow-soft-lg">
        <svg
          viewBox="0 0 1000 1050"
          role="img"
          aria-label="校內清運點互動地圖"
          className="h-auto w-full select-none"
        >
          <defs>
            <linearGradient id="tone-blue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#cfe1ea" />
              <stop offset="100%" stopColor="#aecbdb" />
            </linearGradient>
            <linearGradient id="tone-green" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d6e8d3" />
              <stop offset="100%" stopColor="#b6d4b0" />
            </linearGradient>
            <linearGradient id="tone-amber" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f6e6bf" />
              <stop offset="100%" stopColor="#eccf8d" />
            </linearGradient>
            <linearGradient id="tone-violet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e1d9ef" />
              <stop offset="100%" stopColor="#c7b8e0" />
            </linearGradient>
            <linearGradient id="tone-slate" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e3e8ea" />
              <stop offset="100%" stopColor="#c5ced2" />
            </linearGradient>
            <linearGradient id="tone-rose" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f3d9d6" />
              <stop offset="100%" stopColor="#e5b7b3" />
            </linearGradient>
            <linearGradient id="track-fill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#c8927f" />
              <stop offset="100%" stopColor="#b87c68" />
            </linearGradient>
            <linearGradient id="field-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3f7a52" />
              <stop offset="100%" stopColor="#2f6140" />
            </linearGradient>
            <linearGradient id="pond-fill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8fc2d9" />
              <stop offset="100%" stopColor="#5f9fbe" />
            </linearGradient>
            <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow
                dx="0"
                dy="3"
                stdDeviation="4"
                floodColor="#10222c"
                floodOpacity="0.18"
              />
            </filter>
          </defs>

          {/* background */}
          <rect x="0" y="0" width="1000" height="1050" fill="#eef2ee" />

          {/* buildings */}
          {buildings.map((b, i) => (
            <g key={i} filter="url(#soft-shadow)">
              <rect
                x={b.x}
                y={b.y}
                width={b.w}
                height={b.h}
                rx={12}
                fill={TONE_FILL[b.tone]}
                stroke="rgba(16,30,40,0.12)"
              />
              <foreignObject x={b.x + 4} y={b.y + 4} width={b.w - 8} height={b.h - 8}>
                <div
                  className="flex h-full w-full flex-col items-center justify-center text-center leading-tight"
                  style={{ color: TONE_TEXT[b.tone] }}
                >
                  <span
                    className="font-bold"
                    style={{ fontSize: b.fontSize ?? 16 }}
                  >
                    {b.label}
                  </span>
                  {b.sublabel && (
                    <span className="mt-0.5 text-[11px] font-medium opacity-80">
                      {b.sublabel}
                    </span>
                  )}
                </div>
              </foreignObject>
            </g>
          ))}

          {/* running track */}
          <g filter="url(#soft-shadow)">
            <rect
              x="260"
              y="150"
              width="480"
              height="320"
              rx={160}
              fill="url(#track-fill)"
            />
            <rect
              x="300"
              y="185"
              width="400"
              height="250"
              rx={125}
              fill="url(#field-fill)"
            />
          </g>
          <rect x="420" y="130" width="160" height="34" rx={8} fill="#f4efe4" stroke="rgba(16,30,40,0.15)" />
          <foreignObject x="420" y="130" width="160" height="34">
            <div className="flex h-full items-center justify-center text-[13px] font-bold text-primary-800">
              司令台
            </div>
          </foreignObject>
          <line x1="500" y1="185" x2="500" y2="435" stroke="rgba(255,255,255,0.55)" strokeDasharray="6 6" strokeWidth={2} />
          <foreignObject x="330" y="290" width="150" height="40">
            <div className="flex h-full items-center justify-center text-[13px] font-semibold text-white/90">
              體育三乙
            </div>
          </foreignObject>
          <foreignObject x="520" y="290" width="150" height="40">
            <div className="flex h-full items-center justify-center text-[13px] font-semibold text-white/90">
              體育三甲
            </div>
          </foreignObject>

          {/* pond */}
          <path
            d="M 400 640 C 370 610, 420 590, 460 610 C 500 585, 560 600, 555 635 C 600 640, 605 690, 560 700 C 540 725, 480 715, 465 695 C 420 705, 380 680, 400 640 Z"
            fill="url(#pond-fill)"
            filter="url(#soft-shadow)"
          />
          <foreignObject x="420" y="645" width="150" height="40">
            <div className="flex h-full items-center justify-center text-[13px] font-semibold text-white drop-shadow">
              中庭水池
            </div>
          </foreignObject>

          {/* legend backdrop chip for zone context */}
          <foreignObject x="20" y="1000" width="500" height="40">
            <div className="text-[12px] text-primary-700/70">
              ＊本圖為示意重繪，非精確比例，僅供活動動線與清運點位置參考
            </div>
          </foreignObject>

          {/* ---------- hotspots ---------- */}
          {mapHotspots.map((h) => {
            const isHovered = hovered === h.id;
            return (
              <g
                key={h.id}
                transform={`translate(${h.x}, ${h.y})`}
                className="cursor-pointer"
                onMouseEnter={() => setHovered(h.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setActive(h)}
                role="button"
                tabIndex={0}
                aria-label={`${h.name}，點選查看詳細資訊`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setActive(h);
                }}
              >
                {/* breathing outer ring */}
                <motion.circle
                  r={14}
                  fill="none"
                  stroke="#cf4038"
                  strokeWidth={2.5}
                  initial={{ opacity: 0.55, scale: 1 }}
                  animate={{ opacity: [0.55, 0, 0.55], scale: [1, 1.9, 1] }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
                {/* main marker */}
                <motion.g
                  animate={{ scale: isHovered ? 1.45 : 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <circle r={13} fill="#cf4038" stroke="#fff" strokeWidth={2.5} />
                  <circle r={13} fill="transparent" />
                </motion.g>

                {/* hover tooltip */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.g
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                    >
                      <foreignObject x={-90} y={-58} width={180} height={34}>
                        <div className="mx-auto flex w-fit max-w-[176px] items-center justify-center rounded-lg bg-primary-900/95 px-2.5 py-1.5 text-center text-[11px] font-medium text-white shadow-lg">
                          {h.name}
                        </div>
                      </foreignObject>
                    </motion.g>
                  )}
                </AnimatePresence>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-foreground-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger-400 opacity-60" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-danger-500" />
          </span>
          紅圈：競賽期間清運點（滑鼠移入放大／點按查看詳細資訊）
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Trash2 className="h-3.5 w-3.5" />
          共 {mapHotspots.length} 個清運點
        </span>
      </div>

      <HotspotModal hotspot={active} onClose={() => setActive(null)} />
    </div>
  );
}
