'use client'

import { useForm } from 'react-hook-form'
import { useTransition, useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import { createCertification, updateCertification } from '@/server/certifications/actions'
import type { SerializedCertification } from '@/types'

interface Props {
  initialData?: SerializedCertification
  onDone?: () => void
}

type FormValues = {
  name: string
  issuer: string
  year: number
  credentialUrl: string
  badgeImageUrl: string
  order: number
}

export default function CertificationForm({ initialData, onDone }: Props) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      name:          initialData?.name          ?? '',
      issuer:        initialData?.issuer        ?? '',
      year:          initialData?.year          ?? new Date().getFullYear(),
      credentialUrl: initialData?.credentialUrl ?? '',
      badgeImageUrl: initialData?.badgeImageUrl ?? '',
      order:         initialData?.order         ?? 0,
    },
  })

  const badgeImageUrl = watch('badgeImageUrl')

  function onSubmit(values: FormValues) {
    setError(null)
    startTransition(async () => {
      const result = initialData
        ? await updateCertification(initialData._id, values)
        : await createCertification(values)

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
          <input {...register('name')} className={inputCls} placeholder="Certification name" required />
        </Field>
        <Field label="Issuer">
          <input {...register('issuer')} className={inputCls} placeholder="e.g. Google" required />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Year">
          <input
            {...register('year', { valueAsNumber: true })}
            type="number"
            className={inputCls}
            min={1900}
            max={2100}
            required
          />
        </Field>
        <Field label="Order">
          <input {...register('order', { valueAsNumber: true })} type="number" className={inputCls} />
        </Field>
      </div>

      <Field label="Credential URL">
        <input {...register('credentialUrl')} className={inputCls} placeholder="https://..." />
      </Field>

      <Field label="Badge Image">
        <div className="flex items-center gap-3 mb-2">
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            signatureEndpoint="/api/cloudinary/sign"
            onSuccess={(result) => {
              if (result.info && typeof result.info === 'object' && 'secure_url' in result.info) {
                setValue('badgeImageUrl', result.info.secure_url as string)
              }
            }}
          >
            {({ open }) => (
              <button type="button" onClick={() => open()} className={outlineBtnCls}>
                Upload badge
              </button>
            )}
          </CldUploadWidget>
          {badgeImageUrl && <span className="text-xs text-muted-foreground truncate max-w-xs">{badgeImageUrl}</span>}
        </div>
        <input {...register('badgeImageUrl')} className={inputCls} placeholder="Or paste URL" />
      </Field>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3 pt-1">
        <button type="submit" disabled={pending} className={primaryBtnCls}>
          {pending ? 'Saving…' : initialData ? 'Update' : 'Add Certification'}
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
