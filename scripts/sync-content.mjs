#!/usr/bin/env node
/**
 * 讀取 content/ 資料夾下的 .md 檔案，轉換成網站程式讀取的 TypeScript 資料檔。
 *
 * 用法： npm run sync-content
 *
 * 產出的檔案最上方都會標註「自動產生，請勿手動編輯」，
 * 因為每次執行都會被整份覆蓋——要修改內容請改 content/ 底下的 .md 檔案。
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CONTENT = join(ROOT, "content");

const GENERATED_BANNER = (sourceFiles) => `/**
 * ⚠️ 此檔案由 \`npm run sync-content\` 自動產生，請勿手動編輯。
 * 如需修改內容，請編輯以下檔案後重新執行 \`npm run sync-content\`：
 * ${sourceFiles.join("、")}
 */
`;

function readLines(relPath) {
  const text = readFileSync(join(CONTENT, relPath), "utf-8");
  return text.split(/\r?\n/);
}

function splitKV(line) {
  const idx = line.indexOf("：");
  if (idx === -1) return null;
  return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
}

function isHeading(line, level) {
  return line.startsWith("#".repeat(level) + " ");
}

function headingText(line, level) {
  return line.slice(level + 1).trim();
}

// ---------------------------------------------------------------------------
// 1. 檢核清單頁面 (content/checklists/*.md -> src/data/checklists.ts)
// ---------------------------------------------------------------------------

const CHECKLIST_FILES = [
  { file: "checklists/work-groups.md", slug: "work-groups", exportName: "workGroupsChecklist" },
  { file: "checklists/competition-categories.md", slug: "competition-categories", exportName: "competitionCategoriesChecklist" },
  { file: "checklists/co-organizers.md", slug: "co-organizers", exportName: "coOrganizersChecklist" },
  { file: "checklists/liaisons.md", slug: "liaisons", exportName: "liaisonsChecklist" },
];

function parseChecklistFile({ file, slug }) {
  const lines = readLines(file);
  let title = "";
  const meta = {};
  const sections = [];
  let current = null;
  let itemCounter = 0;
  let idPrefix = slug;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    if (isHeading(line, 1)) {
      title = headingText(line, 1);
      continue;
    }
    if (isHeading(line, 2)) {
      current = { id: `section-${sections.length + 1}`, title: headingText(line, 2), items: [] };
      sections.push(current);
      continue;
    }
    if (current && line.startsWith(">")) {
      current.description = line.replace(/^>\s*/, "").trim();
      continue;
    }
    if (current && line.startsWith("- ")) {
      itemCounter += 1;
      current.items.push({ id: `${idPrefix}-${itemCounter}`, text: line.slice(2).trim() });
      continue;
    }
    if (!current) {
      const kv = splitKV(line);
      if (!kv) continue;
      const [key, value] = kv;
      if (key === "項目代號前綴") idPrefix = value;
      else if (key === "公告編號") meta.badge = value;
      else if (key === "副標題") meta.subtitle = value;
      else if (key === "最後更新") meta.updatedAt = value;
      else if (key === "聯絡單位") meta.unit = value;
      else if (key === "聯絡人") meta.person = value;
      else if (key === "電話") meta.phone = value;
      else if (key === "Email") meta.email = value;
    }
  }

  return {
    slug,
    badge: meta.badge ?? "",
    title,
    subtitle: meta.subtitle ?? "",
    updatedAt: meta.updatedAt ?? "",
    contact: {
      unit: meta.unit ?? "",
      person: meta.person,
      phone: meta.phone,
      email: meta.email,
    },
    sections,
  };
}

function emitChecklists() {
  const entries = CHECKLIST_FILES.map((f) => ({ ...f, data: parseChecklistFile(f) }));

  const body = entries
    .map(({ exportName, data }) => {
      const sectionsCode = data.sections
        .map((s) => {
          const itemsCode = s.items
            .map((i) => `      { id: ${JSON.stringify(i.id)}, text: ${JSON.stringify(i.text)} },`)
            .join("\n");
          return `    {
      id: ${JSON.stringify(s.id)},
      title: ${JSON.stringify(s.title)},${
            s.description ? `\n      description: ${JSON.stringify(s.description)},` : ""
          }
      items: [
${itemsCode}
      ],
    },`;
        })
        .join("\n");

      return `export const ${exportName}: ChecklistPageData = {
  slug: ${JSON.stringify(data.slug)},
  badge: ${JSON.stringify(data.badge)},
  title: ${JSON.stringify(data.title)},
  subtitle: ${JSON.stringify(data.subtitle)},
  updatedAt: ${JSON.stringify(data.updatedAt)},
  contact: {
    unit: ${JSON.stringify(data.contact.unit)},
    person: ${JSON.stringify(data.contact.person)},
    phone: ${JSON.stringify(data.contact.phone)},
    email: ${JSON.stringify(data.contact.email)},
  },
  sections: [
${sectionsCode}
  ],
};`;
    })
    .join("\n\n");

  const exportListCode = entries.map((e) => e.exportName).join(",\n  ");

  const out = `${GENERATED_BANNER(CHECKLIST_FILES.map((f) => `content/${f.file}`))}import { ChecklistPageData } from "@/lib/types";

