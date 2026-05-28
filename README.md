# StreamHub

Landing y flujo base para un servicio de streaming con Next.js App Router.

## Stack
- Next.js (App Router)
- React 19
- Tailwind CSS v4
- pnpm

## Requisitos
- Node.js (LTS recomendado)
- pnpm (`corepack enable` o `npm i -g pnpm`)

## Scripts
- `pnpm install`
- `pnpm dev`
- `pnpm build`
- `pnpm start`
- `pnpm lint`

## Estructura
- `app/`: rutas App Router
- `components/`: UI (atoms, molecules, organisms, templates)
- `app/globals.css`: estilos globales y utilidades custom

## Notas
- `next.config.mjs` tiene `typescript.ignoreBuildErrors = true`.
- `next.config.mjs` tiene `images.unoptimized = true`.
- Tailwind v4 via `postcss.config.mjs` y `@tailwindcss/postcss`.
