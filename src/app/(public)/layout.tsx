import IconNavPill from '@/components/public/IconNavPill'
import Aurora from '@/components/public/Aurora'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col relative">

      {/* ── Aurora background ── fixed, bleeds through every page */}
      <div
        className="fixed inset-x-0 top-0 h-[60vh] z-0 pointer-events-none select-none"
        style={{
          maskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
          opacity: 0.55,
        }}
      >
        <Aurora
          colorStops={['#F46C38', '#0099FF', '#C5FF41']}
          amplitude={1.1}
          blend={0.55}
          speed={0.5}
        />
      </div>

      {/* ── All page content sits above the aurora ── */}
      <div className="relative z-10 flex flex-col flex-1">
        <IconNavPill />
        <div className="flex-1">{children}</div>
        <footer className="text-center text-text-muted text-xs py-6">
          Abib&nbsp;&middot;&nbsp;Portfolio {new Date().getFullYear()}
        </footer>
      </div>

    </div>
  )
}
