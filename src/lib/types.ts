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
  /** position in the map's SVG coordinate space (viewBox 0 0 1629 2090，對應「AED 分配圖」原始像素座標) */
  x: number;
  y: number;
  zoneLabel?: string;
  schedule: string;
  method?: string;
  owner?: string;
  contactPhone?: string;
  notes: string[];
  accent: "teal" | "amber" | "rose";
}
