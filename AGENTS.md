# AGENTS

## Commands (pnpm)
- Install: `pnpm install`
- Dev server: `pnpm dev`
- Build: `pnpm build`
- Start: `pnpm start`
- Lint: `pnpm lint`

## App structure
- Next.js App Router under `app/`.
- Root layout: `app/layout.tsx` (Providers, Inter font, Analytics, Material Symbols).
- Shared styles: `app/globals.css`.

### Routes

#### `/web` — Tienda principal
Toda la web de la tienda. Layout independiente con Providers y branding.

| Route | File |
|---|---|
| `/web` | `app/web/page.tsx` (home → redirige a `/web/account` si autenticado) |
| `/web/login` | `app/web/login/page.tsx` |
| `/web/catalog` | `app/web/catalog/page.tsx` |
| `/web/checkout` | `app/web/checkout/page.tsx` |
| `/web/product/[slug]` | `app/web/product/[slug]/page.tsx` |
| `/web/account` | `app/web/account/page.tsx` + `layout.tsx` (AuthGuard + sidebar) |
| `/web/account/purchases` | `app/web/account/purchases/page.tsx` |
| `/web/account/active-services` | `app/web/account/active-services/page.tsx` |
| `/web/account/wishlist` | `app/web/account/wishlist/page.tsx` |
| `/web/account/settings` | `app/web/account/settings/page.tsx` |

#### `/admin` — Panel de administración
Redirige a `/admin/login`. Layout con sidebar colapsable y top bar.

| Route | File |
|---|---|
| `/admin` | `app/admin/page.tsx` (Dashboard principal) |
| `/admin/login` | `app/admin/login/page.tsx` |
| `/admin/orders` | `app/admin/orders/page.tsx` |
| `/admin/deliveries` | `app/admin/deliveries/page.tsx` |
| `/admin/payments` | `app/admin/payments/page.tsx` |
| `/admin/coupons` | `app/admin/coupons/page.tsx` |
| `/admin/inventory` | `app/admin/inventory/page.tsx` |
| `/admin/products` | `app/admin/products/page.tsx` |
| `/admin/customers` | `app/admin/customers/page.tsx` |
| `/admin/tickets` | `app/admin/tickets/page.tsx` |
| `/admin/audit` | `app/admin/audit/page.tsx` |
| `/admin/settings` | `app/admin/settings/page.tsx` |

## Component architecture (Atomic Design)

```
components/
  atoms/          — Elementos básicos (botones, iconos, badges)
  molecules/      — Combinaciones simples (form-fields, cards, search-inputs)
  organisms/      — Secciones completas (sidebar, navbar, hero-slider)
    admin/        — Componentes específicos del admin
    account/      — Componentes de la sección de cuenta
    hero-slider/  — Hero slider animado con GSAP
  templates/      — Layouts de página completos
  ui/             — Componentes genéricos shadcn/ui (glass-card, button, input)
  data/           — Datos estáticos (products, hero-slider-data, account)
```

