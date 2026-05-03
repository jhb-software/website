---
version: alpha
name: JHB Software
description: >
  Deep primary for gravitas, a single tertiary accent for every interactive
  job, heavy mono for labels and code, hairline framing instead of cards.
  Token names are role-based; underlying values can change without renaming.
colors:
  primary: "#0a2540"
  primary-deep: "#050e1f"
  primary-hover: "#14365c"
  primary-soft: "#e8eef7"
  tertiary: "#0f766e"
  tertiary-soft: "#a8d4c8"
  neutral: "#0a0a0a"
  neutral-muted: "#404040"
  neutral-subtle: "#737373"
  neutral-faint: "#a3a3a3"
  canvas: "#fafafa"
  surface: "#ffffff"
  border: "#ececec"
  border-strong: "#d4d4d4"
typography:
  hero:
    fontFamily: Geist
    fontSize: 72px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -0.025em
  h1:
    fontFamily: Geist
    fontSize: 56px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -0.025em
  h2:
    fontFamily: Geist
    fontSize: 44px
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -0.025em
  h3:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.025em
  h4:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.2
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.55
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.55
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
  eyebrow:
    fontFamily: Geist Mono
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.12em
rounded:
  none: 0
  xs: 2px
  sm: 4px
  md: 6px
  lg: 12px
spacing:
  page-max-width: 1200px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.none}"
    padding: 12px 20px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.neutral}"
    rounded: "{rounded.none}"
    padding: 12px 20px
  link-prose:
    textColor: "{colors.neutral}"
  link-prose-hover:
    textColor: "{colors.tertiary}"
  corner-mark:
    textColor: "{colors.tertiary}"
  eyebrow:
    textColor: "{colors.neutral-subtle}"
    typography: "{typography.eyebrow}"
---

# JHB Software — Design

Tokens above are normative. Prose below is rationale.

## Overview

Modern engineering craft for CEOs, CTOs, and product owners needing custom
software. Reads as **considered engineering**, not "agency template".

## Colors

- `primary` — brand anchor: H1, primary buttons, mark, footer. Never body.
- `tertiary` — interactive only: focus, link hover, corner marks, `\`. Never
  body. Never a fill larger than ~40px. Currently teal; orange `#ff5c00`
  kept commented in `styles.css` for A/B.
- `neutral` scale — text & icons on light surfaces.
- `canvas` (page), `surface` (raised), `border` (default), `border-strong`
  (rules, underlines).

## Typography

Geist Sans + Geist Mono, self-hosted. **Mono** for eyebrows, labels, code
chips, breadcrumb separators, file paths, stats numerals. **Sans** for
everything else.

## Layout

Site-wide max width `1200px` (`--container-page`). Sections set their own
internal grid. Generous vertical rhythm.

## Elevation & Depth

Flat color + hairlines. No shadows, no gradients. Depth comes from borders,
frames, and corner marks.

## Shapes

Sharp edges. `none` is the only widely used radius. Avatars are true circles.

## Components

### `<SectionFrame>` + `<FrameCell>`

One outer hairline frame with shared interior dividers — not floating cards
with gaps. Use for any 2+ related cells. Hover a cell → cell bg
`tertiary-soft`; adjacent outer edge `tertiary`. No translate, no scale.

### `<CornerMark>`

Four `+` registration marks (14px, 1px, `tertiary`) at the inner corners of
hero, key sections, footer top. One pair per block.

### Mono eyebrow

`\ NN / LABEL` above every major heading. Mono, `text-xs`, uppercase,
tracking `0.12em`, `text-neutral-subtle`. Leading `\` is `tertiary`. Heading:
sans 600, `primary`.

### The `\` thread

Always mono + `tertiary`. Locations: breadcrumbs, language switcher (`DE \ EN`),
code chip prefix (`\ typescript`), eyebrows, nav-hover indicator. Never in
body prose. Never decorative.

### Buttons & links

- **Primary button** — filled `primary`, `surface` text. Hover → `primary-hover`.
- **Ghost button** — transparent, 1px `border-strong`, `neutral` text. Hover
  → `tertiary` text.
- **In-prose link** — underlined `decoration-border-strong`. Hover →
  `tertiary` text + decoration.
- **Tile / card** — the whole tile is the link. Affordance: Geist `arrow-right`,
  `tertiary` on hover. No "Read more" text.

### Imagery

16:9 with hairline frame for project screenshots and article covers; 1:1 for
headshots; schematic SVGs are strokes-only in `primary` + `tertiary`. All via
the `Img` component, `loading="lazy"` below the fold.

### Iconography

One library: **Geist Icons**. Thin outlined strokes, `currentColor`, never
filled, never two-tone. If a concept isn't in Geist, pick the closest glyph.

- Tile / CTA affordance → `arrow-right`
- Disclosure → `chevron-*`
- Contact / messaging → `messageSquare` (also WhatsApp fallback)
- Service categories → literal Geist glyphs (`smartphone`, `monitor`, `code`)

### Motion

≤200ms, ease `cubic-bezier(0.4, 0, 0.2, 1)`. Respect `prefers-reduced-motion`.
Catalog (don't add motion outside this list): `header-collapse`, `nav-hover`,
`link-underline`, `card-border`, `cta-arrow-nudge`, `eyebrow-counter`,
`corner-mark-draw`.

## Do's and Don'ts

- No new color values, font sizes, or arbitrary Tailwind values. Missing
  scale = the design is wrong, not the scale.
- No rounded corners (except avatar circles). No shadows. No gradients.
- No second accent color — use the `neutral` scale.
- No emoji, stock photography, hero illustrations, or icons outside Geist.
- No "Read more" / "Mehr erfahren" / "Click here" — whole tile is the link.
