import { HardHat, Mail, Phone } from "lucide-react";
import { navItems } from "@/lib/nav";
import { siteContent } from "@/data/site";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="no-print border-t border-primary-900/10 bg-primary-900 text-primary-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-400/90 text-primary-900">
              <HardHat className="h-4.5 w-4.5" strokeWidth={2.25} />
            </span>
            <span className="text-lg font-bold text-white">
              {siteContent.footer.title}
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-primary-200">
            {siteContent.footer.blurb}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-accent-300">
            公告項目
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-primary-200">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-accent-200"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-accent-300">
            聯絡服務組
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-primary-200">
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent-300" />
              <span>{siteContent.footer.phone}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent-300" />
              <span>{siteContent.footer.email}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-primary-300">
        {siteContent.footer.copyright}
      </div>
    </footer>
  );
}
