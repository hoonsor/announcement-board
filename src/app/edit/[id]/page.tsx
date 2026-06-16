import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import CreateAnnouncementForm from "@/components/CreateAnnouncementForm"
import { updateAnnouncement } from "@/actions/announcement"

export default async function EditAnnouncementPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return redirect("/login")

  const { id } = await params
  const ann = await prisma.announcement.findUnique({
    where: { id },
    include: { tags: true, attachments: true }
  })

  if (!ann) return notFound()
  if (ann.authorId !== session.user.id && session.user.role !== 'ADMIN') return redirect("/")

  const allTags = await prisma.tag.findMany({ orderBy: { name: 'asc' } })
  const updateAction = updateAnnouncement.bind(null, id)

  return (
    <main className="min-h-screen p-4 sm:p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">編輯公告</h1>
        <CreateAnnouncementForm allTags={allTags} initialData={ann} action={updateAction} />
      </div>
    </main>
  )
}
