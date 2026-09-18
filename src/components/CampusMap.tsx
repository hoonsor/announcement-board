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

// 座標／尺寸依「1150918-地圖」（國立北科附工 AED 分配圖）原始影像像素比例重繪，
// 力求還原各大樓／科館的相對位置、大小與名稱；版面本身不追求工整對齊，以還原度為優先。
const buildings: Building[] = [
  // ---------- 上排 ----------
  { x: 120, y: 145, w: 275, h: 115, label: "舊工機科", tone: "blue", fontSize: 24 },
  { x: 120, y: 290, w: 275, h: 75, label: "敬業館", tone: "blue", fontSize: 24 },
  { x: 485, y: 125, w: 275, h: 190, label: "電子電機大樓", tone: "green", fontSize: 24 },
  { x: 814, y: 125, w: 275, h: 220, label: "北區技術教學中心", tone: "green", fontSize: 22 },
  { x: 1114, y: 160, w: 240, h: 190, label: "畜牧場", tone: "slate", fontSize: 24 },
  { x: 1358, y: 160, w: 110, h: 68, label: "風雨排球場", tone: "slate", fontSize: 13 },
  { x: 1358, y: 230, w: 110, h: 68, label: "風雨籃球場", tone: "slate", fontSize: 13 },
  { x: 1470, y: 125, w: 100, h: 95, label: "桃園學苑", tone: "green", fontSize: 20 },
  { x: 1470, y: 222, w: 100, h: 92, label: "校外會", sublabel: "籃球場", tone: "green", fontSize: 20 },
  { x: 1470, y: 316, w: 160, h: 68, label: "教職員宿舍", tone: "slate", fontSize: 18 },

  // ---------- 左側科館 ----------
  { x: 115, y: 408, w: 260, h: 80, label: "汽車科", tone: "blue", fontSize: 24 },
  { x: 115, y: 595, w: 260, h: 72, label: "動力機械科", tone: "blue", fontSize: 22 },
  { x: 140, y: 724, w: 235, h: 92, label: "機械科", tone: "blue", fontSize: 24 },
  { x: 60, y: 825, w: 80, h: 145, label: "模具科", tone: "green", fontSize: 20 },
  { x: 200, y: 825, w: 205, h: 145, label: "化工科", tone: "green", fontSize: 24 },

  // ---------- 田徑場右側 ----------
  { x: 1212, y: 382, w: 70, h: 70, label: "香牧場", tone: "green", fontSize: 15 },
  { x: 1282, y: 382, w: 82, h: 70, label: "畜牧館", tone: "blue", fontSize: 17 },
  { x: 1304, y: 462, w: 232, h: 105, label: "生機科", tone: "blue", fontSize: 24 },
  { x: 1536, y: 462, w: 93, h: 275, label: "曳引車教練場", tone: "slate", fontSize: 16 },
  { x: 1304, y: 687, w: 232, h: 70, label: "農經科", tone: "green", fontSize: 22 },

  // ---------- 中庭：學生活動中心／籃球場／農場 ----------
  { x: 510, y: 1045, w: 105, h: 495, label: "化工一乙／機械一乙", sublabel: "樓梯．走廊", tone: "amber", fontSize: 15 },
  { x: 883, y: 1045, w: 157, h: 280, label: "學生活動中心", tone: "amber", fontSize: 22 },
  { x: 1100, y: 1035, w: 80, h: 360, label: "籃球場", tone: "slate", fontSize: 20 },
  { x: 1225, y: 1035, w: 305, h: 265, label: "農場", tone: "green", fontSize: 28 },
  { x: 1515, y: 1035, w: 80, h: 265, label: "園藝科", tone: "blue", fontSize: 18 },
  { x: 1225, y: 1330, w: 245, h: 290, label: "農場", tone: "green", fontSize: 28 },
  { x: 905, y: 1355, w: 80, h: 185, label: "動力二", sublabel: "右側樓梯．走廊", tone: "amber", fontSize: 14 },
  { x: 460, y: 1545, w: 525, h: 105, label: "健康中心", tone: "amber", fontSize: 24 },

  // ---------- 下排左側：樂群堂 ----------
  { x: 46, y: 1258, w: 214, h: 320, label: "樂群堂", sublabel: "體育一甲", tone: "amber", fontSize: 26 },
  { x: 35, y: 1670, w: 80, h: 140, label: "木工室", tone: "slate", fontSize: 16 },
  { x: 150, y: 1670, w: 110, h: 210, label: "圖書館", tone: "amber", fontSize: 22 },
  { x: 125, y: 1910, w: 110, h: 100, label: "宿舍", tone: "slate", fontSize: 20 },
  { x: 235, y: 1910, w: 160, h: 100, label: "學生停車場", tone: "slate", fontSize: 16 },

  // ---------- 下排中央：維也納森林／名仕林 ----------
  { x: 430, y: 1875, w: 90, h: 80, label: "木屋", tone: "rose", fontSize: 15 },
  { x: 600, y: 1940, w: 115, h: 70, label: "警衛室", tone: "slate", fontSize: 15 },
  { x: 960, y: 1940, w: 130, h: 70, label: "回收場", tone: "slate", fontSize: 15 },

  // ---------- 下排右側：耕讀館／育賢樓／崇學樓 ----------
  { x: 1069, y: 1724, w: 355, h: 53, label: "耕讀館", tone: "amber", fontSize: 22 },
  { x: 1069, y: 1863, w: 165, h: 115, label: "育賢樓", tone: "amber", fontSize: 22 },
  { x: 1234, y: 1863, w: 210, h: 115, label: "電腦教室", tone: "amber", fontSize: 20 },
  { x: 1478, y: 1657, w: 118, h: 355, label: "崇學樓", tone: "green", fontSize: 24 },
];

