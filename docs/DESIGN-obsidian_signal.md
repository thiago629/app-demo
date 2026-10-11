---
name: Obsidian Signal
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f21'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#c4c7c8'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3131'
  primary-container: '#e2e2e2'
  on-primary-container: '#636565'
  inverse-primary: '#5d5f5f'
  secondary: '#c3c7ce'
  on-secondary: '#2c3136'
  secondary-container: '#45494f'
  on-secondary-container: '#b4b9bf'
  tertiary: '#ffffff'
  on-tertiary: '#32302d'
  tertiary-container: '#e7e1dd'
  on-tertiary-container: '#676460'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#dfe3ea'
  secondary-fixed-dim: '#c3c7ce'
  on-secondary-fixed: '#171c21'
  on-secondary-fixed-variant: '#43474d'
  tertiary-fixed: '#e7e1dd'
  tertiary-fixed-dim: '#cbc6c1'
  on-tertiary-fixed: '#1d1b19'
  on-tertiary-fixed-variant: '#494643'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.015em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 23px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: -0.005em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 17px
    letterSpacing: 0em
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-technical:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.08em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-sm: 0.75rem
  margin: 1rem
  margin-sm: 0.75rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

The design system establishes a distilled, hyper-refined editorial atmosphere tailored for real-time discourse, intelligence sharing, and minimalist content discovery. Drawing inspiration from modern high-contrast brutalism and Swiss precision typography, the visual tone eliminates ornamental noise to amplify authored thought, breaking developments, and media assets.

### Target Audience & Persona
Curated for design-conscious professionals, journalists, technologists, and digital minimalists who value immediate utility, typographic restraint, and rapid scanning over sensory overstimulation.

### Aesthetic Tone
- **Monochrome Precision:** Dominance of pure obsidian planes juxtaposed with pristine typographic marks.
- **Razor Sharpness:** Exact 1px micro-borders, stark horizontal rules, and geometric consistency reminiscent of prestige editorial prints.
- **Discreet Technical Markers:** Understated tracking, micro uppercase labels, and restrained systemic signifiers (such as `DEMO · APP DE PRUEBA`).

## Colors

The palette is engineered exclusively for an OLED dark landscape, ensuring high-contrast legibility while avoiding visual fatigue.

### Color Tokens & Semantic Architecture
- **Base Canvas (`#0B0B0D`):** Absolute deep pitch black ground plane across root containers, full-screen sheets, and timeline feeds.
- **Card & Surface Primary (`#16161A`):** Elevates floating surfaces, quote cards, bottom sheets, and nested compose wrappers.
- **Subtle Surface & Hover (`#222228`):** Applied to active pressed states, avatar backdrops, and active navigational pills.
- **Text & Action Primary (`#FAFAFA`):** Crisp pure white applied to headline type, primary CTA fills, and active icons.
- **Accent & Structural Border (`#C3C7CE`):** Platinum silver accent used for hairline borders (often at 15–30% opacity), verified insignias, unread thread pips, and focused strokes.
- **Secondary Muted Text (`#8B8E96`):** Balanced mid-gray for timestamps, handles (`@handle`), and character counts.
- **Structural Divider Line (`rgba(195, 199, 206, 0.12)`): Ultra-crisp 1px horizontal and vertical separators.

## Typography

Inter serves as the singular typeface across all hierarchical roles to maintain razor-sharp Swiss structural discipline. 

- **Tracking Architecture:** Negative tracking on headlines ensures punchy, assertive display text. Micro tags and metadata badges invert this logic by applying positive tracking (`+0.08em`) to all-caps indicators (`DEMO · APP DE PRUEBA`).
- **Punctuation & Numerics:** Tabular figures are enforced for metric counters (reposts, likes, view counts) to eliminate visual jitter during real-time timeline updates.
- **Weight Pairing:** Body copy strictly remains at `400` weight to preserve optical clarity on high-DPI OLED screens against deep black grounds.

## Layout & Spacing

The mobile layout system operates strictly on a continuous 4px/8px modular vertical rhythm, maintaining tight horizontal margins to maximize horizontal real estate on handheld devices.