${body}

export const checklistPages: ChecklistPageData[] = [
  ${exportListCode},
];
`;

  writeFileSync(join(ROOT, "src/data/checklists.ts"), out, "utf-8");
  console.log("✓ src/data/checklists.ts 已更新");
}

// ---------------------------------------------------------------------------
// 2. 清運點地圖 (content/waste-collection-points.md -> src/data/mapHotspots.ts + src/data/wastePage.ts)
// ---------------------------------------------------------------------------

function parseWastePointsFile() {
  const lines = readLines("waste-collection-points.md");
  const page = {};
  const hotspots = [];
  let current = null;
  let inNotes = false;
  let section = "waste"; // "waste" | "aed" — 由 "## 清運點" / "## AED" 標題切換

  for (const raw of lines) {
    const line = raw.trimEnd();
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (isHeading(trimmed, 1)) {
      page.title = headingText(trimmed, 1);
      continue;
    }
    if (isHeading(trimmed, 3)) {
      current = { name: headingText(trimmed, 3), notes: [], kind: section };
      hotspots.push(current);
      inNotes = false;
      continue;
    }
    if (isHeading(trimmed, 2)) {
      // "## 清運點" / "## AED" 區塊標題：切換後續項目所屬的種類
      const h = headingText(trimmed, 2);
      if (h === "AED") section = "aed";
      else section = "waste";
      continue;
    }

    if (current) {
      if (/^-\s+注意事項：\s*$/.test(trimmed)) {
        inNotes = true;
        continue;
      }
      const indentedNote = /^\s*-\s+/.test(line) && line.startsWith("  ");
      if (inNotes && indentedNote) {
        current.notes.push(trimmed.replace(/^-\s+/, "").trim());
        continue;
      }
      if (trimmed.startsWith("- ")) {
        inNotes = false;
        const kv = splitKV(trimmed.slice(2));
        if (!kv) continue;
        const [key, value] = kv;
        if (key === "代號") current.id = value;
        else if (key === "位置座標") {
          const m = value.match(/x\s*=\s*(-?\d+(?:\.\d+)?)\s*,\s*y\s*=\s*(-?\d+(?:\.\d+)?)/i);
          if (m) {
            current.x = Number(m[1]);
            current.y = Number(m[2]);
          }
        } else if (key === "標示顏色") current.accent = value.trim();
        else if (key === "位置說明" || key === "位置") current.zoneLabel = value;
        else if (key === "清運時段") current.schedule = value;
        else if (key === "處理方式") current.method = value;
        else if (key === "負責單位") current.owner = value;
        else if (key === "聯絡電話") current.contactPhone = value;
      }
      continue;
    }

    // page-level front matter (before any hotspot heading)
    const kv = splitKV(trimmed);
    if (!kv) continue;
    const [key, value] = kv;
    if (key === "公告編號") page.badge = value;
    else if (key === "副標題") page.subtitle = value;
    else if (key === "統計卡一標籤") page.stat1Label = value;
    else if (key === "統計卡二標籤") page.stat2Label = value;
    else if (key === "統計卡二數值") page.stat2Value = value;
    else if (key === "統計卡三標籤") page.stat3Label = value;
    else if (key === "統計卡三數值") page.stat3Value = value;
    else if (key === "清單標題") page.listTitle = value;
    else if (key === "清單說明") page.listDescription = value;
    else if (key === "AED清單標題") page.aedListTitle = value;
    else if (key === "AED清單說明") page.aedListDescription = value;
    else if (key === "底部備註") page.footnote = value;
  }

  return { page, hotspots };
}

function emitHotspots(hotspots) {
  const items = hotspots
    .map((h) => {
      const notesCode = h.notes.map((n) => `      ${JSON.stringify(n)},`).join("\n");
      return `  {
    id: ${JSON.stringify(h.id)},
    name: ${JSON.stringify(h.name)},
    kind: ${JSON.stringify(h.kind ?? "waste")},
    x: ${h.x},
    y: ${h.y},
    zoneLabel: ${JSON.stringify(h.zoneLabel)},
    schedule: ${JSON.stringify(h.schedule)},
    method: ${JSON.stringify(h.method)},
    owner: ${JSON.stringify(h.owner)},
    contactPhone: ${JSON.stringify(h.contactPhone)},
    notes: [
${notesCode}
    ],
    accent: ${JSON.stringify(h.accent)},
  },`;
    })
    .join("\n");

  const out = `${GENERATED_BANNER(["content/waste-collection-points.md"])}import { MapHotspot } from "@/lib/types";

