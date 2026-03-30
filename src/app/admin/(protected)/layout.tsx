import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import AdminSidebarClient from '@/components/admin/AdminSidebarClient'
import AdminHeader from '@/components/admin/AdminHeader'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/admin/login')

  return (
    <div id="admin-shell" className="dark flex h-screen overflow-hidden bg-background">
      <AdminSidebarClient />
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <AdminHeader user={session.user ?? {}} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
