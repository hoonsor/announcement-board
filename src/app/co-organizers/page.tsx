import type { Metadata } from "next";
import ChecklistPage from "@/components/ChecklistPage";
import { coOrganizersChecklist } from "@/data/checklists";

export const metadata: Metadata = {
  title: coOrganizersChecklist.title,
  description: coOrganizersChecklist.subtitle,
};

export default function Page() {
  return <ChecklistPage data={coOrganizersChecklist} />;
}
