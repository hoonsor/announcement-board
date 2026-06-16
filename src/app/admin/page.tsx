import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import Link from "next/link"
import { Trash2, Edit } from "lucide-react"
import { redirect } from "next/navigation"
import { deleteAnnouncement } from "@/actions/announcement"

export default async function AdminDashboard() {
  const session = await auth()
  if (!session) return redirect("/login")

  const announcements = await prisma.announcement.findMany({
    where: session.user.role === 'ADMIN' ? {} : { authorId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: { author: true }
  })

  return (
    <main className="min-h-screen p-4 sm:p-8 bg-gray-50">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex justify-between items-end border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">管理後台</h1>
            <p className="text-gray-500 mt-1">管理您發布的公告</p>
          </div>
          <Link href="/create" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
            發布新公告
          </Link>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                <th className="p-4 font-medium">標題</th>
                <th className="p-4 font-medium">發布者</th>
                <th className="p-4 font-medium">日期</th>
                <th className="p-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {announcements.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    尚無公告記錄
                  </td>
                </tr>
              ) : (
                announcements.map(ann => (
                  <tr key={ann.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{ann.title}</td>
                    <td className="p-4 text-gray-600 text-sm">{ann.author.name}</td>
                    <td className="p-4 text-gray-600 text-sm">{ann.createdAt.toLocaleString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="p-4 text-right space-x-2">
                      <Link href={`/edit/${ann.id}`} className="inline-block text-indigo-500 hover:text-indigo-700 p-2 rounded-lg hover:bg-indigo-50 transition-colors">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <form action={deleteAnnouncement.bind(null, ann.id, null)} className="inline-block">
                        <button type="submit" className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
