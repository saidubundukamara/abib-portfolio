'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Youtube from '@tiptap/extension-youtube'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import {
  Bold, Italic, List, ListOrdered, Quote, Minus,
  Heading1, Heading2, Heading3, Link2, ImageIcon,
  Play, Undo2, Redo2,
} from 'lucide-react'

interface Props {
  content?: unknown
  onChange?: (json: unknown) => void
  placeholder?: string
}

function ToolbarBtn({
  onClick,
  active,
  disabled,
  title,
  children,
}: {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick() }}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded transition-colors text-sm ${
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
      } disabled:opacity-30`}
    >
      {children}
    </button>
  )
}

export default function TiptapEditor({ content, onChange, placeholder = 'Start writing…' }: Props) {
  const [linkUrl, setLinkUrl] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ link: false }),
      Image.configure({ inline: false }),
      Link.configure({ openOnClick: false, HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' } }),
      Youtube.configure({ width: 720, height: 405 }),
      Placeholder.configure({ placeholder }),
    ],
    content: (content as object) ?? '',
    onUpdate({ editor }) {
      onChange?.(editor.getJSON())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-sm max-w-none min-h-[200px] focus:outline-none p-4',
      },
    },
  })

  // Sync external content changes (e.g. form reset)
  useEffect(() => {
    if (!editor) return
    if (content && JSON.stringify(editor.getJSON()) !== JSON.stringify(content)) {
      editor.commands.setContent(content as object)
    }
  }, [content]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!editor) return null

  function addLink() {
    if (!linkUrl) return
    editor!.chain().focus().setLink({ href: linkUrl }).run()
    setLinkUrl('')
    setShowLinkInput(false)
  }

  function addYoutube() {
    const url = window.prompt('YouTube URL:')
    if (url) editor!.commands.setYoutubeVideo({ src: url })
  }

  return (
    <div className="rounded-lg border border-input overflow-hidden bg-card">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-border bg-muted/20">
        <ToolbarBtn title="Heading 1" active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          <Heading1 className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn title="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn title="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 className="h-4 w-4" />
        </ToolbarBtn>

        <span className="w-px h-5 bg-border mx-1" />

        <ToolbarBtn title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="h-4 w-4" />
        </ToolbarBtn>

        <span className="w-px h-5 bg-border mx-1" />

        <ToolbarBtn title="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn title="Ordered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn title="Blockquote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn title="Horizontal rule" active={false} onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus className="h-4 w-4" />
        </ToolbarBtn>

        <span className="w-px h-5 bg-border mx-1" />

        <ToolbarBtn
          title="Link"
          active={editor.isActive('link')}
          onClick={() => setShowLinkInput((v) => !v)}
        >
          <Link2 className="h-4 w-4" />
        </ToolbarBtn>

        {/* Cloudinary image upload */}
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          signatureEndpoint="/api/cloudinary/sign"
          onSuccess={(result) => {
            if (result.info && typeof result.info === 'object' && 'secure_url' in result.info) {
              editor.chain().focus().setImage({ src: result.info.secure_url as string }).run()
            }
          }}
        >
          {({ open }) => (
            <ToolbarBtn title="Insert image" active={false} onClick={() => open()}>
              <ImageIcon className="h-4 w-4" />
            </ToolbarBtn>
          )}
        </CldUploadWidget>

        <ToolbarBtn title="YouTube embed" active={false} onClick={addYoutube}>
          <Play className="h-4 w-4" />
        </ToolbarBtn>

        <span className="w-px h-5 bg-border mx-1" />

        <ToolbarBtn title="Undo" active={false} disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn title="Redo" active={false} disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 className="h-4 w-4" />
        </ToolbarBtn>
      </div>

      {/* Link input */}
      {showLinkInput && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/10">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLink() } }}
            placeholder="https://example.com"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            type="button"
            onClick={addLink}
            className="text-xs text-primary hover:text-primary/80 font-medium"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => { editor.chain().focus().unsetLink().run(); setShowLinkInput(false) }}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Remove
          </button>
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  )
}
