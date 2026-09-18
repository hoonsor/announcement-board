"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, HardHat } from "lucide-react";
import { navItems } from "@/lib/nav";
import { siteContent } from "@/data/site";
import ThemeToggle from "@/components/ThemeToggle";

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="no-print sticky top-0 z-50 border-b border-primary-900/10 bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex h-(--header-height) max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 text-accent-200 shadow-soft transition-transform group-hover:scale-105">
            <HardHat className="h-5 w-5" strokeWidth={2.25} />
          </span>
          <span className="leading-tight">
            <span className="block text-[11px] font-medium tracking-wide text-foreground-muted">
              {siteContent.brand.topLine}
            </span>
            <span className="block text-base font-bold text-primary-800 dark:text-primary-100">
              {siteContent.brand.bottomLine}
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "text-primary-800 dark:text-accent-200"
                    : "text-foreground-muted hover:text-primary-700 dark:hover:text-accent-100"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-primary-100 dark:bg-primary-700/40"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{item.shortLabel}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "關閉選單" : "開啟選單"}
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-primary-800 transition-colors hover:bg-primary-50 lg:hidden dark:text-primary-100 dark:hover:bg-primary-800/40"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-primary-900/10 lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-4 py-3 sm:px-6">
              {navItems.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                        active
                          ? "bg-primary-100 text-primary-800 dark:bg-primary-700/40 dark:text-accent-100"
                          : "text-foreground-muted hover:bg-surface-muted"
                      }`}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span>
                        <span className="block">{item.label}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
