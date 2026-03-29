'use client'

import { useState } from 'react'
import ProjectCard from './ProjectCard'
import { PROJECT_CATEGORIES, CATEGORY_LABELS } from '@/lib/categories'
import type { SerializedProject } from '@/types'

interface Props {
  allProjects: SerializedProject[]
}


export default function CategoriesSection({ allProjects }: Props) {
  const [active, setActive] = useState<string>('all')

  const filtered = active === 'all'
    ? allProjects
    : allProjects.filter((p) => p.category === active)

  return (
    <section className="py-20 px-4 max-w-5xl mx-auto">
      {/* Section header */}
      <h2 className="font-bold uppercase tracking-[-0.04em] text-text-secondary text-xs sm:text-sm mb-8">
        Browse by Category
      </h2>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => setActive('all')}
          className={`px-4 py-2 rounded-btn text-sm font-medium transition-colors duration-200 ${
            active === 'all'
              ? 'bg-accent-orange text-white'
              : 'bg-[rgba(255,255,255,0.05)] text-text-secondary hover:text-text-primary border border-[rgba(255,255,255,0.08)]'
          }`}
        >
          All
        </button>
        {PROJECT_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-2 rounded-btn text-sm font-medium transition-colors duration-200 ${
              active === cat
                ? 'bg-accent-orange text-white'
                : 'bg-[rgba(255,255,255,0.05)] text-text-secondary hover:text-text-primary border border-[rgba(255,255,255,0.08)]'
            }`}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Projects grid */}
      {filtered.length === 0 ? (
        <p className="text-text-muted text-sm">No projects in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </section>
  )
}
