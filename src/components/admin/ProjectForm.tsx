'use client'

import { useForm, Controller } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useTransition, useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import TiptapEditor from './TiptapEditor'
import { createProject, updateProject } from '@/server/projects/actions'
import { CATEGORY_LABELS, PROJECT_CATEGORIES } from '@/lib/categories'
import type { SerializedProject } from '@/types'

interface Props {
  initialData?: SerializedProject
}

type FormValues = {
  title: string
  excerpt: string
  content: unknown
  category: string
  coverImageUrl: string
  tools: string          // comma-separated
  featured: boolean
  published: boolean
  ogTitle: string
  ogDescription: string
  ogImage: string
}

export default function ProjectForm({ initialData }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, control, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      title:          initialData?.title          ?? '',
      excerpt:        initialData?.excerpt        ?? '',
      content:        initialData?.content        ?? null,
      category:       initialData?.category       ?? PROJECT_CATEGORIES[0],
      coverImageUrl:  initialData?.coverImageUrl  ?? '',
      tools:          (initialData?.tools ?? []).join(', '),
      featured:       initialData?.featured       ?? false,
      published:      initialData?.published      ?? false,
      ogTitle:        initialData?.metadata?.ogTitle        ?? '',
      ogDescription:  initialData?.metadata?.ogDescription  ?? '',
      ogImage:        initialData?.metadata?.ogImage        ?? '',
    },
  })

  const coverImageUrl = watch('coverImageUrl')

  function onSubmit(values: FormValues) {
    setError(null)
    startTransition(async () => {
      const data = {
        title:         values.title,
        excerpt:       values.excerpt,
        content:       values.content,
        category:      values.category,
        coverImageUrl: values.coverImageUrl,
        tools:         values.tools.split(',').map((t) => t.trim()).filter(Boolean),
        featured:      values.featured,
        published:     values.published,
        metadata: {
          ogTitle:       values.ogTitle,
          ogDescription: values.ogDescription,
          ogImage:       values.ogImage,
        },
      }

      const result = initialData
        ? await updateProject(initialData._id, data)
        : await createProject(data)

      if (!result.success) {
        setError(result.error ?? 'Something went wrong')
        return
      }
      router.push('/admin/projects')
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
      {/* Title */}
      <Field label="Title">
        <input
          {...register('title')}
          className={inputCls}
          placeholder="Project title"
          required
        />
      </Field>

      {/* Excerpt */}
      <Field label="Excerpt">
        <textarea
          {...register('excerpt')}
          className={inputCls}
          rows={2}
          placeholder="Short description shown on listing pages"
          required
        />
      </Field>

      {/* Category */}
      <Field label="Category">
        <select {...register('category')} className={inputCls}>
          {PROJECT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat} className="bg-card">{CATEGORY_LABELS[cat]}</option>
          ))}
        </select>
      </Field>

      {/* Cover image */}
      <Field label="Cover Image">
        <div className="flex items-center gap-3">
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            signatureEndpoint="/api/cloudinary/sign"
            onSuccess={(result) => {
              if (result.info && typeof result.info === 'object' && 'secure_url' in result.info) {
                setValue('coverImageUrl', result.info.secure_url as string)
              }
            }}
          >
            {({ open }) => (
              <button type="button" onClick={() => open()} className={outlineBtnCls}>
                Upload image
              </button>
            )}
          </CldUploadWidget>
          {coverImageUrl && (
            <span className="text-xs text-muted-foreground truncate max-w-xs">{coverImageUrl}</span>
          )}
        </div>
        <input {...register('coverImageUrl')} className={`${inputCls} mt-2`} placeholder="Or paste URL" />
      </Field>

      {/* Content */}
      <Field label="Content">
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <TiptapEditor
              content={field.value}
              onChange={field.onChange}
              placeholder="Write about this project…"
            />
          )}
        />
      </Field>

      {/* Tools */}
      <Field label="Tools Used" hint="Comma-separated, e.g. Figma, Illustrator">
        <input {...register('tools')} className={inputCls} placeholder="Figma, Illustrator, After Effects" />
      </Field>

      {/* Flags */}
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
          <input {...register('featured')} type="checkbox" className="rounded border-input" />
          Featured on homepage
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
          <input {...register('published')} type="checkbox" className="rounded border-input" />
          Published
        </label>
      </div>

      {/* SEO / Metadata */}
      <details className="rounded-lg border border-border">
        <summary className="px-4 py-3 text-sm font-medium text-foreground cursor-pointer select-none">
          SEO / Open Graph
        </summary>
        <div className="px-4 pb-4 space-y-4">
          <Field label="OG Title">
            <input {...register('ogTitle')} className={inputCls} placeholder="Override page title for social sharing" />
          </Field>
          <Field label="OG Description">
            <textarea {...register('ogDescription')} className={inputCls} rows={2} placeholder="Override description for social sharing" />
          </Field>
          <Field label="OG Image URL">
            <input {...register('ogImage')} className={inputCls} placeholder="Cloudinary URL for social preview image" />
          </Field>
        </div>
      </details>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={pending} className={primaryBtnCls}>
          {pending ? 'Saving…' : initialData ? 'Update Project' : 'Create Project'}
        </button>
        <button type="button" onClick={() => router.back()} className={outlineBtnCls}>
          Cancel
        </button>
      </div>
    </form>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">
        {label}
        {hint && <span className="ml-2 text-xs text-muted-foreground font-normal">{hint}</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls = 'w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring'
const primaryBtnCls = 'px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-opacity disabled:opacity-60'
const outlineBtnCls = 'px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-muted/30 transition-colors'
