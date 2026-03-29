# Designer Portfolio CMS — Implementation Plan

## Context

Building a full-stack portfolio website for a Product/Graphics/Motion designer. The site needs a stunning dark-themed public frontend (pixel-perfect replica of [sawad.framer.website](https://sawad.framer.website/)) and a clean admin dashboard (pixel-perfect replica of [square-ui dashboard-5](https://github.com/ln-dev7/square-ui/tree/master/templates-baseui/dashboard-5)) for managing all content. Content includes: Bio, Certifications, Projects (with category tagging), Tools, and Design Thoughts — both Projects and Thoughts use a Medium-like rich text editor with image/link support via Cloudinary.

**Tech Stack:** Next.js 16+, NextAuth v5 (credentials), MongoDB + Mongoose, Shadcn/ui, Tailwind v4, Cloudinary (next-cloudinary), Tiptap (rich text), Zod (validation)

---

## Phase 1 — Project Setup & Infrastructure

### 1.1 Initialize Project

```bash
npx create-next-app@latest portfolio --typescript --tailwind --app --src-dir
cd portfolio
```

### 1.2 Install Dependencies

```bash
# Core
npm install mongoose next-auth@beta @auth/nextjs bcryptjs

# UI
npx shadcn@latest init
npm install class-variance-authority clsx tailwind-merge

# Rich text
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image \
  @tiptap/extension-link @tiptap/extension-youtube @tiptap/extension-placeholder \
  @tiptap/extension-character-count

# Cloudinary
npm install next-cloudinary cloudinary

# Forms & validation
npm install zod react-hook-form @hookform/resolvers

# Icons & fonts
npm install lucide-react @fontsource/poppins

# Utilities
npm install slugify date-fns
```

### 1.3 Environment Variables (`.env.local`)

```env
MONGODB_URI=mongodb+srv://...
NEXTAUTH_SECRET=<32-char random string>
NEXTAUTH_URL=http://localhost:3000

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=portfolio_uploads
```

### 1.4 Tailwind + Design Tokens

Configure `globals.css` with the exact Sawad color palette and typography to use as CSS custom properties:

```css
/* src/styles/globals.css */
@import "tailwindcss";

@theme {
  /* Sawad Portfolio Exact Colors */
  --color-bg-primary: rgb(21, 19, 18);        /* Deep charcoal */
  --color-text-primary: rgb(255, 255, 255);
  --color-text-secondary: rgb(106, 107, 110);
  --color-text-muted: rgb(153, 143, 143);
  --color-accent-orange: rgb(244, 108, 56);   /* Primary CTA */
  --color-accent-lime: rgb(197, 255, 65);     /* Hover state */
  --color-accent-cyan: rgb(0, 153, 255);      /* Links */
  --color-overlay-white: rgba(255,255,255,0.1);

  /* Admin Panel Colors (Square UI) */
  --color-sidebar-bg: oklch(0.145 0 0);
  --color-card-bg: oklch(0.18 0 0);
  --color-border: oklch(1 0 0 / 10%);

  /* Typography */
  --font-sans: "Poppins", sans-serif;
  --font-display: "Satoshi", sans-serif;

  /* Border radius system */
  --radius-btn: 8px;
  --radius-card: 8px;
  --radius-nav: 16px;
}
```

Load **Poppins** (400, 500, 600, 700) and **Satoshi** (700) via `next/font/google` in the root layout.

---

## Phase 2 — Database Models

**File locations:** `src/models/`

### 2.1 `User.ts`
Fields: `email`, `password` (bcrypt hashed), `name`, `role: 'admin'`

### 2.2 `Profile.ts`
Fields: `name`, `title`, `bio` (short plain text), `avatarUrl` (Cloudinary), `socialLinks` (object: dribbble, twitter, instagram, email), `yearsOfExperience`, `projectsCompleted`, `worldwideClients`

### 2.3 `Certification.ts`
Fields: `name`, `issuer`, `year`, `credentialUrl`, `badgeImageUrl` (Cloudinary), `order`

### 2.4 `Project.ts`
```typescript
{
  title: String,
  slug: String (unique),
  excerpt: String,
  content: Mixed,         // Tiptap JSON doc
  category: Enum(['logo-design','event-flyers','motion-graphics','social-media','branding']),
  coverImageUrl: String,  // Cloudinary
  images: [String],       // Additional Cloudinary URLs
  tools: [String],        // Tool names used
  featured: Boolean,
  published: Boolean,
  publishedAt: Date,
  metadata: { ogTitle, ogDescription, ogImage },
  createdAt, updatedAt
}
```

### 2.5 `DesignThought.ts`
```typescript
{
  title: String,
  slug: String (unique),
  excerpt: String,
  content: Mixed,         // Tiptap JSON doc
  coverImageUrl: String,
  readTime: Number,       // auto-calculated on save
  published: Boolean,
  publishedAt: Date,
  metadata: { ogTitle, ogDescription, ogImage },
  createdAt, updatedAt
}
```

### 2.6 `Tool.ts`
```typescript
{
  name: String,
  description: String,   // Short (1 sentence)
  logoUrl: String,       // Cloudinary
  externalUrl: String,
  category: String,
  order: Number
}
```

### 2.7 `ContactMessage.ts`
```typescript
{
  name, email, budget, message, createdAt
}
```

**Shared:** `src/lib/mongodb.ts` — cached Mongoose connection using `global.mongoose` pattern for serverless.

---

## Phase 3 — Public Frontend (Pixel-Perfect Sawad)

### 3.1 Route Structure

```
src/app/(public)/
├── layout.tsx          # Nav + Footer, Poppins/Satoshi fonts
├── page.tsx            # / — Landing page (all sections)
├── work/
│   ├── page.tsx        # /work — All projects, with category filter
│   └── [slug]/
│       ├── page.tsx    # /work/[slug] — Project detail + rich text render
│       └── opengraph-image.tsx
├── thoughts/
│   ├── page.tsx        # /thoughts — All design thoughts
│   └── [slug]/
│       ├── page.tsx    # /thoughts/[slug] — Article with rich text render
│       └── opengraph-image.tsx
```

### 3.2 Landing Page (`/`) Sections

Build each as its own component in `src/components/public/`:

| Component | Description |
|-----------|-------------|
| `<NavBar>` | Fixed top, `backdrop-blur`, `bg-white/3`, `rounded-2xl`, nav links, orange CTA button. Collapses to hamburger at <810px |
| `<HeroSection>` | Full viewport. Profile name (Poppins 700 / 36px responsive to 90px), subtitle (gray), large title, 3-col stats (70px Poppins 600), social icon links |
| `<SkillsSection>` | Animated text marquee showing design disciplines |
| `<ProjectsSection>` | "RECENT PROJECTS" header, 3-col responsive grid of `<ProjectCard>` components, "View All" CTA |
| `<CategoriesSection>` | Filter tabs for the 5 categories, updates grid |
| `<ExperienceSection>` | Timeline cards: company, role, date range |
| `<ToolsSection>` | "PREMIUM TOOLS" — 2–3 col grid of tool cards (logo, name, description, external link) |
| `<ThoughtsSection>` | Blog card list: title, date, read time. Links to `/thoughts/[slug]` |
| `<ContactSection>` | "LET'S WORK TOGETHER" — form with Name, Email, Budget (select), Message, Submit (orange button) |
| `<Footer>` | Minimal, dark, copyright |

### 3.3 Visual Spec (Critical for Pixel-Perfect)

- **Background:** `rgb(21, 19, 18)` everywhere
- **Nav pill:** `border-radius: 16px`, `bg: rgba(255,255,255,0.03)`
- **All buttons:** `border-radius: 8px`, orange bg, white Satoshi 700 14px text; hover changes bg to lime `rgb(197, 255, 65)` with color transition
- **Cards (project/tools/thoughts):** `border-radius: 8px`, multi-layer box-shadow system:
  ```css
  box-shadow: 0px 0.64px 1.15px -1.125px rgba(0,0,0,0.26),
              0px 1.93px 3.48px -2.25px rgba(0,0,0,0.24),
              0px 5.11px 9.19px -3.375px rgba(0,0,0,0.19),
              0px 16px 28.8px -4.5px rgba(0,0,0,0.03);
  ```
- **Stats numbers:** Poppins 600, 70px, `letter-spacing: -0.01em`
- **Section headers:** Poppins 700, uppercase, `letter-spacing: -0.04em`
- **Nav items:** Poppins 400, 12px
- **Category filter active:** orange accent underline or background pill

### 3.4 Category Filter Page (`/work`)

- Sidebar or tab-bar filter: All | Logo Design | Event Flyers | Motion Graphics | Social Media Campaigns | Branding
- URL query param: `/work?category=branding`
- Server component reads query, filters from MongoDB

### 3.5 Project/Thought Detail Pages

- Large cover image (CldImage, full width)
- Title, meta (date, category), excerpt
- **Tiptap JSON → HTML renderer** (`@tiptap/react` `generateHTML` function server-side, no client editor needed)
- Cloudinary images within rich text rendered via `<CldImage>` with fallback to `<img>`
- Back link, related projects (same category)

---

## Phase 4 — Admin Panel (Pixel-Perfect Square-UI Dashboard-5)

### 4.1 Admin Route Structure

```
src/app/admin/
├── (auth)/
│   ├── login/page.tsx          # /admin/login
│   └── layout.tsx              # No auth check
├── (protected)/
│   ├── layout.tsx              # Auth check → redirect to /admin/login
│   ├── dashboard/page.tsx      # /admin/dashboard
│   ├── projects/
│   │   ├── page.tsx            # List all projects (table)
│   │   ├── new/page.tsx        # Create project form
│   │   └── [id]/page.tsx       # Edit project form
│   ├── thoughts/
│   │   ├── page.tsx
│   │   ├── new/page.tsx
│   │   └── [id]/page.tsx
│   ├── tools/page.tsx          # CRUD tools (simpler form, no rich text)
│   ├── certifications/page.tsx
│   └── profile/page.tsx        # Edit bio, stats, social links
```

### 4.2 Admin Layout (Square-UI Replica)

Replicate the square-ui dashboard-5 layout exactly:

| Element | Spec |
|---------|------|
| Background | `oklch(0.145 0 0)` (near-black) |
| Sidebar width | ~240px fixed, collapsible on mobile |
| Sidebar items | Search `/`, Dashboard (active state), Projects, Thoughts, Tools, Certifications, Profile, Settings |
| Sidebar icons | HugeIcons or Lucide with semantic colors (violet, blue, amber, cyan, emerald, orange) |
| Sidebar footer | Promo card or app name card |
| Header | breadcrumb + user avatar + theme toggle |
| Content area | `overflow-auto`, rounded cards with `oklch` colors, subtle borders |
| Cards | `rounded-xl`, `border border-border`, `p-4`, flat (no heavy shadow) |
| Theme | Dark default, light mode toggle via `.dark` class |

### 4.3 Dashboard Stats Cards

4-up grid (responsive: 1 → 2 → 4 cols):
- Total Projects
- Total Thoughts Published
- Total Tools
- Pending/Draft items

### 4.4 Project/Thought Management Tables

Using `@tanstack/react-table` for sortable, filterable tables:
- Columns: Checkbox, Title, Category/Tag, Status badge (Published/Draft), Date, Actions (Edit/Delete)
- Status badges: cyan = published, amber = draft
- Pagination (5/10/20 rows), search input
- Row click → edit page

### 4.5 Rich Text Editor (Tiptap — Admin Only)

Component: `src/components/admin/TiptapEditor.tsx` — `'use client'`

Extensions:
- `StarterKit` (headings H1-H3, bold, italic, lists, blockquote, code, horizontal rule)
- `Image` — with Cloudinary upload via `<CldUploadWidget>`
- `Link` — autolink, paste support, open in new tab toggle
- `YouTube` — embed by URL
- `Placeholder` — "Start writing..."

Toolbar buttons: H1/H2/H3, Bold, Italic, BulletList, OrderedList, Blockquote, Link, Image Upload, YouTube, Undo/Redo

**Image upload flow:**
1. User clicks image button → CldUploadWidget opens
2. On success → `editor.chain().focus().setImage({ src: cloudinaryUrl }).run()`
3. Image stored as Cloudinary URL in Tiptap JSON

**Storage:** `editor.getJSON()` → stored as `Mixed` in MongoDB

### 4.6 Authentication Flow

- `src/auth.ts` — NextAuth v5 with Credentials provider, bcrypt comparison against MongoDB `User` collection
- `src/app/proxy.ts` — Next.js 16+ proxy (replaces middleware) to protect `/admin/*` routes
- Admin layout double-check with `await auth()` server-side
- Login page: email + password form, `signIn('credentials', ...)`, redirect to `/admin/dashboard`
- Seed script: `scripts/seed-admin.ts` — creates first admin user

### 4.7 Server Actions

All mutations in `src/server/*/actions.ts` pattern:

```
src/server/
├── projects/actions.ts   # createProject, updateProject, deleteProject, togglePublish
├── thoughts/actions.ts   # same shape
├── tools/actions.ts
├── profile/actions.ts
├── contact/actions.ts    # saveContactMessage
└── auth/actions.ts       # login, logout
```

Each action: 1) `auth()` check, 2) Zod validation, 3) DB mutation, 4) `revalidatePath(...)`, 5) return `{ success, data?, error? }`

