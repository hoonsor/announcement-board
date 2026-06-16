"use client"

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Paperclip, Tag as TagIcon, Download } from 'lucide-react'
import DOMPurify from 'isomorphic-dompurify'
import Link from 'next/link'

// Types
type Tag = { id: string, name: string }
type Attachment = { id: string, filename: string, url: string }
type Announcement = {
  id: string
  title: string
  content: string
  createdAt: Date
  author: { name: string }
  tags: Tag[]
  attachments: Attachment[]
}

type FilterCondition = {
  type: 'AND' | 'OR' | 'NOT'
  tagId: string
}

export default function AnnouncementList({ 
  initialAnnouncements,
  allTags
}: {
  initialAnnouncements: any[]
  allTags: Tag[]
}) {
  const [conditions, setConditions] = useState<FilterCondition[]>([])

  const filteredAnnouncements = useMemo(() => {
    return initialAnnouncements.filter(ann => {
      if (conditions.length === 0) return true;

      // Group conditions by type
      const andTags = conditions.filter(c => c.type === 'AND').map(c => c.tagId)
      const orTags = conditions.filter(c => c.type === 'OR').map(c => c.tagId)
      const notTags = conditions.filter(c => c.type === 'NOT').map(c => c.tagId)

      const annTagIds = ann.tags.map((t: Tag) => t.id)

      // NOT logic: if it has any NOT tag, exclude it
      if (notTags.some(id => annTagIds.includes(id))) return false;

      // AND logic: if it doesn't have ALL AND tags, exclude it
      if (andTags.length > 0 && !andTags.every(id => annTagIds.includes(id))) return false;

      // OR logic: if OR tags exist, it must have AT LEAST ONE OR tag
      if (orTags.length > 0 && !orTags.some(id => annTagIds.includes(id))) return false;

      return true;
    })
  }, [initialAnnouncements, conditions])

  const toggleCondition = (tagId: string, type: 'AND' | 'OR' | 'NOT') => {
    setConditions(prev => {
      const existing = prev.find(c => c.tagId === tagId)
      if (existing) {
        if (existing.type === type) return prev.filter(c => c.tagId !== tagId) // remove
        return prev.map(c => c.tagId === tagId ? { ...c, type } : c) // change type
      }
      return [...prev, { tagId, type }] // add
    })
  }

  const getTagState = (tagId: string) => conditions.find(c => c.tagId === tagId)?.type || 'NONE'

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
          <TagIcon className="w-5 h-5 mr-2 text-indigo-500" />
          快速標籤篩選
        </h3>
        <div className="flex flex-wrap gap-3">
          {allTags.map(tag => {
            const state = getTagState(tag.id)
            return (
              <button
                key={tag.id}
                onClick={() => {
                  if (state === 'NONE') toggleCondition(tag.id, 'AND')
                  else if (state === 'AND') toggleCondition(tag.id, 'OR')
                  else if (state === 'OR') toggleCondition(tag.id, 'NOT')
                  else toggleCondition(tag.id, 'NOT') // NOT -> NONE (toggle itself to remove)
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border flex items-center space-x-1 focus:outline-none
                  ${state === 'NONE' ? 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100' : ''}
                  ${state === 'AND' ? 'bg-green-100 text-green-700 border-green-200 ring-2 ring-green-400' : ''}
                  ${state === 'OR' ? 'bg-blue-100 text-blue-700 border-blue-200 ring-2 ring-blue-400' : ''}
                  ${state === 'NOT' ? 'bg-red-100 text-red-700 border-red-200 ring-2 ring-red-400' : ''}
                `}
              >
                <span>{tag.name}</span>
                {state !== 'NONE' && (
                  <span className="text-[10px] uppercase font-bold ml-1 opacity-80 bg-white/50 px-1.5 rounded">{state}</span>
                )}
              </button>
            )
          })}
        </div>
        <p className="text-xs text-gray-400 mt-4">提示: 點擊標籤依序切換條件 ( AND → OR → NOT → 取消 )</p>
      </div>

      {/* List Section */}
      <div className="grid gap-4">
        <AnimatePresence>
          {filteredAnnouncements.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-100"
            >
              沒有符合條件的公告
            </motion.div>
          ) : (
            filteredAnnouncements.map((ann) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={ann.id}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <Link href={`/announcement/${ann.id}`}>
                    <h2 className="text-xl font-bold text-indigo-700 hover:text-indigo-500 transition-colors cursor-pointer">{ann.title}</h2>
                  </Link>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md whitespace-nowrap ml-4">
                    {ann.author.name}
                  </span>
                </div>
                
                <div className="flex items-center text-xs text-gray-500 mb-4 space-x-4">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(ann.createdAt).toLocaleString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div 
                  className="prose prose-sm max-w-none text-gray-600 mb-4 line-clamp-3 relative"
                  style={{ maxHeight: '4.5rem', overflow: 'hidden' }}
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(ann.content) }}
                />
                
                <div className="mb-4">
                  <Link href={`/announcement/${ann.id}`} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center">
                    閱讀全文 &rarr;
                  </Link>
                </div>

                {/* Attachments */}
                {ann.attachments && ann.attachments.length > 0 && (
                  <div className="mb-4 space-y-2">
                    <h4 className="text-sm font-semibold flex items-center text-gray-700">
                      <Paperclip className="w-4 h-4 mr-1" /> 附件
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {ann.attachments.map((att: Attachment) => (
                        <a 
                          key={att.id} 
                          href={att.url} 
                          download
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center space-x-1 text-sm bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>{att.filename}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-50">
                  {ann.tags.map((tag: Tag) => (
                    <span key={tag.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                      #{tag.name}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
