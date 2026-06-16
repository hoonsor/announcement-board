"use client"

import { useState } from "react"
import RichTextEditor from "./RichTextEditor"

export default function CreateAnnouncementForm({ 
  allTags,
  initialData,
  action
}: { 
  allTags: any[]
  initialData?: any
  action: (formData: FormData) => Promise<void>
}) {
  const [content, setContent] = useState(initialData?.content || "")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletedAttachmentIds, setDeletedAttachmentIds] = useState<string[]>([])
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(initialData?.tags?.map((t: any) => t.id) || [])
  const [tagSearch, setTagSearch] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    formData.set("content", content) // override content with rich text

    // 附加上標記為刪除的附件 ID
    deletedAttachmentIds.forEach(id => {
      formData.append("deleteAttachments", id)
    })

    // 附加上選中的標籤 ID
    selectedTagIds.forEach(id => {
      formData.append("tags", id)
    })

    try {
      await action(formData)
    } catch (err) {
      console.error(err)
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">標題</label>
        <input name="title" defaultValue={initialData?.title} required className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="請輸入公告標題" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">內容</label>
        <RichTextEditor content={content} onChange={setContent} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">標籤 (可多選)</label>
        <div className="border border-gray-300 rounded-xl p-4 bg-gray-50/50 space-y-3">
          <input 
            type="text" 
            placeholder="搜尋篩選標籤..." 
            value={tagSearch} 
            onChange={(e) => setTagSearch(e.target.value)} 
            className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 bg-white outline-none"
          />
          <div className="flex flex-wrap gap-2 max-h-[160px] overflow-y-auto pr-1">
            {allTags.filter(t => t.name.toLowerCase().includes(tagSearch.toLowerCase())).map(t => {
              const isSelected = selectedTagIds.includes(t.id)
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setSelectedTagIds(prev => 
                      prev.includes(t.id) 
                        ? prev.filter(id => id !== t.id) 
                        : [...prev, t.id]
                    )
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 flex items-center space-x-1 cursor-pointer select-none
                    ${isSelected 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100' 
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300'
                    }
                  `}
                >
                  {isSelected && <span className="mr-0.5">✓</span>}
                  <span>#{t.name}</span>
                </button>
              )
            })}
            {allTags.filter(t => t.name.toLowerCase().includes(tagSearch.toLowerCase())).length === 0 && (
              <p className="text-xs text-gray-400 py-2">找不到符合的標籤</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{initialData ? "附加新檔案 (選填)" : "附件上傳"}</label>
        <input type="file" name="files" multiple className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 mb-2" />
        {initialData?.attachments?.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 font-medium">現有附件檔案 (點擊標記為刪除)：</p>
            <div className="flex flex-wrap gap-2">
              {initialData.attachments.map((att: any) => {
                const isDeleted = deletedAttachmentIds.includes(att.id)
                return (
                  <div 
                    key={att.id} 
                    className={`flex items-center space-x-2 text-xs border rounded-lg px-3 py-1.5 transition-all select-none
                      ${isDeleted 
                        ? 'bg-red-50 text-red-400 border-red-200 line-through' 
                        : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-red-50 hover:text-red-600 hover:border-red-300 cursor-pointer'
                      }
                    `}
                    onClick={() => {
                      setDeletedAttachmentIds(prev => 
                        prev.includes(att.id) 
                          ? prev.filter(id => id !== att.id) 
                          : [...prev, att.id]
                      )
                    }}
                    title={isDeleted ? "點擊復原" : "點擊標記為刪除"}
                  >
                    <span>{att.filename}</span>
                    <span>{isDeleted ? "↩️" : "🗑️"}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <button type="submit" disabled={isSubmitting || !content || content === '<p></p>'} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all hover:shadow-indigo-200 active:scale-[0.98] flex justify-center items-center">
        {isSubmitting ? (
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        ) : (
          initialData ? "儲存修改" : "確認發布公告"
        )}
      </button>
    </form>
  )
}
