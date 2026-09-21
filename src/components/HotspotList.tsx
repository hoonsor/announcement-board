"use client";

import { useState } from "react";
import { ChevronRight, MapPin } from "lucide-react";
import { mapHotspots } from "@/data/mapHotspots";
import type { MapHotspot } from "@/lib/types";
import HotspotModal from "@/components/HotspotModal";

const ACCENT_DOT: Record<MapHotspot["accent"], string> = {
  teal: "bg-primary-500",
  amber: "bg-accent-500",
  rose: "bg-danger-500",
};

export default function HotspotList() {
  const [active, setActive] = useState<MapHotspot | null>(null);

  return (
    <div>
      <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {mapHotspots.map((h) => (
          <li key={h.id}>
            <button
              type="button"
              onClick={() => setActive(h)}
              className="group flex w-full items-center gap-3 rounded-xl border border-primary-900/8 bg-surface px-4 py-3 text-left transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-soft"
            >
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${ACCENT_DOT[h.accent]}`}
              />
              <span className="flex-1 min-w-0">
                <span className="block truncate text-sm font-semibold text-foreground">
                  {h.name}
                </span>
                {h.zoneLabel && (
                  <span className="mt-0.5 flex items-center gap-1 truncate text-xs text-foreground-muted">
                    <MapPin className="h-3 w-3 shrink-0" />
                    {h.zoneLabel}
                  </span>
                )}
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-foreground-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary-500" />
            </button>
          </li>
        ))}
      </ul>

      <HotspotModal hotspot={active} onClose={() => setActive(null)} />
    </div>
  );
}
