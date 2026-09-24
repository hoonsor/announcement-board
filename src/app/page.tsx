import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck2,
  ClipboardCheck,
  HardHat,
  MapPinned,
  Megaphone,
  Printer,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { navItems } from "@/lib/nav";
import { homeContent } from "@/data/home";
import { changelogEntries } from "@/data/changelog";
import ChangelogSection from "@/components/ChangelogSection";

const workScopeIcons = [Megaphone, ClipboardCheck, MapPinned, ShieldCheck];

const workScope = homeContent.workScope.map((w, idx) => ({
  ...w,
  icon: workScopeIcons[idx],
}));

const timeline = homeContent.timeline;

export default function Home() {
  return (
    <div>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "radial-gradient(circle at 12% 20%, white 0, transparent 40%), radial-gradient(circle at 88% 15%, white 0, transparent 35%), radial-gradient(circle at 50% 100%, white 0, transparent 45%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold tracking-wider text-accent-200 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            {homeContent.hero.badge}
          </span>

          <h1 className="mt-6 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {homeContent.hero.title}
            <span className="mt-2 block text-lg font-medium text-primary-100 sm:text-xl">
              {homeContent.hero.subtitle}
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-primary-100 sm:text-base">
            {homeContent.hero.description}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/work-groups"
              className="inline-flex items-center gap-2 rounded-full bg-accent-400 px-6 py-3 text-sm font-bold text-primary-900 shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-accent-300"
            >
              {homeContent.hero.button1}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/waste-collection-points"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition-transform hover:-translate-y-0.5 hover:bg-white/20"
            >
              {homeContent.hero.button2}
              <MapPinned className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Changelog ---------- */}
      <ChangelogSection entries={changelogEntries} />

      {/* ---------- Quick nav cards ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-primary-800 sm:text-2xl dark:text-primary-100">
              {homeContent.quickNav.title}
            </h2>
            <p className="mt-2 text-sm text-foreground-muted">
              {homeContent.quickNav.description}
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isMap = item.href === "/waste-collection-points";
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative overflow-hidden rounded-2xl border border-primary-900/8 bg-surface p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-soft-lg ${
                  idx === 0 ? "lg:col-span-1" : ""
                }`}
              >
                <div
                  aria-hidden
                  className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary-100 opacity-70 transition-transform duration-300 group-hover:scale-125 dark:bg-primary-700/30"
                />
                <div className="relative">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-600 text-white shadow-soft">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-primary-800 dark:text-primary-100">
                    {item.label}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                    {item.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary-600 dark:text-accent-300">
                    {isMap ? "開啟互動地圖" : "查看注意事項與檢核表"}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ---------- Work scope ---------- */}
      <section className="bg-surface-muted py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-700 text-white shadow-soft">
              <HardHat className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-extrabold text-primary-800 sm:text-2xl dark:text-primary-100">
              {homeContent.workScopeSection.title}
            </h2>
          </div>
          <p className="mt-3 max-w-3xl text-sm text-foreground-muted">
            {homeContent.workScopeSection.description}
          </p>

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {workScope.map((w) => (
              <div
                key={w.title}
                className="rounded-2xl bg-surface p-5 shadow-soft"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-100 text-accent-700">
                  <w.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-3.5 text-sm font-bold text-foreground">
                  {w.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-foreground-muted">
                  {w.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Timeline ---------- */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-700 text-white shadow-soft">
            <CalendarCheck2 className="h-5 w-5" />
          </span>
          <h2 className="text-xl font-extrabold text-primary-800 sm:text-2xl dark:text-primary-100">
            {homeContent.timelineSection.title}
          </h2>
        </div>

        <div className="relative mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div
            aria-hidden
            className="absolute left-0 right-0 top-5 hidden h-px bg-gradient-to-r from-primary-200 via-primary-300 to-primary-200 sm:block"
          />
          {timeline.map((t, i) => (
            <div key={t.label} className="relative rounded-2xl bg-surface p-6 shadow-soft">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white shadow-soft">
                {i + 1}
              </span>
              <h3 className="mt-4 text-sm font-bold text-foreground">
                {t.label}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-foreground-muted">
                {t.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start gap-4 rounded-2xl border border-accent-300/60 bg-accent-50 p-6 sm:flex-row sm:items-center dark:border-accent-500/30 dark:bg-primary-800/40">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-400 text-primary-900 shadow-soft">
            <Printer className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-primary-800 dark:text-accent-100">
              {homeContent.printReminder.title}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-primary-700/80 dark:text-primary-100/80">
              {homeContent.printReminder.description}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