### 4.8 Cloudinary Signed Upload Route

`src/app/api/cloudinary/sign/route.ts` — generates signed upload parameters for secure client uploads.

---

## Phase 5 — SEO & OpenGraph

### 5.1 Static Metadata (Root Layout)

```typescript
// app/(public)/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://yourportfolio.com'),
  title: { default: 'Designer Name | Portfolio', template: '%s | Designer Name' },
  description: '...',
  openGraph: { type: 'website', ... },
  twitter: { card: 'summary_large_image', ... },
}
```

### 5.2 Dynamic Metadata

Each `page.tsx` exports `generateMetadata()` that:
1. Fetches the item (project/thought) by slug
2. Returns `title`, `description`, `openGraph.images` using Cloudinary OG image URL
3. Sets `alternates.canonical`

### 5.3 Dynamic OG Images

`opengraph-image.tsx` in each `[slug]` folder using Next.js ImageResponse with the project's cover image and title overlaid.

### 5.4 Sitemap & Robots

- `src/app/sitemap.ts` — dynamic sitemap from DB (all published projects + thoughts)
- `src/app/robots.ts` — allow public, disallow `/admin`
- `public/manifest.json` — PWA metadata

---

## Phase 6 — Project Structure Summary

```
src/
├── app/
│   ├── (public)/           # Public frontend
│   ├── admin/              # Admin panel
│   ├── api/                # API routes (cloudinary sign, etc.)
│   ├── proxy.ts            # Next.js 16+ route guard
│   ├── layout.tsx
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── public/             # Frontend sections
│   ├── admin/              # Admin forms, tables, TiptapEditor
│   └── ui/                 # shadcn components (customized)
├── lib/
│   ├── mongodb.ts          # Cached connection
│   ├── cloudinary.ts       # Server-side utils
│   ├── tiptap.ts           # generateHTML helper for server rendering
│   ├── cn.ts
│   └── seo.ts
├── models/                 # Mongoose models
├── server/                 # Server actions
├── styles/
│   └── globals.css         # Design tokens + Tailwind
├── types/
└── auth.ts                 # NextAuth config
scripts/
└── seed-admin.ts           # Create first admin user
```

