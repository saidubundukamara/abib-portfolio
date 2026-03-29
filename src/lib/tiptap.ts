import { generateHTML } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Youtube from '@tiptap/extension-youtube'

const extensions = [StarterKit, Image, Link, Youtube]

/**
 * Renders a Tiptap JSON document to an HTML string.
 * Safe to call server-side — no client editor is instantiated.
 * Returns '' for null/invalid content.
 */
export function renderTiptap(content: unknown): string {
  if (!content) return ''
  try {
    return generateHTML(content as Parameters<typeof generateHTML>[0], extensions)
  } catch {
    return ''
  }
}
