# AGENTS

## Commands (pnpm)
- Install: `pnpm install`
- Dev server: `pnpm dev`
- Build: `pnpm build`
- Start: `pnpm start`
- Lint: `pnpm lint`

## App structure
- Next.js App Router under `app/`; home page renders `HomeTemplate` from `components/templates/home-template.tsx`.

## Config quirks
- `next.config.mjs` sets `typescript.ignoreBuildErrors = true` (type errors won't fail builds).
- `next.config.mjs` sets `images.unoptimized = true` (no Next image optimization).
- `next.config.mjs` allows remote images from `images.unsplash.com` via `images.remotePatterns`.

## Styling notes
- Tailwind v4 via `postcss.config.mjs` and `@tailwindcss/postcss`.
- Global styles and custom classes live in `app/globals.css` (including `scroll-behavior: smooth`).
- For any design changes, always align with `DESIGN.md`.

## Notifications
- Use `sileo` for app-wide toast notifications (general toaster). When a notification is needed, implement it with `sileo`.