export const mapHotspots: MapHotspot[] = [
${items}
];
`;

  writeFileSync(join(ROOT, "src/data/mapHotspots.ts"), out, "utf-8");
  console.log("✓ src/data/mapHotspots.ts 已更新");
}

function emitWastePage(page) {
  const out = `${GENERATED_BANNER(["content/waste-collection-points.md"])}export const wastePageContent = {
  badge: ${JSON.stringify(page.badge ?? "")},
  title: ${JSON.stringify(page.title ?? "")},
  subtitle: ${JSON.stringify(page.subtitle ?? "")},
  stats: {
    pointCountLabel: ${JSON.stringify(page.stat1Label ?? "")},
    dailyLabel: ${JSON.stringify(page.stat2Label ?? "")},
    dailyValue: ${JSON.stringify(page.stat2Value ?? "")},
    categoryLabel: ${JSON.stringify(page.stat3Label ?? "")},
    categoryValue: ${JSON.stringify(page.stat3Value ?? "")},
  },
  list: {
    title: ${JSON.stringify(page.listTitle ?? "")},
    description: ${JSON.stringify(page.listDescription ?? "")},
  },
  aedList: {
    title: ${JSON.stringify(page.aedListTitle ?? "")},
    description: ${JSON.stringify(page.aedListDescription ?? "")},
  },
  footnote: ${JSON.stringify(page.footnote ?? "")},
};
`;
  writeFileSync(join(ROOT, "src/data/wastePage.ts"), out, "utf-8");
  console.log("✓ src/data/wastePage.ts 已更新");
}

// ---------------------------------------------------------------------------
// 3. 網站全域設定 (content/site.md -> src/lib/nav.ts + src/data/site.ts)
// ---------------------------------------------------------------------------

const NAV_ICONS = {
  "/work-groups": "ClipboardList",
  "/competition-categories": "Users",
  "/co-organizers": "HandHeart",
  "/liaisons": "Radio",
  "/waste-collection-points": "MapPinned",
};

function parseSiteFile() {
  const lines = readLines("site.md");
  const brand = {};
  const footer = {};
  const navItems = [];
  let section = null; // "brand" | "nav" | "footer"
  let currentNav = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    if (isHeading(line, 2)) {
      const h = headingText(line, 2);
      if (h === "品牌名稱") section = "brand";
      else if (h === "導覽選單") section = "nav";
      else if (h === "頁尾內容") section = "footer";
      else section = null;
      currentNav = null;
      continue;
    }
    if (isHeading(line, 3) && section === "nav") {
      const href = headingText(line, 3);
      currentNav = { href, label: "", shortLabel: "", description: "" };
      navItems.push(currentNav);
      continue;
    }

    const kv = splitKV(line);
    if (!kv) continue;
    const [key, value] = kv;

    if (section === "brand") {
      if (key === "上排小字") brand.topLine = value;
      else if (key === "下排大字") brand.bottomLine = value;
    } else if (section === "nav" && currentNav) {
      if (key === "標題") currentNav.label = value;
      else if (key === "選單短標籤") currentNav.shortLabel = value;
      else if (key === "說明") currentNav.description = value;
    } else if (section === "footer") {
      if (key === "標題") footer.title = value;
      else if (key === "簡介") footer.blurb = value;
      else if (key === "電話") footer.phone = value;
      else if (key === "Email") footer.email = value;
      else if (key === "版權文字") footer.copyright = value;
    }
  }

  return { brand, footer, navItems };
}

function emitNav(navItems) {
  const itemsCode = navItems
    .map(
      (n) => `  {
    href: ${JSON.stringify(n.href)},
    label: ${JSON.stringify(n.label)},
    shortLabel: ${JSON.stringify(n.shortLabel)},
    description: ${JSON.stringify(n.description)},
    icon: ${NAV_ICONS[n.href] ?? "ClipboardList"},
  },`
    )
    .join("\n");

  const iconImports = [...new Set(Object.values(NAV_ICONS))].join(",\n  ");

  const out = `${GENERATED_BANNER(["content/site.md"])}import type { LucideIcon } from "lucide-react";