### Layout Mechanics
- **Mobile Feed Columns:** Single fluid column spanning 100% of viewport width within edge-to-edge full bleed horizontal rules. Feed items do not nest inside floating rounded islands by default; instead, items span full viewport width separated by hairlines to maximize text reading area.
- **Side Nav & Modal Drawers:** Fixed gutter width of `16px` on phone viewports; expanding to max-width `420px` centered column containers when rendered on tablets or larger display ports.
- **Safe Area Anchors:** Navigation bars and composer bottom docks strictly incorporate hardware safe-area insets (`env(safe-area-inset-bottom)`) with translucent background blurring.

## Elevation & Depth

This design system deliberately rejects heavy diffuse drop shadows and glow effects in favor of **structural line definition and surface tiering**.

### Layer Stacking Model
- **Base Canvas (`Level 0`):** Pitch black `#0B0B0D`.
- **Card & Inset Containers (`Level 1`):** `#16161A` surface with an ultra-fine border: `1px solid rgba(195, 199, 206, 0.16)`. No drop shadow.
- **Floating Modals & Sheets (`Level 2`):** `#16161A` backed by an ultra-thin perimeter stroke of `1px solid rgba(195, 199, 206, 0.28)` and a faint structural contact shadow (`0px 8px 24px rgba(0, 0, 0, 0.85)`).
- **Navigation Chrome & Top Bars (`Level 3`):** Translucent pitch black (`rgba(11, 11, 13, 0.82)`) paired with `backdrop-filter: blur(20px)` and a bottom border of `1px solid rgba(195, 199, 206, 0.12)`.

## Shapes

The interface balances sharp industrial edges with subtle functional radii to ensure a modern, high-precision aesthetic.

- **Primary Containers & Modals:** `roundedness: 1` (`0.25rem` / 4px base radius; up to `0.5rem` / 8px on secondary cards and contextual sheets).
- **Interactive Action Pills:** Primary buttons, user follow buttons, and search chips selectively adopt pure pill rounding (`9999px`) to create an immediate visual distinction between interactive CTA affordances and static structural layout containers.
- **Media Thumbnails:** Edge-to-edge or strictly `0.25rem` corner radius with a crisp inset border (`inset 0 0 0 1px rgba(195, 199, 206, 0.15)`).

## Components

### Buttons
- **Primary CTA:** Solid crisp white background (`#FAFAFA`), deep obsidian text (`#0B0B0D`), font weight `600`, pill radius (`9999px`), 0 16px horizontal padding. Active state scales down to `0.97` transform.
- **Secondary / Outline:** Background transparent, text `#FAFAFA`, border `1px solid rgba(195, 199, 206, 0.32)`, hover background `#16161A`.
- **Icon / Ghost:** Pitch black ground, icon color `#C3C7CE`. On press: circular backdrop with `#222228`.

### Chips & Filter Tabs
- **Tab Bar (Feed Switcher):** Borderless tabs with an active bottom bar indicator (height: `2px`, color: `#FAFAFA`). Unselected state in `#8B8E96`.
- **Pill Filter:** `#16161A` base with `1px solid rgba(195, 199, 206, 0.14)`. Active variant flips to `#FAFAFA` background with `#0B0B0D` typography.

### Feed Item (Post / Thread)
- **Structure:** Edge-to-edge cell with a bottom border of `1px solid rgba(195, 199, 206, 0.12)`.
- **Avatar:** Circular (40px mobile), 1px subtle ring `rgba(195, 199, 206, 0.2)`.
- **Action Metrics Bar:** Distributed layout across 4 interaction slots (Reply, Repost, Like, Share) using `#8B8E96` icons and tabular numbers, shifting to `#FAFAFA` or contextual accents on engagement.

### Technical Badges ('DEMO · APP DE PRUEBA')
- **Styling:** Inset padding of `2px 6px`, background `#16161A`, border `1px solid rgba(195, 199, 206, 0.24)`, corner radius `2px`.
- **Typography:** Inter All-Caps, 10px, weight `700`, letter-spacing `0.08em`, text color `#C3C7CE`.

### Input Fields & Compose Bar
- **Text Areas:** Background `#0B0B0D`, text `#FAFAFA`, placeholder `#8B8E96`. Focus state eliminates default browser rings, relying purely on text baseline visibility or a clean 1px bottom accent border in `#FAFAFA`.
- **Floating Action Composer:** Absolute floating circular trigger (`56px`) in `#FAFAFA` with an obsidian quill icon, positioned at `right: 16px; bottom: 80px`.

### Checkboxes & Radio Elements
- Minimalist circular indicators featuring razor 1px borders in `#C3C7CE`. Checked state fills `#FAFAFA` with an obsidian inner mark.