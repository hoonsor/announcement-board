import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import CreateAnnouncementForm from "@/components/CreateAnnouncementForm"
import { createAnnouncement } from "@/actions/announcement"

export default async function CreateAnnouncementPage() {
  const session = await auth()
  if (!session) return redirect("/login")

  const allTags = await prisma.tag.findMany({ orderBy: { name: 'asc' } })

  return (
    <main className="min-h-screen p-4 sm:p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">發布新公告</h1>
        <CreateAnnouncementForm allTags={allTags} action={createAnnouncement} />
      </div>
    </main>
  )
}
