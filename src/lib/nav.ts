/**
 * ⚠️ 此檔案由 `npm run sync-content` 自動產生，請勿手動編輯。
 * 如需修改內容，請編輯以下檔案後重新執行 `npm run sync-content`：
 * content/site.md
 */
import type { LucideIcon } from "lucide-react";
import {
  ClipboardList,
  Users,
  HandHeart,
  Radio,
  MapPinned,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  shortLabel: string;
  description: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  {
    href: "/work-groups",
    label: "工作組注意事項",
    shortLabel: "工作組注意事項",
    description: "校內行政與工作組別配合服務組之共通檢核事項",
    icon: ClipboardList,
  },
  {
    href: "/competition-categories",
    label: "競賽職種（校內）注意事項",
    shortLabel: "競賽職種（校內）注意事項",
    description: "各職種賽場教師與工作人員賽前中後檢核事項",
    icon: Users,
  },
  {
    href: "/co-organizers",
    label: "協辦單位注意事項",
    shortLabel: "協辦單位注意事項",
    description: "校外協辦單位進出校園與配合服務組之相關規範",
    icon: HandHeart,
  },
  {
    href: "/liaisons",
    label: "外派聯絡人注意事項",
    shortLabel: "外派聯絡人注意事項",
    description: "各定點外派聯絡人到職、通訊與執勤規範",
    icon: Radio,
  },
  {
    href: "/waste-collection-points",
    label: "競賽期間清運點",
    shortLabel: "清運點地圖",
    description: "互動校園地圖，掌握各清運地點位置與清運時間",
    icon: MapPinned,
  },
];
