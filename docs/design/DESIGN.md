# DESIGN.md: Portfolio + Blog Design System

> Entry point for AI agents. Read this first, then `design-guidelines.md` (pages, motion, a11y, copy) and `design-components.md` (component specs). `design-showcase.html` is the visual reference. When files conflict, this file wins.

## 0. Design Read
Reading this as: **developer portfolio + magazine-style blog** for **recruiters, clients and fellow engineers**, with a **soft-rounded editorial language and cinematic scroll storytelling**, leaning toward **Tailwind v4 + Motion + GSAP ScrollTrigger, no third-party design system**.

Name: **Blueprint Editorial**. Cobalt-and-ink canvas; amber works like a highlighter pen, never like a button.

| Dial | Value | Why |
|---|---|---|
| DESIGN_VARIANCE | 7 | Asymmetric heroes and bento, but blog stays readable |
| MOTION_INTENSITY | 7 (home) / 4 (blog, post) | Home is a showpiece; reading pages must stay calm |
| VISUAL_DENSITY | 4 (home) / 5 (blog) | Magazine pages carry more content per screen |

## 1. Principles
1. **Craft is the pitch.** Every interaction doubles as proof of engineering skill. Spend boldness on the homepage scroll story, keep the rest disciplined.
2. **Motion must be motivated.** Each animation communicates hierarchy, sequence, feedback or state change. If it can't be justified in one sentence, remove it.
3. **One accent, one highlighter.** Cobalt carries interaction. Amber marks "look here" moments (featured, selected reaction, text highlight). Nothing else gets color.
4. **Soft geometry, strict rules.** Rounded everywhere, via one documented radius scale.
5. **Reading comes first on content pages.** Blog and post pages trade spectacle for typography and rhythm.

## 2. Stack
- Next.js (App Router, RSC by default), TypeScript, **Tailwind CSS v4** (`@tailwindcss/postcss`, no `tailwind.config.js`).
- Motion: `motion/react` for UI/micro-interactions; **GSAP + ScrollTrigger** only for pinned/scrubbed homepage sections; CSS scroll-driven animations for simple progress bars.
- Icons: `@phosphor-icons/react`, one family, `weight="regular"`, size 20. Never hand-draw SVG icons. No lucide.
- Fonts: `@fontsource-variable/bricolage-grotesque`, `@fontsource-variable/geist`, `@fontsource-variable/geist-mono` (self-hosted, `font-display: swap`).
- Any component using scroll, pointer physics or Motion is an isolated `"use client"` leaf. Never track scroll or mouse position in `useState`; use `useMotionValue` / `useScroll` / `useTransform`.
- Targets: evergreen modern browsers. Use `@supports (animation-timeline: scroll())` for CSS scroll-driven animation, with an IntersectionObserver fallback.

## 3. Tokens

### 3.1 Color
Semantic tokens only in components. Never raw hex or `blue-500` in markup.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | #F6F8FC | #0A0F1C | Page canvas |
| `--surface` | #FFFFFF | #111829 | Cards, popovers |
| `--surface-2` | #EBF0F8 | #182036 | Wells, chips, code |
| `--line` | #D8E0EE | #26324D | Borders, dividers |
| `--ink` | #0C1424 | #EAF0FF | Text |
| `--ink-muted` | #4A5772 | #9DAACB | Secondary text (AA on bg) |
| `--primary` | #1457F0 | #6C9AFF | Links, CTA fill, focus |
| `--on-primary` | #FFFFFF | #06112B | Text on primary |
| `--primary-soft` | #E3ECFF | #14264F | Selected/hover tint |
| `--highlight` | #FFB020 | #FFC247 | Featured badge, selected reaction ring, text marker |
| `--highlight-ink` | #8A5200 | #FFC247 | Amber as readable text |
| `--success` / `--danger` | #138A5B / #D93A40 | #3CCB8F / #FF6B70 | Form and toast states |

Primary scale (for reference): 50 #EEF4FF, 100 #D9E6FF, 300 #86ACFF, 400 #6C9AFF, 500 #3B78FF, 600 #1457F0, 700 #0E43C4, 800 #0C369B, 900 #0B2A73.
Amber scale: 300 #FFD27A, 400 #FFC247, 500 #FFB020, 600 #E89400, 700 #B86F00.

