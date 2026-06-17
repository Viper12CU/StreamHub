---
name: StreamHub
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#e9bcb6'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#af8782'
  outline-variant: '#5e3f3b'
  surface-tint: '#ffb4aa'
  primary: '#ffb4aa'
  on-primary: '#690003'
  primary-container: '#e50914'
  on-primary-container: '#fff7f6'
  inverse-primary: '#c0000c'
  secondary: '#aec6ff'
  on-secondary: '#002e6b'
  secondary-container: '#508eff'
  on-secondary-container: '#00275e'
  tertiary: '#c6c6c7'
  on-tertiary: '#2f3131'
  tertiary-container: '#717373'
  on-tertiary-container: '#f9f9f9'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad5'
  primary-fixed-dim: '#ffb4aa'
  on-primary-fixed: '#410001'
  on-primary-fixed-variant: '#930007'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#aec6ff'
  on-secondary-fixed: '#001a43'
  on-secondary-fixed-variant: '#004397'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

The visual identity of the design system is centered on a **Cinematic Modern** aesthetic, designed to evoke the premium feel of global entertainment giants while maintaining the reliability of a high-end fintech platform. The experience is tailored for a market that values speed, exclusivity, and digital accessibility.

The style leverages **Glassmorphism** and high-fidelity layering to create depth within a dark, immersive environment. Every interaction should feel fluid and intentional, utilizing subtle gradients and light-leaks to guide the user’s eye toward featured services. The target audience expects a "pro" experience that feels more like an official media portal than a simple marketplace.

## Colors

The palette is anchored in a deep, cinematic **Rich Black (#0D0D0D)** to ensure maximum contrast and visual pop for service artwork. 

- **Primary Red (#E50914):** Used exclusively for high-impact actions, critical branding moments, and "Live" indicators.
- **Secondary Blue (#0070F3):** Functions as the utility accent, used for informational badges, links, and secondary interactive states.
- **Neutral Grays:** A range of cool-toned grays (from #1F2937 to #9CA3AF) are used for text and iconography to prevent visual fatigue.
- **Surface Tints:** Containers use a semi-transparent slate (#111827 at 80% opacity) to facilitate the glassmorphic layering.

## Typography

This design system utilizes **Inter** across all levels to maintain a systematic, utilitarian, and clean appearance. The hierarchy is established through dramatic weight shifts rather than font variety.

- **Display & Headlines:** Use Extra Bold (800) and Bold (700) with tight letter spacing to mimic cinematic titling.
- **Body Text:** Standard weight (400) with generous line heights to ensure legibility against dark backgrounds.
- **Labels:** Medium (600) with uppercase styling and increased tracking for metadata, tags, and small badges.

## Layout & Spacing

The layout follows a **Fluid 12-column grid** system optimized for content discovery. 

- **Desktop:** 12 columns with a 1280px max-width container. 24px gutters and 40px side margins to provide breathing room for high-quality service imagery.
- **Tablet:** 8 columns with 24px margins.
- **Mobile:** 4 columns with 16px margins. 

Spacing follows a geometric scale where `24px (md)` is the standard rhythm for component spacing and `40px (lg)` is the standard for section separation. Horizontal scrolling "carousels" are preferred for service categories on mobile to maximize vertical real estate.

## Elevation & Depth

Depth is achieved through **Glassmorphism and Tonal Layering** rather than traditional drop shadows.

1.  **Level 0 (Base):** Solid #0D0D0D.
2.  **Level 1 (Surface):** Semi-transparent #111827 (80% opacity) with a 12px backdrop-blur and a subtle 1px white border at 10% opacity.
3.  **Level 2 (Active/Float):** Increased transparency (60% opacity) with a more aggressive 24px backdrop-blur and a soft, external glow matching the brand color of the specific service (e.g., a subtle red glow for Netflix cards).

Transitions between these layers must be eased (300ms cubic-bezier) to simulate the feel of a premium OS interface.

## Shapes

The design system uses a **Rounded** shape language to soften the high-contrast dark theme.

- **Standard Elements (Buttons, Inputs):** 0.5rem (8px) corner radius.
- **Large Elements (Service Cards, Modals):** 1rem (16px) corner radius.
- **Pill Elements (Status Badges, Category Chips):** Fully rounded (9999px) to contrast against the structured grid.

## Components

### Service Cards
The core of the store. Cards feature a background image of the service's content with a gradient overlay (bottom-to-top, black-to-transparent). A "Platform Accent" bar (1px top border) uses the specific service's brand color (Spotify Green, Disney Blue, etc.).

### Buttons
- **Primary:** Solid Red (#E50914) with white text. High-contrast, no shadow.
- **Glass:** Transparent background, 1px white border (20% opacity), 12px backdrop-blur. Used for secondary actions.

### Input Fields
Dark backgrounds (#111827) with a subtle bottom-border only. When focused, the border transitions to Blue (#0070F3) with a soft glow.

### Trust Badges
Small, semi-transparent chips with a "Verified" icon. Use a subtle metallic gradient (Silver or Gold) to denote premium security and reliable account delivery.

### Status Indicators
Small glowing dots (CSS pulse animation) next to service names to indicate "Instant Delivery" or "In Stock" status.

## Icon System

StreamHub uses **Material Design Icons (MDI)** as the primary icon library, with **Material Symbols** as a secondary option for Google-specific icons.

### Primary: MDI (Material Design Icons)
- **Library:** `mdi` — 7,447 icons, Apache 2.0 license
- **CDN:** `https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css`
- **Usage:** `<Icon name="netflix" library="mdi" />` renders `<span class="mdi mdi-netflix">`
- **Categories:** Streaming/movie icons (`movie-open-play`, `play-box-lock`), brand icons (`netflix`, `spotify`, `disney-plus`), general UI

### Secondary: Material Symbols
- **Library:** `material` — Google's variable icon font
- **CDN:** Google Fonts API
- **Usage:** `<Icon name="shopping_cart" library="material" />` renders `<span class="material-symbols-outlined">shopping_cart</span>`
- **Use case:** Google-specific icons not available in MDI

### Icon Component
```tsx
import { Icon } from "@/components/atoms/icon"

// MDI (default)
<Icon name="netflix" />
<Icon name="movie-open-play" size="lg" className="text-primary" />

// Material Symbols
<Icon name="shopping_cart" library="material" />
<Icon name="bolt" library="material" filled />
```

### Naming Convention
- **MDI:** Use kebab-case without `mdi-` prefix (e.g., `"movie-open-play"`, `"netflix"`)
- **Material:** Use snake_case (e.g., `"shopping_cart"`, `"arrow_forward"`)

### Size Classes
| Token | Class |
|---|---|
| `xs` | `text-xs` (12px) |
| `sm` | `text-sm` (14px) |
| `md` | `text-base` (16px) |
| `lg` | `text-lg` (18px) |
| `xl` | `text-xl` (20px) |
| `2xl` | `text-2xl` (24px) |
| `3xl` | `text-3xl` (30px) |
| `4xl` | `text-4xl` (36px) |

### Streaming Platform Icons (MDI)
| Platform | Icon Name |
|---|---|
| Netflix | `netflix` |
| Spotify | `spotify` |
| Disney+ | `disney-plus` |
| YouTube | `youtube` |
| HBO Max | `hbo` |
| Amazon Prime | `amazon` |
| Apple TV+ | `apple` |