### Admin components
- `atoms/admin-nav-item.tsx` — Item de navegación con Material Symbols
- `atoms/collapse-button.tsx` — Botón toggle sidebar colapsable
- `atoms/metric-card.tsx` — KPI metric card con badge y descripción
- `atoms/status-badge.tsx` — Badge de estado (success/error/warning/neutral)
- `atoms/platform-icon.tsx` — Icono de plataforma con color
- `atoms/empty-state.tsx` — Estado vacío para secciones del dashboard
- `molecules/admin-logo.tsx` — Logo StreamHub Admin Portal
- `molecules/admin-search-input.tsx` — Campo de búsqueda top bar
- `molecules/admin-user-profile.tsx` — Perfil admin en top bar
- `molecules/revenue-chart.tsx` — Gráfico de barras de ingresos (4 filtros)
- `molecules/activity-table.tsx` — Tabla de órdenes recientes (10 filas, menú acciones)
- `molecules/alerts-panel.tsx` — Panel de alertas críticas con timestamps
- `molecules/verify-queue.tsx` — Cola de verificación de pagos (highlight >24h)
- `molecules/inventory-status.tsx` — Estado de inventario (low stock warning)
- `molecules/platform-mix.tsx` — Donut chart de plataformas (6 plataformas)
- `molecules/shortcuts-panel.tsx` — Accesos rápidos (6 acciones)
- `molecules/top-products.tsx` — Top 10 productos (plataforma + ingresos)
- `molecules/customer-growth.tsx` — Gráfico de crecimiento de clientes
- `molecules/recent-activity-feed.tsx` — Timeline de actividad reciente
- `molecules/product-filters.tsx` — Filtros de productos (plataforma, tipo, estado, inventario, precio, orden)
- `molecules/product-table.tsx` — Tabla de productos con selección múltiple (click en row abre drawer)
- `molecules/product-detail-drawer.tsx` — Drawer de detalle de producto (info, precios, inventario, rendimiento, acciones)
- `molecules/create-product-modal.tsx` — Modal de creación de producto (4 pasos: info, precios, inventario, resumen)
- `molecules/inventory-insights.tsx` — Panel de salud del inventario (stock bajo, sin stock, mayor stock)
- `molecules/top-performers.tsx` — Ranking de mejores vendedores (top 5)
- `molecules/product-analytics.tsx` — Analytics de productos (ingresos, plataforma, tendencias)
- `molecules/inventory-tabs.tsx` — Tabs de tipo de inventario (Todo, Cuentas, Perfiles, Códigos, Paquetes)
- `molecules/inventory-filters.tsx` — Filtros de inventario (plataforma, estado, producto, cliente, expiración, orden)
- `molecules/inventory-table.tsx` — Tabla de activos digitales con selección múltiple y acciones
- `molecules/asset-detail-drawer.tsx` — Drawer de detalle de activo (info, credenciales, historial, uso)
- `molecules/create-asset-modal.tsx` — Modal de creación de activo (4 tipos: cuenta, perfil, código, paquete)
- `molecules/inventory-health.tsx` — Dashboard de salud del inventario (distribución, plataformas, expiración)
- `molecules/low-stock-monitoring.tsx` — Monitoreo de stock bajo con tabla y acciones
- `molecules/recent-inventory-activity.tsx` — Timeline de actividad reciente del inventario
- `molecules/inventory-assignment-center.tsx` — Centro de asignación de activos a órdenes
- `molecules/order-tabs.tsx` — Tabs de estado de órdenes (7 estados con conteo)
- `molecules/order-filters.tsx` — Filtros avanzados de órdenes (estado, pago, plataforma, fechas, cliente, valor, orden)
- `molecules/order-table.tsx` — Tabla de órdenes con selección múltiple y menú acciones (click en row abre drawer)
- `molecules/order-detail-drawer.tsx` — Drawer de detalle de orden (info, cliente, productos, pago, inventario, entrega, workflow, notas)
- `molecules/create-order-modal.tsx` — Modal de creación de orden (4 pasos: cliente, producto, pago, resumen)
- `molecules/payment-verification-center.tsx` — Centro de verificación de pagos (5 pendientes, >24h urgent)
- `molecules/inventory-assignment-queue.tsx` — Cola de asignación de inventario (auto/manual)
- `molecules/delivery-queue.tsx` — Cola de entrega de órdenes
- `molecules/order-analytics.tsx` — Analytics de órdenes (donut estados, barras métodos pago, ingresos, volumen)
- `molecules/recent-order-activity.tsx` — Timeline de actividad reciente de órdenes
- `molecules/operational-alerts.tsx` — Panel de alertas operacionales (6 alertas con severidad)
- `molecules/customer-tabs.tsx` — Tabs de estado de clientes (6 estados con conteo)
- `molecules/customer-filters.tsx` — Filtros avanzados de clientes (estado, fechas, valor, órdenes, orden)
- `molecules/customer-table.tsx` — Tabla de clientes con avatar, selección múltiple (click en row abre drawer)
- `molecules/customer-detail-drawer.tsx` — Drawer de perfil de cliente (info, estado, suscripciones, órdenes, pagos, soporte, notas)
- `molecules/create-customer-modal.tsx` — Modal de creación de cliente (3 pasos: info, cuenta, resumen)
- `molecules/customer-analytics.tsx` — Analytics de clientes (crecimiento, segmentos, top clientes, retención)
- `molecules/recent-customer-activity.tsx` — Timeline de actividad reciente de clientes
- `molecules/customer-insights.tsx` — Panel de insights (valor vida, inactivos, expiraciones, compras repetidas)
- `organisms/admin/admin-sidebar.tsx` — Sidebar completa (11 items de navegación)
- `organisms/admin/admin-top-bar.tsx` — Top bar completa (compone AdminSearchInput, AdminUserProfile)

