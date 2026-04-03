'use client'

import { useForm, Controller } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useTransition, useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import TiptapEditor from './TiptapEditor'
import { createThought, updateThought } from '@/server/thoughts/actions'
import type { SerializedThought } from '@/types'

interface Props {
  initialData?: SerializedThought
}

type FormValues = {
  title: string
  excerpt: string
  content: unknown
  coverImageUrl: string
  published: boolean
  ogTitle: string
  ogDescription: string
  ogImage: string
}

export default function ThoughtForm({ initialData }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, control, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      title:          initialData?.title          ?? '',
      excerpt:        initialData?.excerpt        ?? '',
      content:        initialData?.content        ?? null,
      coverImageUrl:  initialData?.coverImageUrl  ?? '',
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
        coverImageUrl: values.coverImageUrl,
        published:     values.published,
        metadata: {
          ogTitle:       values.ogTitle,
          ogDescription: values.ogDescription,
          ogImage:       values.ogImage,
        },
      }

      const result = initialData
        ? await updateThought(initialData.id, JSON.parse(JSON.stringify(data)))
        : await createThought(JSON.parse(JSON.stringify(data)))

      if (!result.success) {
        setError(result.error ?? 'Something went wrong')
        return
      }
      router.push('/admin/thoughts')
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
      <Field label="Title">
        <input {...register('title')} className={inputCls} placeholder="Article title" required />
      </Field>

      <Field label="Excerpt">
        <textarea {...register('excerpt')} className={inputCls} rows={2} placeholder="Short description" required />
      </Field>

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

      <Field label="Content">
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <TiptapEditor
              content={field.value}
              onChange={field.onChange}
              placeholder="Write your thoughts…"
            />
          )}
        />
      </Field>

      <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
        <input {...register('published')} type="checkbox" className="rounded border-input" />
        Published
      </label>

      <details className="rounded-lg border border-border">
        <summary className="px-4 py-3 text-sm font-medium text-foreground cursor-pointer select-none">
          SEO / Open Graph
        </summary>
        <div className="px-4 pb-4 space-y-4">
          <Field label="OG Title">
            <input {...register('ogTitle')} className={inputCls} />
          </Field>
          <Field label="OG Description">
            <textarea {...register('ogDescription')} className={inputCls} rows={2} />
          </Field>
          <Field label="OG Image URL">
            <input {...register('ogImage')} className={inputCls} />
          </Field>
        </div>
      </details>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={pending} className={primaryBtnCls}>
          {pending ? 'Saving…' : initialData ? 'Update Thought' : 'Create Thought'}
        </button>
        <button type="button" onClick={() => router.back()} className={outlineBtnCls}>
          Cancel
        </button>
      </div>
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      {children}
    </div>
  )
}

const inputCls = 'w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring'
const primaryBtnCls = 'px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-opacity disabled:opacity-60'
const outlineBtnCls = 'px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-muted/30 transition-colors'
