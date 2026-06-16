import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import DOMPurify from 'isomorphic-dompurify'
import { Calendar, Paperclip, Download, Tag as TagIcon, ArrowLeft, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default async function AnnouncementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ann = await prisma.announcement.findUnique({
    where: { id },
    include: {
      author: { select: { name: true } },
      tags: true,
      attachments: true
    }
  })

  if (!ann) return notFound()

  const session = await auth()
  const canEdit = session?.user && (session.user.role === 'ADMIN' || session.user.id === ann.authorId)

  return (
    <main className="min-h-screen p-4 sm:p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors font-medium bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
            <ArrowLeft className="w-4 h-4 mr-1" /> 回到公告列表
          </Link>
          
          {canEdit && (
            <div className="flex gap-2">
              <Link href={`/edit/${ann.id}`} className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 transition-colors">
                <Edit className="w-4 h-4 mr-1" /> 編輯公告
              </Link>
              <form action={async () => {
                "use server"
                const { deleteAnnouncement } = await import("@/actions/announcement")
                await deleteAnnouncement(ann.id)
              }}>
                <button type="submit" className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-800 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 transition-colors">
                  <Trash2 className="w-4 h-4 mr-1" /> 刪除
                </button>
              </form>
            </div>
          )}
        </div>
        
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{ann.title}</h1>
          
          <div className="flex flex-wrap items-center text-sm text-gray-500 mb-8 gap-4 border-b border-gray-100 pb-4">
            <span className="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
              <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
              {new Date(ann.createdAt).toLocaleString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg font-medium border border-indigo-100">
              發布單位：{ann.author.name}
            </span>
          </div>

          <div 
            className="prose prose-sm sm:prose lg:prose-lg max-w-none text-gray-800 mb-8"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(ann.content) }}
          />

          {ann.attachments.length > 0 && (
            <div className="mb-8 space-y-3 bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <h4 className="text-md font-bold flex items-center text-gray-800">
                <Paperclip className="w-5 h-5 mr-2 text-indigo-500" /> 附件下載
              </h4>
              <div className="flex flex-col gap-3">
                {ann.attachments.map((att) => (
                  <a 
                    key={att.id} 
                    href={att.url} 
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-3 text-sm bg-white border border-gray-200 text-indigo-700 px-5 py-3 rounded-xl hover:bg-indigo-50 hover:border-indigo-300 transition-all shadow-sm group"
                  >
                    <Download className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                    <span className="font-medium">{att.filename}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-gray-100">
            <TagIcon className="w-5 h-5 text-gray-400 mr-2" />
            {ann.tags.map((tag) => (
              <span key={tag.id} className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium border border-gray-200">
                #{tag.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
