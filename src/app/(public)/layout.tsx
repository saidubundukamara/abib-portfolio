import IconNavPill from '@/components/public/IconNavPill'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <IconNavPill />
      <div className="flex-1">{children}</div>
      <footer className="text-center text-text-muted text-xs py-6">
        Abib&nbsp;&middot;&nbsp;Portfolio {new Date().getFullYear()}
      </footer>
    </div>
  )
}
