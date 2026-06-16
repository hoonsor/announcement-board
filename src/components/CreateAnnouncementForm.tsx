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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    formData.set("content", content) // override content with rich text

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
        <select name="tags" multiple defaultValue={initialData?.tags?.map((t:any)=>t.id)} className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50" size={5}>
          {allTags.map(t => (
            <option key={t.id} value={t.id} className="p-2 hover:bg-indigo-50 rounded cursor-pointer">{t.name}</option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">💡 按住 Ctrl (Windows) 或 Cmd (Mac) 可以選取多個標籤。</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{initialData ? "附加新檔案 (選填)" : "附件上傳"}</label>
        <input type="file" name="files" multiple className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50" />
        {initialData?.attachments?.length > 0 && (
          <p className="text-sm text-indigo-600 mt-2 font-medium">已存在的檔案：{initialData.attachments.map((a:any) => a.filename).join(', ')}</p>
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
