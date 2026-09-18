import type { Metadata } from "next";
import ChecklistPage from "@/components/ChecklistPage";
import { workGroupsChecklist } from "@/data/checklists";

export const metadata: Metadata = {
  title: workGroupsChecklist.title,
  description: workGroupsChecklist.subtitle,
};

export default function Page() {
  return <ChecklistPage data={workGroupsChecklist} />;
}
