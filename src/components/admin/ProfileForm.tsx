'use client'

import { useForm } from 'react-hook-form'
import { useTransition, useState } from 'react'
import { CldUploadWidget } from 'next-cloudinary'
import { updateProfile } from '@/server/profile/actions'
import type { SerializedProfile } from '@/types'

interface Props {
  initialData?: SerializedProfile
}

type FormValues = {
  name: string
  title: string
  bio: string
  avatarUrl: string
  dribbble: string
  twitter: string
  instagram: string
  email: string
  yearsOfExperience: number
  projectsCompleted: number
  worldwideClients: number
}

export default function ProfileForm({ initialData }: Props) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const { register, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      name:               initialData?.name               ?? '',
      title:              initialData?.title              ?? '',
      bio:                initialData?.bio                ?? '',
      avatarUrl:          initialData?.avatarUrl          ?? '',
      dribbble:           initialData?.socialLinks?.dribbble  ?? '',
      twitter:            initialData?.socialLinks?.twitter   ?? '',
      instagram:          initialData?.socialLinks?.instagram ?? '',
      email:              initialData?.socialLinks?.email     ?? '',
      yearsOfExperience:  initialData?.yearsOfExperience  ?? 0,
      projectsCompleted:  initialData?.projectsCompleted  ?? 0,
      worldwideClients:   initialData?.worldwideClients   ?? 0,
    },
  })

  const avatarUrl = watch('avatarUrl')

  function onSubmit(values: FormValues) {
    setError(null)
    setSaved(false)
    startTransition(async () => {
      const result = await updateProfile({
        name:   values.name,
        title:  values.title,
        bio:    values.bio,
        avatarUrl: values.avatarUrl,
        socialLinks: {
          dribbble:  values.dribbble,
          twitter:   values.twitter,
          instagram: values.instagram,
          email:     values.email,
        },
        yearsOfExperience: values.yearsOfExperience,
        projectsCompleted: values.projectsCompleted,
        worldwideClients:  values.worldwideClients,
      })

      if (!result.success) {
        setError(result.error ?? 'Something went wrong')
        return
      }
      setSaved(true)
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Name">
          <input {...register('name')} className={inputCls} placeholder="Your name" required />
        </Field>
        <Field label="Title / Role">
          <input {...register('title')} className={inputCls} placeholder="Product Designer" required />
        </Field>
      </div>

      <Field label="Bio">
        <textarea {...register('bio')} className={inputCls} rows={3} placeholder="Short bio" required />
      </Field>

      <Field label="Avatar">
        <div className="flex items-center gap-3 mb-2">
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            signatureEndpoint="/api/cloudinary/sign"
            onSuccess={(result) => {
              if (result.info && typeof result.info === 'object' && 'secure_url' in result.info) {
                setValue('avatarUrl', result.info.secure_url as string)
              }
            }}
          >
            {({ open }) => (
              <button type="button" onClick={() => open()} className={outlineBtnCls}>
                Upload avatar
              </button>
            )}
          </CldUploadWidget>
          {avatarUrl && <span className="text-xs text-muted-foreground truncate max-w-xs">{avatarUrl}</span>}
        </div>
        <input {...register('avatarUrl')} className={inputCls} placeholder="Or paste URL" />
      </Field>

      <div>
        <p className="text-sm font-medium text-foreground mb-3">Stats</p>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Years of Experience">
            <input {...register('yearsOfExperience', { valueAsNumber: true })} type="number" min={0} className={inputCls} />
          </Field>
          <Field label="Projects Completed">
            <input {...register('projectsCompleted', { valueAsNumber: true })} type="number" min={0} className={inputCls} />
          </Field>
          <Field label="Worldwide Clients">
            <input {...register('worldwideClients', { valueAsNumber: true })} type="number" min={0} className={inputCls} />
          </Field>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-foreground mb-3">Social Links</p>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Dribbble URL">
            <input {...register('dribbble')} className={inputCls} placeholder="https://dribbble.com/..." />
          </Field>
          <Field label="Twitter/X URL">
            <input {...register('twitter')} className={inputCls} placeholder="https://x.com/..." />
          </Field>
          <Field label="Instagram URL">
            <input {...register('instagram')} className={inputCls} placeholder="https://instagram.com/..." />
          </Field>
          <Field label="Email">
            <input {...register('email')} className={inputCls} placeholder="hello@example.com" />
          </Field>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {saved && <p className="text-sm text-emerald-400">Profile saved successfully.</p>}

      <button type="submit" disabled={pending} className={primaryBtnCls}>
        {pending ? 'Saving…' : 'Save Profile'}
      </button>
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
