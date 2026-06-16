"use client"

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { FontSize } from './extensions/fontSize'
import { LineHeight } from './extensions/lineHeight'
import { Bold, Italic, Strikethrough, List, ListOrdered, Link as LinkIcon, Heading2, Quote, Undo, Redo } from 'lucide-react'
import { useEffect } from 'react'

export default function RichTextEditor({ content, onChange }: { content: string, onChange: (val: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      TextStyle,
      Color,
      FontSize,
      LineHeight,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto focus:outline-none min-h-[250px] px-4 py-4 max-w-none',
      },
    },
  })

  useEffect(() => {
    if (editor && content === '' && editor.getHTML() !== '<p></p>') {
      editor.commands.setContent('')
    } else if (editor && content && editor.getHTML() === '<p></p>') {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) {
    return <div className="min-h-[250px] border border-gray-300 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">載入編輯器中...</div>
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('輸入連結網址', previousUrl)

    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="border border-gray-300 rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50/80">
        
        {/* 字體大小 */}
        <select 
          className="text-sm border border-gray-300 rounded px-2 py-1 bg-white text-gray-700 outline-none hover:bg-gray-50"
          onChange={(e) => {
            if (e.target.value === 'default') editor.chain().focus().unsetFontSize().run()
            else editor.chain().focus().setFontSize(e.target.value).run()
          }}
          defaultValue="default"
        >
          <option value="default">預設大小</option>
          <option value="12px">12px (小)</option>
          <option value="16px">16px (中)</option>
          <option value="20px">20px (大)</option>
          <option value="24px">24px (特大)</option>
        </select>

        {/* 行距 */}
        <select 
          className="text-sm border border-gray-300 rounded px-2 py-1 bg-white text-gray-700 outline-none hover:bg-gray-50 ml-1"
          onChange={(e) => {
            if (e.target.value === 'default') editor.chain().focus().unsetLineHeight().run()
            else editor.chain().focus().setLineHeight(e.target.value).run()
          }}
          defaultValue="default"
        >
          <option value="default">預設行距</option>
          <option value="1">單行間距</option>
          <option value="1.5">1.5 倍行距</option>
          <option value="2">2 倍行距</option>
        </select>

        {/* 字體顏色 */}
        <input
          type="color"
          onInput={event => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
          value={editor.getAttributes('textStyle').color || '#000000'}
          className="w-8 h-8 p-0 border-0 rounded cursor-pointer ml-1"
          title="文字顏色"
        />

        <div className="w-px h-5 bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${editor.isActive('bold') ? 'bg-gray-200 text-indigo-600' : 'text-gray-600'}`}
          title="粗體"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${editor.isActive('italic') ? 'bg-gray-200 text-indigo-600' : 'text-gray-600'}`}
          title="斜體"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${editor.isActive('strike') ? 'bg-gray-200 text-indigo-600' : 'text-gray-600'}`}
          title="刪除線"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-indigo-600' : 'text-gray-600'}`}
          title="大標題"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${editor.isActive('bulletList') ? 'bg-gray-200 text-indigo-600' : 'text-gray-600'}`}
          title="項目符號"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${editor.isActive('orderedList') ? 'bg-gray-200 text-indigo-600' : 'text-gray-600'}`}
          title="編號清單"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${editor.isActive('blockquote') ? 'bg-gray-200 text-indigo-600' : 'text-gray-600'}`}
          title="引言"
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={setLink}
          className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${editor.isActive('link') ? 'bg-gray-200 text-indigo-600' : 'text-gray-600'}`}
          title="插入連結"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="p-1.5 rounded hover:bg-gray-200 text-gray-600 disabled:opacity-40 transition-colors"
          title="復原"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="p-1.5 rounded hover:bg-gray-200 text-gray-600 disabled:opacity-40 transition-colors"
          title="重做"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>
      
      <div className="bg-white min-h-[250px] cursor-text pb-4" onClick={() => editor.chain().focus().run()}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