Rules: no gradients except a single hero image duotone (primary-900 to transparent). No blue-to-violet anything. Amber is never a button fill and never text on a light surface (use `--highlight-ink`). Dark mode is a full re-theme, not an inversion; set once at the root (`.dark` on `<html>`, default from `prefers-color-scheme`, user toggle persisted).

### 3.2 Typography
| Role | Family | Notes |
|---|---|---|
| Display / headings | **Bricolage Grotesque** (variable, opsz + wdth) | 600-800, tracking -0.03em to -0.045em |
| Text / UI / article body | **Geist** | 400/500/600 |
| Code / meta data | **Geist Mono** | Dates, read time, code only. Not for labels in general |

| Token | Size | Line | Use |
|---|---|---|---|
| `display` | clamp(3rem, 8.5vw, 7.5rem) | 0.92 | Home hero only, 3 to 5 words |
| `h1` | clamp(2.25rem, 5vw, 4rem) | 1.02 | Page and post titles |
| `h2` | clamp(1.75rem, 3.2vw, 2.75rem) | 1.1 | Section titles |
| `h3` | 1.5rem | 1.2 | Card titles (featured) |
| `h4` | 1.25rem | 1.3 | Card titles |
| `body-lg` | 1.1875rem | 1.75 | Article body, max 68ch |
| `body` | 1rem | 1.6 | UI text |
| `small` | 0.875rem | 1.5 | Meta, helper |
| `caption` | 0.75rem | 1.4 | Timestamps, counts |

Emphasis inside headlines: bold or italic of the same family only. No serif injection. Italic descenders need `leading-[1.1]` plus `pb-1`.

### 3.3 Layout and spacing
- 4px base; scale 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- Container `max-w-[1320px]`; gutters 16 / 24 / 32 / 48 by breakpoint. Prose max 68ch. Hero uses `min-h-[100dvh]`, never `h-screen`.
- Section padding `clamp(5rem, 10vw, 9rem)`. Multi-column layouts use CSS Grid, never flex percentage math.
- Nav: floating pill, 64px high on desktop, single line.

### 3.4 Breakpoints (Material Design 3 window size classes)
| Class | Range | Tailwind prefix | Layout behavior |
|---|---|---|---|
| Compact | 0 to 599 | (base) | 1 column, bottom reaction bar, hamburger sheet |
| Medium | 600 to 839 | `sm:` | 2 columns, nav pill visible |
| Expanded | 840 to 1199 | `md:` | 12-col grid, sticky TOC appears |
| Large | 1200 to 1599 | `lg:` | Full magazine layouts, pinned scroll scenes |
| Extra-large | 1600+ | `xl:` | Container stays 1320, larger display type |

### 3.5 Radius (shape lock, never mix outside this table)
| Token | Value | Applies to |
|---|---|---|
| `--radius-ctl` | 9999px | Buttons, chips, search, toggles, reaction pills, avatars |
| `--radius-field` | 1rem | Textarea, select, code block |
| `--radius-card` | 1.25rem | Cards, popovers, comment bubbles |
| `--radius-media` | 0.875rem | Images inside cards (card radius minus padding) |
| `--radius-sheet` | 1.75rem | Modals, bottom sheets, hero media |

### 3.6 Elevation
Light: `0 1px 2px rgb(12 20 36 / .06), 0 14px 32px -14px rgb(20 70 190 / .22)` (shadow tinted toward primary, never pure black). Dark: no drop shadow; 1px `--line` border plus `inset 0 1px 0 rgb(255 255 255 / .06)`. Elevation only where it signals hierarchy (popover, featured card, floating nav). Everything else is separated by space or a 1px line.

### 3.7 Motion tokens
| Token | Value |
|---|---|
| `--ease-out` | cubic-bezier(.16, 1, .3, 1) |
| `--ease-in-out` | cubic-bezier(.65, 0, .35, 1) |
| `--dur-fast / base / slow / scene` | 120ms / 240ms / 480ms / 900ms |
| Spring (Motion) | `{ type: "spring", stiffness: 140, damping: 20 }` |
| Press | `scale(.97)` or `translateY(1px)` on `:active` |

