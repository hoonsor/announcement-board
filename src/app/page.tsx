import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import AnnouncementList from "@/components/AnnouncementList"

export default async function Home() {
  const initialAnnouncements = await prisma.announcement.findMany({
    include: {
      tags: true,
      author: {
        select: { name: true }
      },
      attachments: true
    },
    orderBy: { createdAt: 'desc' }
  })

  const allTags = await prisma.tag.findMany({
    orderBy: { name: 'asc' }
  })

  return (
    <main className="min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center py-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            最新公告
          </h1>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            歡迎來到工科技藝競賽活動專區。您可以在這裡查看最新的活動消息、下載相關檔案，並使用標籤快速篩選您感興趣的內容。
          </p>
        </header>

        <AnnouncementList 
          initialAnnouncements={initialAnnouncements} 
          allTags={allTags}
        />
      </div>
    </main>
  )
}
