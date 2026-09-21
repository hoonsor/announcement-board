"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import type { MapHotspot } from "@/lib/types";
import { mapHotspots } from "@/data/mapHotspots";
import HotspotModal from "@/components/HotspotModal";

// 新版底圖「1150921-清運地點-暖陽土色@2x.png」原生像素尺寸，
// 用來把下方的像素座標換算成疊加圖層的百分比定位（與圖片實際顯示尺寸無關，
// 只要容器比例＝圖片原生比例，定位就會精準對齊）。
const IMAGE_WIDTH = 1400;
const IMAGE_HEIGHT = 1684;

// 6 個清運點在新版底圖上的實際像素座標，依「1150921-清運地點-暖陽土色@2x-加上清運點後.png」
// 參考圖上使用者手動標示的紅點位置，以色塊偵測換算得出。
// 川堂原本的清運點拆分為 1 樓／3 樓兩處，兩點位置相鄰，僅以樓層區分。
const PHOTO_POSITIONS: Record<string, { x: number; y: number }> = {
  "pe-flowerbed": { x: 823, y: 805 },
  "courtyard-pond-1f": { x: 626, y: 1277 },
  "courtyard-pond-3f": { x: 626, y: 1315 },
  "leqiun-hall": { x: 171, y: 1285 },
  "gengdu-hall": { x: 914, y: 1421 },
  "lexue-hall": { x: 1327, y: 1449 },
};

export default function CampusMapPhoto() {
  const [active, setActive] = useState<MapHotspot | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-3xl border border-primary-900/10 bg-[#eef2ee] shadow-soft-lg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/campus-map-base.png"
          alt="國立北科附工校內配置圖（暖陽土色版），標示競賽期間清運點位置"
          className="block h-auto w-full select-none"
          draggable={false}
        />

        {/* 底圖為乾淨版本（未預先畫紅點），這裡直接疊加「可見的紅點標示」＋可點擊熱區：
            提供滑鼠移入提示與點擊開啟詳細資訊。 */}
        {mapHotspots.map((h) => {
          const pos = PHOTO_POSITIONS[h.id];
          if (!pos) return null;
          const isHovered = hovered === h.id;
          const leftPct = (pos.x / IMAGE_WIDTH) * 100;
          const topPct = (pos.y / IMAGE_HEIGHT) * 100;
          return (
            <button
              key={h.id}
              type="button"
              onMouseEnter={() => setHovered(h.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(h.id)}
              onBlur={() => setHovered(null)}
              onClick={() => setActive(h)}
              aria-label={`${h.name}，點選查看詳細資訊`}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center"
              style={{ left: `${leftPct}%`, top: `${topPct}%`, width: 34, height: 34 }}
            >
              {/* 呼吸圈動畫，讓紅點在圖上更容易被注意到 */}
              <span
                aria-hidden
                className="absolute inline-flex h-3 w-3 animate-ping rounded-full bg-danger-400 opacity-60"
              />
              {/* 實心紅點 */}
              <span
                aria-hidden
                className="relative inline-flex h-3 w-3 rounded-full bg-danger-500 ring-2 ring-white shadow-md"
              />

              {/* 滑鼠移入／鍵盤聚焦時顯示的柔和外框，方便定位點擊範圍 */}
              <motion.span
                aria-hidden
                className="absolute rounded-full ring-2 ring-[#cf4038]"
                style={{ width: 30, height: 30 }}
                initial={false}
                animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />

              {/* hover tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.span
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max max-w-[220px] -translate-x-1/2 rounded-lg bg-primary-900/95 px-2.5 py-1.5 text-center text-[11px] font-medium text-white shadow-lg"
                  >
                    {h.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-foreground-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger-400 opacity-60" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-danger-500" />
          </span>
          紅點：競賽期間清運點（滑鼠移到紅點附近會有提示框／點按可查看詳細資訊）
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Trash2 className="h-3.5 w-3.5" />
          共 {mapHotspots.length} 個清運點（行政大樓川堂 1 樓／3 樓分別標示）
        </span>
      </div>

      <HotspotModal hotspot={active} onClose={() => setActive(null)} />
    </div>
  );
}