export default function CampusMap() {
  const [active, setActive] = useState<MapHotspot | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-3xl border border-primary-900/10 bg-[#eef2ee] shadow-soft-lg">
        <svg
          viewBox="0 0 1629 2090"
          role="img"
          aria-label="校內清運點互動地圖（依 AED 分配圖重繪）"
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
              <stop offset="0%" stopColor="#e9edee" />
              <stop offset="100%" stopColor="#d3dade" />
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
                dy="4"
                stdDeviation="5"
                floodColor="#10222c"
                floodOpacity="0.16"
              />
            </filter>
          </defs>

          {/* background */}
          <rect x="0" y="0" width="1629" height="2090" fill="#eef2ee" />
          <rect
            x="30"
            y="85"
            width="1569"
            height="1855"
            fill="none"
            stroke="rgba(16,30,40,0.18)"
            strokeWidth={2}
          />
          <foreignObject x="180" y="15" width="1300" height="55">
            <div className="flex h-full items-center justify-center text-[26px] font-bold tracking-[0.3em] text-primary-800/80">
              國立北科附工校園配置圖
            </div>
          </foreignObject>

          {/* buildings */}
          {buildings.map((b, i) => (
            <g key={i} filter="url(#soft-shadow)">
              <rect
                x={b.x}
                y={b.y}
                width={b.w}
                height={b.h}
                rx={14}
                fill={TONE_FILL[b.tone]}
                stroke="rgba(16,30,40,0.14)"
              />
              <foreignObject x={b.x + 4} y={b.y + 4} width={b.w - 8} height={b.h - 8}>
                <div
                  className="flex h-full w-full flex-col items-center justify-center text-center leading-tight"
                  style={{ color: TONE_TEXT[b.tone] }}
                >
                  <span className="font-bold" style={{ fontSize: b.fontSize ?? 20 }}>
                    {b.label}
                  </span>
                  {b.sublabel && (
                    <span
                      className="mt-1 font-medium opacity-80"
                      style={{ fontSize: (b.fontSize ?? 20) * 0.62 }}
                    >
                      {b.sublabel}
                    </span>
                  )}
                </div>
              </foreignObject>
            </g>
          ))}

          {/* running track */}
          <g filter="url(#soft-shadow)">
            <rect x="462" y="398" width="744" height="514" rx={257} fill="url(#track-fill)" />
            <rect x="514" y="440" width="646" height="430" rx={215} fill="url(#field-fill)" />
          </g>
          <rect x="548" y="427" width="566" height="63" rx={10} fill="#f4efe4" stroke="rgba(16,30,40,0.15)" />
          <foreignObject x="548" y="427" width="566" height="63">
            <div className="flex h-full items-center justify-center text-[22px] font-bold text-primary-800">
              司令台
            </div>
          </foreignObject>
          <line x1="834" y1="440" x2="834" y2="870" stroke="rgba(255,255,255,0.55)" strokeDasharray="10 10" strokeWidth={3} />
          <foreignObject x="580" y="600" width="255" height="55">
            <div className="flex h-full items-center justify-center text-[22px] font-semibold text-white/90">
              體育三乙
            </div>
          </foreignObject>
          <foreignObject x="850" y="600" width="255" height="55">
            <div className="flex h-full items-center justify-center text-[22px] font-semibold text-white/90">
              體育三甲
            </div>
          </foreignObject>
          <foreignObject x="514" y="912" width="440" height="45">
            <div className="flex h-full items-center justify-center text-[16px] font-semibold text-primary-700/70">
              體育二乙（含水溝）
            </div>
          </foreignObject>
          <foreignObject x="954" y="912" width="330" height="45">
            <div className="flex h-full items-center justify-center text-[16px] font-semibold text-primary-700/70">
              體育二甲（含水溝花圃）
            </div>
          </foreignObject>

          {/* pond */}
          <path
            d="M 700 1400 C 660 1360, 720 1335, 765 1360 C 810 1330, 880 1350, 875 1390 C 930 1395, 940 1450, 885 1462 C 860 1490, 790 1478, 775 1455 C 720 1468, 674 1440, 700 1400 Z"
            fill="url(#pond-fill)"
            filter="url(#soft-shadow)"
          />
          <foreignObject x="705" y="1385" width="170" height="45">
            <div className="flex h-full items-center justify-center text-[18px] font-semibold text-white drop-shadow">
              中庭水池
            </div>
          </foreignObject>

          {/* 中庭圓環廣場（維也納森林／名仕林） */}
          <path
            d="M 700 1650 L 990 1650 L 990 1760 L 875 1880 L 815 1880 L 700 1760 Z"
            fill="#ffffff"
            stroke="rgba(16,30,40,0.16)"
            strokeWidth={2}
          />
          <circle cx="845" cy="1795" r="55" fill="#ffffff" stroke="rgba(16,30,40,0.16)" strokeWidth={2} />
          <foreignObject x="470" y="1810" width="260" height="45">
            <div className="flex h-full items-center justify-center text-[20px] font-bold text-primary-800">
              維也納森林
            </div>
          </foreignObject>
          <foreignObject x="775" y="1810" width="200" height="45">
            <div className="flex h-full items-center justify-center text-[20px] font-bold text-primary-800">
              名仕林
            </div>
          </foreignObject>

          {/* legend backdrop chip for zone context */}
          <foreignObject x="40" y="2020" width="900" height="45">
            <div className="text-[15px] text-primary-700/70">
              ＊本圖依「AED 分配圖」重繪，非精確比例，僅供活動動線與清運點位置參考
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
                  r={22}
                  fill="none"
                  stroke="#cf4038"
                  strokeWidth={4}
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
                  <circle r={21} fill="#cf4038" stroke="#fff" strokeWidth={4} />
                  <circle r={21} fill="transparent" />
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
                      <foreignObject x={-145} y={-92} width={290} height={54}>
                        <div className="mx-auto flex w-fit max-w-[280px] items-center justify-center rounded-lg bg-primary-900/95 px-4 py-2.5 text-center text-[17px] font-medium text-white shadow-lg">
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
