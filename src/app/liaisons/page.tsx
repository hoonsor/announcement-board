import type { Metadata } from "next";
import ChecklistPage from "@/components/ChecklistPage";
import { liaisonsChecklist } from "@/data/checklists";

export const metadata: Metadata = {
  title: liaisonsChecklist.title,
  description: liaisonsChecklist.subtitle,
};

export default function Page() {
  return <ChecklistPage data={liaisonsChecklist} />;
}
