'use client'

import { useForm } from 'react-hook-form'
import { useTransition, useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import { createTool, updateTool } from '@/server/tools/actions'
import type { SerializedTool } from '@/types'

interface Props {
  initialData?: SerializedTool
  onDone?: () => void
}

type FormValues = {
  name: string
  description: string
  logoUrl: string
  externalUrl: string
  category: string
  order: number
}

export default function ToolForm({ initialData, onDone }: Props) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      name:        initialData?.name        ?? '',
      description: initialData?.description ?? '',
      logoUrl:     initialData?.logoUrl     ?? '',
      externalUrl: initialData?.externalUrl ?? '',
      category:    initialData?.category    ?? '',
      order:       initialData?.order       ?? 0,
    },
  })

  const logoUrl = watch('logoUrl')

  function onSubmit(values: FormValues) {
    setError(null)
    startTransition(async () => {
      const result = initialData
        ? await updateTool(initialData.id, values)
        : await createTool(values)

      if (!result.success) {
        setError(result.error ?? 'Something went wrong')
        return
      }
      onDone?.()
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Name">
          <input {...register('name')} className={inputCls} placeholder="e.g. Figma" required />
        </Field>
        <Field label="Category">
          <input {...register('category')} className={inputCls} placeholder="e.g. Design" />
        </Field>
      </div>

      <Field label="Description">
        <input {...register('description')} className={inputCls} placeholder="One-line description" />
      </Field>

      <Field label="Logo">
        <div className="flex items-center gap-3 mb-2">
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            signatureEndpoint="/api/cloudinary/sign"
            onSuccess={(result) => {
              if (result.info && typeof result.info === 'object' && 'secure_url' in result.info) {
                setValue('logoUrl', result.info.secure_url as string)
              }
            }}
          >
            {({ open }) => (
              <button type="button" onClick={() => open()} className={outlineBtnCls}>
                Upload logo
              </button>
            )}
          </CldUploadWidget>
          {logoUrl && <span className="text-xs text-muted-foreground truncate max-w-xs">{logoUrl}</span>}
        </div>
        <input {...register('logoUrl')} className={inputCls} placeholder="Or paste URL" />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="External URL">
          <input {...register('externalUrl')} className={inputCls} placeholder="https://figma.com" />
        </Field>
        <Field label="Order">
          <input {...register('order', { valueAsNumber: true })} type="number" className={inputCls} />
        </Field>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3 pt-1">
        <button type="submit" disabled={pending} className={primaryBtnCls}>
          {pending ? 'Saving…' : initialData ? 'Update' : 'Add Tool'}
        </button>
        {onDone && (
          <button type="button" onClick={onDone} className={outlineBtnCls}>
            Cancel
          </button>
        )}
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
