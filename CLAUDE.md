# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm start        # Start production server
npm run lint     # ESLint (flat config, v9)
```

No test framework is configured yet.

## Architecture

Full-stack **Designer Portfolio CMS** — a pixel-perfect public frontend (dark-themed, Sawad-style) plus an admin dashboard (Square-UI dashboard-5 replica) for managing all content. See `IMPLEMENTATION_PLAN.md` for the complete spec.

**Stack:** Next.js 16 (App Router), React 19, TypeScript 5, Tailwind v4, MongoDB + Mongoose, NextAuth v5 (credentials), Shadcn/ui, Tiptap (rich text), Cloudinary, Zod, TanStack Table.

### Route Groups

```
src/app/
├── (public)/          # Public-facing site (no auth)
│   ├── page.tsx       # Landing page (all sections)
│   ├── work/          # /work + /work/[slug]
│   └── thoughts/      # /thoughts + /thoughts/[slug]
├── admin/
│   ├── (auth)/        # /admin/login (unprotected)
│   └── (protected)/   # Dashboard + CRUD (auth-guarded)
├── api/cloudinary/sign/  # Signed upload endpoint
├── proxy.ts           # Next.js 16 route guard (replaces middleware)
├── sitemap.ts
└── robots.ts
```

### Key Architectural Patterns

- **Route protection:** `src/app/proxy.ts` (Next.js 16 proxy API, not `middleware.ts`) + `await auth()` check in `src/app/admin/(protected)/layout.tsx`.
- **DB connection:** Cached Mongoose connection via `global.mongoose` in `src/lib/mongodb.ts` (required for serverless cold starts).
- **Server Actions pattern:** All mutations live in `src/server/*/actions.ts`. Each action: auth check → Zod validation → DB mutation → `revalidatePath(...)` → return `{ success, data?, error? }`.
- **Rich text:** Tiptap JSON stored as `Mixed` in MongoDB. Server-side rendering uses `generateHTML` (no client editor on public pages). Admin editor (`src/components/admin/TiptapEditor.tsx`) is `'use client'`.
- **Image uploads:** Cloudinary via `<CldUploadWidget>` (client) → signed by `api/cloudinary/sign/route.ts` → URL saved into Tiptap JSON or model field.

### Design Tokens (Critical for Pixel-Perfect)

Defined in `src/styles/globals.css` using Tailwind v4 `@theme {}`:

| Token | Value |
|-------|-------|
| `--color-bg-primary` | `rgb(21, 19, 18)` — site background |
| `--color-accent-orange` | `rgb(244, 108, 56)` — CTA buttons |
| `--color-accent-lime` | `rgb(197, 255, 65)` — button hover |
| `--font-sans` | Poppins 400/500/600/700 |
| `--font-display` | Satoshi 700 (buttons) |
| `--color-sidebar-bg` | `oklch(0.145 0 0)` — admin sidebar |

Nav pill: `border-radius: 16px`, `rgba(255,255,255,0.03)` bg. Cards: `border-radius: 8px` with 4-layer box-shadow (see plan §3.3).

### Data Models (`src/models/`)

`User` · `Profile` · `Certification` · `Project` · `DesignThought` · `Tool` · `ContactMessage`

`Project` and `DesignThought` both have `slug` (unique), `content` (Tiptap JSON), `published` flag, and `metadata` (OG fields). Project has a `category` enum: `logo-design | event-flyers | motion-graphics | social-media | branding`.

### Admin Seed

```bash
npx tsx scripts/seed-admin.ts   # Creates first admin user
```

### Environment Variables

Required in `.env.local`:
```
MONGODB_URI
NEXTAUTH_SECRET
NEXTAUTH_URL
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
```
