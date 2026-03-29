/**
 * Project category constants — plain values only, no Mongoose dependency.
 * Safe to import from both Server and Client Components.
 */
export const PROJECT_CATEGORIES = [
  'logo-design',
  'event-flyers',
  'motion-graphics',
  'social-media',
  'branding',
] as const

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number]

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  'logo-design':     'Logo Design',
  'event-flyers':    'Event Flyers',
  'motion-graphics': 'Motion Graphics',
  'social-media':    'Social Media',
  'branding':        'Branding',
}