---

## Phase 7 — Build Order (Recommended)

1. **Infra first:** DB connection, models, auth (NextAuth + credentials + proxy guard)
2. **Admin panel shell:** Layout, sidebar, login page, protected routes
3. **Profile/Tools admin:** Simple forms first (no rich text) to test full stack
4. **Tiptap editor:** Wire up editor + Cloudinary image upload
5. **Projects/Thoughts admin:** Full CRUD with Tiptap
6. **Public frontend:** Start with design tokens, fonts, nav, hero — pixel-perfect by section
7. **Individual pages:** Project/Thought detail with rich text renderer
8. **SEO layer:** Metadata, OG images, sitemap
9. **Polish:** Animations (hover transitions on buttons/cards), mobile responsiveness at all 4 breakpoints

---

## Verification Checklist

### Frontend Pixel-Perfect Checks
- [ ] Background is exactly `rgb(21, 19, 18)` — not pure black
- [ ] Poppins font loaded at weights 400/500/600/700; Satoshi at 700 for buttons
- [ ] Orange CTA buttons `rgb(244, 108, 56)` transition to lime `rgb(197, 255, 65)` on hover
- [ ] Nav bar has `border-radius: 16px` with `rgba(255,255,255,0.03)` bg
- [ ] Stats section: 70px Poppins 600, `-0.01em` letter spacing
- [ ] Card shadow: 4-layer system as specified
- [ ] Responsive at 1440px, 1080px, 810px, <810px breakpoints