All motion honors `prefers-reduced-motion: reduce` (replace with a 150ms opacity fade; disable pinning and scrubbing).

### 3.8 Tailwind v4 setup
```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --breakpoint-*: initial;
  --breakpoint-sm: 600px;
  --breakpoint-md: 840px;
  --breakpoint-lg: 1200px;
  --breakpoint-xl: 1600px;

  --font-display: "Bricolage Grotesque Variable", ui-sans-serif, system-ui, sans-serif;
  --font-sans: "Geist Variable", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Geist Mono Variable", ui-monospace, SFMono-Regular, monospace;

  --radius-ctl: 9999px;
  --radius-field: 1rem;
  --radius-card: 1.25rem;
  --radius-media: 0.875rem;
  --radius-sheet: 1.75rem;

  --ease-out: cubic-bezier(.16, 1, .3, 1);
}

:root {
  --bg: #F6F8FC; --surface: #fff; --surface-2: #EBF0F8; --line: #D8E0EE;
  --ink: #0C1424; --ink-muted: #4A5772;
  --primary: #1457F0; --on-primary: #fff; --primary-soft: #E3ECFF;
  --highlight: #FFB020; --highlight-ink: #8A5200;
  --success: #138A5B; --danger: #D93A40;
}
.dark {
  --bg: #0A0F1C; --surface: #111829; --surface-2: #182036; --line: #26324D;
  --ink: #EAF0FF; --ink-muted: #9DAACB;
  --primary: #6C9AFF; --on-primary: #06112B; --primary-soft: #14264F;
  --highlight: #FFC247; --highlight-ink: #FFC247;
  --success: #3CCB8F; --danger: #FF6B70;
}
@theme inline {
  --color-bg: var(--bg); --color-surface: var(--surface); --color-surface-2: var(--surface-2);
  --color-line: var(--line); --color-ink: var(--ink); --color-muted: var(--ink-muted);
  --color-primary: var(--primary); --color-on-primary: var(--on-primary);
  --color-primary-soft: var(--primary-soft);
  --color-highlight: var(--highlight); --color-highlight-ink: var(--highlight-ink);
}
```
Usage: `bg-surface text-ink border-line`, `rounded-card`, `font-display`.

## 4. Hard rules for agents
**Never:** Inter, Fraunces, Instrument Serif or any serif as default; purple or violet; blue-violet gradients; glassmorphism on content; three identical feature cards; centered default hero; em dashes or "→" in UI copy; eyebrow labels above every heading (max 1 per 3 sections); more than one marquee per page; the same section layout family twice on the home page; 3+ consecutive image/text zigzag sections; div-based fake screenshots; hand-drawn SVG icons; `h-screen`; `localStorage` for theme without an SSR-safe inline script; infinite loops on informational content.
**Always:** semantic tokens; skeleton loaders shaped like final content; empty and error states; visible focus rings (2px `--primary`, 2px offset); one CTA label per intent (e.g. "Contact me" everywhere); real images (or labeled placeholder slots) in hero, projects and post covers; verified contrast (AA); declared mobile fallback for every multi-column and pinned section.
**Emoji exception:** emoji are allowed only in the reaction set (see components). Everywhere else use Phosphor icons.

## 5. Pre-flight checklist
1. Fonts are Bricolage Grotesque, Geist, Geist Mono only.
2. Only semantic color tokens; amber appears only in highlight roles.
3. Radius values come from the shape table.
4. Home hero fits in 100dvh: headline at most 2 lines, subtext at most 20 words, one primary and one secondary CTA, at most 1 small text element besides those.
5. Home has at least 5 distinct layout families; at most 1 marquee.
6. Dark mode checked on every component; no section inverts the theme.
7. Reduced-motion path verified; keyboard path verified for nav, search, reactions, comments.
8. Copy self-audit: no generic "cute" copy, no fake-precise numbers unless labeled sample data.
