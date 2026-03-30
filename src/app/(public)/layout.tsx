import IconNavPill from '@/components/public/IconNavPill'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-primary">
      <IconNavPill />
      {children}
    </div>
  )
}