### Admin Panel Checks
- [ ] Sidebar uses `oklch(0.145 0 0)` background
- [ ] Stats cards: `rounded-xl`, flat border style, no heavy shadow
- [ ] Tables use TanStack Table with sort/filter/pagination
- [ ] Status badges: cyan = published, amber = draft
- [ ] Both light and dark mode work

### Functional Checks
- [ ] Cannot access `/admin/*` without being logged in
- [ ] Rich text editor saves Tiptap JSON to MongoDB
- [ ] Images uploaded via Cloudinary widget appear in editor and on public site
- [ ] Projects filterable by category on `/work` page
- [ ] Published projects/thoughts appear on public site; drafts do not
- [ ] Contact form saves message to DB
- [ ] `generateMetadata` produces correct OG title/description/image for projects and thoughts
- [ ] Sitemap includes all published content
- [ ] `revalidatePath` is called after mutations so public pages reflect changes immediately

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/auth.ts` | NextAuth v5 config |
| `src/app/proxy.ts` | Admin route protection |
| `src/lib/mongodb.ts` | Mongoose connection cache |
| `src/models/Project.ts` | Project schema |
| `src/models/DesignThought.ts` | Thought schema |
| `src/components/admin/TiptapEditor.tsx` | Rich text editor |
| `src/components/public/HeroSection.tsx` | Landing hero |
| `src/components/public/NavBar.tsx` | Fixed navigation |
| `src/server/projects/actions.ts` | Project mutations |
| `src/app/(public)/work/[slug]/page.tsx` | Project detail + SEO |
| `src/app/(public)/thoughts/[slug]/page.tsx` | Thought detail + SEO |
| `src/app/admin/(protected)/layout.tsx` | Auth guard |
| `scripts/seed-admin.ts` | First-run admin seeder |
