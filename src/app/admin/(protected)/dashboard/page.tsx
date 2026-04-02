import { connectDB } from '@/lib/mongodb'
import { Project } from '@/models/Project'
import { DesignThought } from '@/models/DesignThought'
import { Tool } from '@/models/Tool'
import { Certification } from '@/models/Certification'
import { ContactMessage } from '@/models/ContactMessage'
import { Briefcase, FileText, Wrench, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  await connectDB()

  const [
    totalProjects,
    publishedProjects,
    totalThoughts,
    publishedThoughts,
    totalTools,
    totalCerts,
    totalMessages,
  ] = await Promise.all([
    Project.countDocuments(),
    Project.countDocuments({ published: true }),
    DesignThought.countDocuments(),
    DesignThought.countDocuments({ published: true }),
    Tool.countDocuments(),
    Certification.countDocuments(),
    ContactMessage.countDocuments(),
  ])

  const draftItems = (totalProjects - publishedProjects) + (totalThoughts - publishedThoughts)

  const stats = [
    {
      label: 'Total Projects',
      value: totalProjects,
      sub: `${publishedProjects} published`,
      icon: Briefcase,
      href: '/admin/projects',
      color: 'text-violet-400',
    },
    {
      label: 'Thoughts Published',
      value: publishedThoughts,
      sub: `${totalThoughts} total`,
      icon: FileText,
      href: '/admin/thoughts',
      color: 'text-blue-400',
    },
    {
      label: 'Total Tools',
      value: totalTools,
      sub: `${totalCerts} certifications`,
      icon: Wrench,
      href: '/admin/tools',
      color: 'text-amber-400',
    },
    {
      label: 'Pending / Draft',
      value: draftItems,
      sub: `${totalMessages} messages`,
      icon: MessageSquare,
      href: '/admin/messages',
      color: 'text-cyan-400',
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Overview of your portfolio content</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, sub, icon: Icon, href, color }) => (
          <Link
            key={label}
            href={href}
            className="group block rounded-xl border border-border bg-card p-5 hover:border-border/80 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <p className="text-3xl font-bold text-foreground">{value}</p>
            <p className="text-sm font-medium text-foreground mt-0.5">{label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: 'Add new project', href: '/admin/projects/new' },
              { label: 'Write a thought', href: '/admin/thoughts/new' },
              { label: 'Add a tool', href: '/admin/tools' },
              { label: 'Update profile', href: '/admin/profile' },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
              >
                → {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-3">Content Status</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Published projects</span>
              <span className="text-foreground font-medium">{publishedProjects} / {totalProjects}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Published thoughts</span>
              <span className="text-foreground font-medium">{publishedThoughts} / {totalThoughts}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Draft projects</span>
              <span className="text-amber-400 font-medium">{totalProjects - publishedProjects}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Draft thoughts</span>
              <span className="text-amber-400 font-medium">{totalThoughts - publishedThoughts}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