import {
  ${iconImports},
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  shortLabel: string;
  description: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
${itemsCode}
];
`;
  writeFileSync(join(ROOT, "src/lib/nav.ts"), out, "utf-8");
  console.log("✓ src/lib/nav.ts 已更新");
}

function emitSite(brand, footer) {
  const out = `${GENERATED_BANNER(["content/site.md"])}export const siteContent = {
  brand: {
    topLine: ${JSON.stringify(brand.topLine ?? "")},
    bottomLine: ${JSON.stringify(brand.bottomLine ?? "")},
  },
  footer: {
    title: ${JSON.stringify(footer.title ?? "")},
    blurb: ${JSON.stringify(footer.blurb ?? "")},
    phone: ${JSON.stringify(footer.phone ?? "")},
    email: ${JSON.stringify(footer.email ?? "")},
    copyright: ${JSON.stringify(footer.copyright ?? "")},
  },
};
`;
  writeFileSync(join(ROOT, "src/data/site.ts"), out, "utf-8");
  console.log("✓ src/data/site.ts 已更新");
}

// ---------------------------------------------------------------------------
// 4. 首頁內容 (content/home.md -> src/data/home.ts)
// ---------------------------------------------------------------------------

function parseHomeFile() {
  const lines = readLines("home.md");
  const hero = {};
  const quickNav = {};
  const workScopeSection = {};
  const workScope = [];
  const timelineSection = {};
  const timeline = [];
  const printReminder = {};
  let section = null;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    if (isHeading(line, 2)) {
      const h = headingText(line, 2);
      if (h === "頂部區塊") section = "hero";
      else if (h === "五大公告專區") section = "quickNav";
      else if (h === "服務組工作內容") section = "workScope";
      else if (h === "活動期程重點") section = "timeline";
      else if (h === "列印提醒卡") section = "printReminder";
      else section = null;
      continue;
    }

    if (line.startsWith("- ")) {
      const kv = splitKV(line.slice(2));
      if (!kv) continue;
      const [label, desc] = kv;
      if (section === "workScope") workScope.push({ title: label, desc });
      else if (section === "timeline") timeline.push({ label, desc });
      continue;
    }

    const kv = splitKV(line);
    if (!kv) continue;
    const [key, value] = kv;

    if (section === "hero") {
      if (key === "徽章文字") hero.badge = value;
      else if (key === "主標題") hero.title = value;
      else if (key === "主標題副行") hero.subtitle = value;
      else if (key === "說明文字") hero.description = value;
      else if (key === "按鈕一文字") hero.button1 = value;
      else if (key === "按鈕二文字") hero.button2 = value;
    } else if (section === "quickNav") {
      if (key === "標題") quickNav.title = value;
      else if (key === "說明") quickNav.description = value;
    } else if (section === "workScope") {
      if (key === "標題") workScopeSection.title = value;
      else if (key === "說明") workScopeSection.description = value;
    } else if (section === "timeline") {
      if (key === "標題") timelineSection.title = value;
    } else if (section === "printReminder") {
      if (key === "標題") printReminder.title = value;
      else if (key === "說明") printReminder.description = value;
    }
  }

  return { hero, quickNav, workScopeSection, workScope, timelineSection, timeline, printReminder };
}

function emitHome(data) {
  const workScopeCode = data.workScope
    .map((w) => `    { title: ${JSON.stringify(w.title)}, desc: ${JSON.stringify(w.desc)} },`)
    .join("\n");
  const timelineCode = data.timeline
    .map((t) => `    { label: ${JSON.stringify(t.label)}, desc: ${JSON.stringify(t.desc)} },`)
    .join("\n");

  const out = `${GENERATED_BANNER(["content/home.md"])}export const homeContent = {
  hero: {
    badge: ${JSON.stringify(data.hero.badge ?? "")},
    title: ${JSON.stringify(data.hero.title ?? "")},
    subtitle: ${JSON.stringify(data.hero.subtitle ?? "")},
    description: ${JSON.stringify(data.hero.description ?? "")},
    button1: ${JSON.stringify(data.hero.button1 ?? "")},
    button2: ${JSON.stringify(data.hero.button2 ?? "")},
  },
  quickNav: {
    title: ${JSON.stringify(data.quickNav.title ?? "")},
    description: ${JSON.stringify(data.quickNav.description ?? "")},
  },
  workScopeSection: {
    title: ${JSON.stringify(data.workScopeSection.title ?? "")},
    description: ${JSON.stringify(data.workScopeSection.description ?? "")},
  },
  workScope: [
${workScopeCode}
  ],
  timelineSection: {
    title: ${JSON.stringify(data.timelineSection.title ?? "")},
  },
  timeline: [
${timelineCode}
  ],
  printReminder: {
    title: ${JSON.stringify(data.printReminder.title ?? "")},
    description: ${JSON.stringify(data.printReminder.description ?? "")},
  },
};
`;
  writeFileSync(join(ROOT, "src/data/home.ts"), out, "utf-8");
  console.log("✓ src/data/home.ts 已更新");
}

// ---------------------------------------------------------------------------
// 5. 版本更新紀錄 (content/changelog.md -> src/data/changelog.ts)
// ---------------------------------------------------------------------------
//
// 每個 "### YYYY-MM-DD｜標題" 三級標題視為一筆紀錄，日期與標題以「｜」分隔；
// 標題底下緊接的 "- " 條列項目視為該筆紀錄的詳細內容，直到下一個標題為止。
// 檔案內文字順序＝網站顯示順序，建議由新到舊排列（最新的更新放最上面）。

function parseChangelogFile() {
  const lines = readLines("changelog.md");
  const entries = [];
  let current = null;
  let counter = 0;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (isHeading(line, 1)) continue; // 頁面標題，目前未使用
    if (line.startsWith("⚠️")) continue; // 檔案開頭的維護說明，不顯示在網站上

    if (isHeading(line, 3)) {
      counter += 1;
      const heading = headingText(line, 3);
      const sepIdx = heading.indexOf("｜");
      const date = sepIdx === -1 ? "" : heading.slice(0, sepIdx).trim();
      const title = sepIdx === -1 ? heading : heading.slice(sepIdx + 1).trim();
      current = { id: `cl-${counter}`, date, title, details: [] };
      entries.push(current);
      continue;
    }

    if (current && line.startsWith("- ")) {
      current.details.push(line.slice(2).trim());
    }
  }

  return entries;
}

function emitChangelog(entries) {
  const itemsCode = entries
    .map((e) => {
      const detailsCode = e.details.map((d) => `      ${JSON.stringify(d)},`).join("\n");
      return `  {
    id: ${JSON.stringify(e.id)},
    date: ${JSON.stringify(e.date)},
    title: ${JSON.stringify(e.title)},
    details: [
${detailsCode}
    ],
  },`;
    })
    .join("\n");

  const out = `${GENERATED_BANNER(["content/changelog.md"])}import { ChangelogEntry } from "@/lib/types";

export const changelogEntries: ChangelogEntry[] = [
${itemsCode}
];
`;
  writeFileSync(join(ROOT, "src/data/changelog.ts"), out, "utf-8");
  console.log("✓ src/data/changelog.ts 已更新");
}

// ---------------------------------------------------------------------------
// 執行
// ---------------------------------------------------------------------------

mkdirSync(join(ROOT, "src/data"), { recursive: true });

emitChecklists();

const { page, hotspots } = parseWastePointsFile();
emitHotspots(hotspots);
emitWastePage(page);

const { brand, footer, navItems } = parseSiteFile();
emitNav(navItems);
emitSite(brand, footer);

const home = parseHomeFile();
emitHome(home);

const changelog = parseChangelogFile();
emitChangelog(changelog);

console.log("\n全部內容同步完成！接著可執行 npm run build 確認網站正常。");
