export interface ChecklistItem {
  id: string;
  text: string;
  note?: string;
}

export interface ChecklistSection {
  id: string;
  title: string;
  description?: string;
  items: ChecklistItem[];
}

export interface ChecklistPageData {
  slug: string;
  badge: string;
  title: string;
  subtitle: string;
  updatedAt: string;
  contact: {
    unit: string;
    person?: string;
    phone?: string;
    email?: string;
  };
  sections: ChecklistSection[];
}

export interface MapHotspot {
  id: string;
  name: string;
  /** "waste" = 垃圾清運點；"aed" = AED 位置 */
  kind: "waste" | "aed";
  /** position in the map's pixel coordinate space (對應 public/images/campus-map-base.png 原生像素座標) */
  x: number;
  y: number;
  zoneLabel?: string;
  schedule?: string;
  method?: string;
  owner?: string;
  contactPhone?: string;
  notes: string[];
  accent: "teal" | "amber" | "rose";
}