### Web components clave
- `organisms/navbar.tsx` — Navegación principal (usa rutas `/web/*`)
- `organisms/account/account-sidebar.tsx` — Sidebar de cuenta (colapsable, similar a admin)
- `organisms/account/account-layout-client.tsx` — Layout client de cuenta con sidebar
- `organisms/account/auth-guard.tsx` — Guard de autenticación (redirige a `/web/login`)
- `organisms/login-form-card.tsx` — Formulario login (usa `FormField` + `Button`)
- `organisms/hero-slider/` — Hero slider animado con GSAP (4 archivos + index)
- `templates/login-template.tsx` — Layout login con `BrandingSection`

## Lib & Hooks

```
lib/
  api/auth.ts          — Funciones de autenticación (signIn, signUp, signOut, setSessionToken)
  axios.ts             — Instancia de axios configurada
  session-context.tsx  — Context de sesión (useSession, SessionProvider)
  utils.ts             — Utilidad cn() para classnames
hooks/
  use-mobile.ts        — Hook para detectar dispositivo móvil
```

## Config quirks
- `next.config.mjs` sets `typescript.ignoreBuildErrors = true` (type errors won't fail builds).
- `next.config.mjs` sets `images.unoptimized = true` (no Next image optimization).
- `next.config.mjs` allows remote images from `images.unsplash.com` via `images.remotePatterns`.
- `next.config.mjs` proxies `/api/*` to `http://localhost:3001/api/*` (backend server).
- `components.json` configures shadcn/ui (new-york style, lucide icons, cssVariables).

## Styling notes
- Tailwind v4 via `postcss.config.mjs` and `@tailwindcss/postcss`.
- Global styles and custom classes in `app/globals.css`:
  - `.glass-panel` — Glassmorphism (blur + border)
  - `.glass` — Glassmorphism for dashboard cards (border 12% white)
  - `.glass-active` — Active glass state (border 20% white, more blur)
  - `.glow-red` — Box-shadow rojo para elementos activos
  - `.material-symbols-outlined` — Configuración de iconos Material
  - `.platform-accent-*` — Border left colors (netflix, spotify, disney, youtube, hbo)
  - `.custom-scrollbar` — Scrollbar personalizado
  - `.hero-gradient`, `.animated-gradient`, `.service-card`, etc.
- Design tokens in `DESIGN.md` (colores, tipografía, spacing, elevación).
- Surface tokens: `--surface`, `--surface-container`, `--on-surface`, etc.
- shadcn/ui components in `components/ui/` (glass-card, button, input, etc.)

## Notifications
- Use `sileo` for app-wide toast notifications. Example:
  ```ts
  import { sileo } from "sileo"
  sileo.success({ title: "Exito", description: "Operacion completada." })
  sileo.error({ title: "Error", description: "Algo salio mal." })
  ```

## Auth behavior (Admin)
- `localStorage("admin_auth")` controls admin access.
- `true` = authenticated, can access any `/admin/*` route.
- `null`/`false` = not authenticated, redirects to `/admin/login`.
- Set on login: `localStorage.setItem("admin_auth", "true")`.
- Cleared on logout: `localStorage.removeItem("admin_auth")`.

## Routing conventions
- All internal links in `/web` components must use `/web/*` prefix.
- Admin sidebar uses English routes (`/admin/orders`, `/admin/payments`, etc.) but labels are in Spanish.
- `/admin` always redirects to `/admin/login`.
- `/admin/login` renders without sidebar/top bar (layout detects route).
