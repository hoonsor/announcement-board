import type { Metadata } from "next";
import ChecklistPage from "@/components/ChecklistPage";
import { competitionCategoriesChecklist } from "@/data/checklists";

export const metadata: Metadata = {
  title: competitionCategoriesChecklist.title,
  description: competitionCategoriesChecklist.subtitle,
};

export default function Page() {
  return <ChecklistPage data={competitionCategoriesChecklist} />;
}
