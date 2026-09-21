import type { Metadata } from "next";
import { CalendarClock, MapPinned, Recycle, Truck } from "lucide-react";
import CampusMapPhoto from "@/components/CampusMapPhoto";
import ClientHotspotList from "@/components/HotspotList";
import { mapHotspots } from "@/data/mapHotspots";
import { wastePageContent } from "@/data/wastePage";

export const metadata: Metadata = {
  title: "競賽期間清運點",
  description:
    "115年全國工科技藝競賽競賽期間校內清運點互動地圖，掌握各清運地點位置、清運時段與注意事項。",
};

const stats = [
  {
    icon: MapPinned,
    label: wastePageContent.stats.pointCountLabel,
    value: `${mapHotspots.length} 處`,
  },
  {
    icon: CalendarClock,
    label: wastePageContent.stats.dailyLabel,
    value: wastePageContent.stats.dailyValue,
  },
  {
    icon: Recycle,
    label: wastePageContent.stats.categoryLabel,
    value: wastePageContent.stats.categoryValue,
  },
];

export default function Page() {
  return (
    <div>
      <section className="no-print relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 25%, white 0, transparent 45%), radial-gradient(circle at 90% 80%, white 0, transparent 40%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wider text-accent-200 backdrop-blur">
            公告 {wastePageContent.badge}
          </span>
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
            {wastePageContent.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-primary-100 sm:text-base">
            {wastePageContent.subtitle}
          </p>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15">
                  <s.icon className="h-4.5 w-4.5" />
                </span>
                <div className="leading-tight">
                  <div className="text-[11px] text-primary-100">{s.label}</div>
                  <div className="text-sm font-bold">{s.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <CampusMapPhoto />

        <div className="mt-10 rounded-2xl border border-primary-900/8 bg-surface p-5 shadow-soft sm:p-7">
          <h2 className="flex items-center gap-2 text-base font-bold text-primary-800 sm:text-lg dark:text-primary-100">
            <Truck className="h-5 w-5 text-primary-500" />
            {wastePageContent.list.title}
          </h2>
          <p className="mt-1 text-sm text-foreground-muted">
            {wastePageContent.list.description}
          </p>

          <ClientHotspotList />
        </div>

        <p className="mt-6 text-center text-xs text-foreground-muted">
          {wastePageContent.footnote}
        </p>
      </section>
    </div>
  );
}
