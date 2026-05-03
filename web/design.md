---
title: JHB Software — design.md
purpose: Short, load-into-context brand & visual reference for AI-driven UI work.
audience: Implementation agents and designers. Read this first.
---

# JHB Software — Design

## 1. Vision

Modern, technical, engineering craft. Forward-looking, clean, minimal, high
quality. The site reads as **considered engineering**, not "agency template" —
deep cobalt for gravitas, hot orange doing every interactive job, heavy mono
for labels and code, hairline framing instead of floating cards.

For a primary audience of CEOs, CTOs, and product owners (DE + international)
who need an experienced developer for custom software systems.

## 2. Color

```
--color-cobalt-950: #050E1F   near-black
--color-cobalt-900: #0A2540   ANCHOR — H1, primary buttons, mark, footer
--color-cobalt-800: #14365C   hover on cobalt
--color-cobalt-100: #E8EEF7   faint cobalt wash

--color-orange-600: #FF5C00   ACCENT — focus, link hover, corner crosses, `\` glyphs
--color-orange-100: #FFF1E8   chip background, faint accent wash

--color-ink-950:    #0A0A0A   body text
--color-ink-700:    #404040   secondary
--color-ink-500:    #737373   tertiary
--color-ink-300:    #A3A3A3   faint / placeholders

--color-paper:      #FAFAFA   page background
--color-paper-pure: #FFFFFF   card / hero surface

--color-hairline:        #ECECEC   default 1px divider
--color-hairline-strong: #D4D4D4   grid + framing borders
```

**Rules:** Cobalt 900 anchors (H1, primary CTA, footer) — never body text or
body backgrounds. Orange 600 is interactive only — never body text, never as a
fill larger than ~40px. **No new color values** — every color in code resolves
to a token here. Tokens live in `web/src/styles.css` under `@theme`.

## 3. Typography

```
--font-sans: 'Geist', ui-sans-serif, system-ui;
--font-mono: 'Geist Mono', ui-monospace, 'SF Mono', Menlo, monospace;
```

Self-host via the `geist` npm package. Never CDN.

**Mono** for: eyebrows, form labels, code chips, breadcrumb separators (`\`),
file paths, stats numerals.
**Sans** for: everything else (H1–H6, body, nav, buttons).

Headings tight (`line-height: 1.05`, `letter-spacing: -0.025em`). Body 1.55.
Mono uppercase eyebrows tracked `0.12em`. **No new font sizes** — use the
scale in `styles.css`.

## 4. Signature patterns

These four patterns are what make a JHB page recognizable. Apply liberally.

### 4.1 Section framing

The default container for grouped content is **one outer hairline frame with
interior dividers** — not floating cards with gaps.

- Outer: 1px `--color-hairline-strong`, `--radius-sm`, `overflow: hidden`.
- Interior dividers: 1px `--color-hairline-strong`, applied as `border-left` /
  `border-top` on subsequent cells. **Zero gap** between cells.
- Cells share borders. No per-cell radius. No shadows. The frame *is* the depth.
- Use for: any 2+ related cells (services, values, projects, stats, FAQ).
- Don't use for: prose, single CTA blocks, running text.

Hover a cell → cell background shifts to `--color-orange-100`; the outer
frame edge bordering the hovered cell shifts to `--color-orange-600`. No
translateY, no scale.

### 4.2 Corner cross marks

Four `+` registration marks at the inner corners of major frames (hero, key
sections, footer top). 14px wide, 1px stroke, `--color-orange-600`. Reads like
a technical drawing's registration marks. **One pair per block, not sprinkled.**

### 4.3 Mono eyebrows

Above every major section heading: a mono uppercase kicker.

```
\ 02 / LEISTUNGEN
Individuelle Software für Dein Unternehmen
```

Eyebrow is mono, `text-xs`, uppercase, tracking `0.12em`,
`--color-ink-500`. The leading `\` is `--color-orange-600`. Heading is sans
600, `--color-cobalt-900`.

### 4.4 The `\` thread

The backslash is a recurring system element — separator, namespace, code
context. Always rendered in mono and orange (or current text color in mono
contexts).

Locations: breadcrumbs (`Home \ Articles \ Post`), language switcher
(`DE \ EN`), code chip prefix (`\ typescript`), section eyebrows
(`\ 02 / LEISTUNGEN`), nav-hover indicator.

Never inside body prose. Never decorative — every `\` marks a separation,
prefix, or context.

## 5. Imagery

Allowed:
- Project screenshots (16:9, hairline frame, no shadow, clipped via card `overflow: hidden`)
- Article cover images (16:9, hairline frame)
- Author / testimonial headshots (1:1)
- Custom schematic SVG visualizations (strokes-only, cobalt + orange, no
  gradients) — used in service cards
- Customer logos (existing marquee)
- Photos of the team / founder, sparingly, on About / Footer (1:1, hairline frame)

Forbidden:
- Stock photography
- Decorative illustrations or hero art
- Multi-color illustrations
- Drop shadows on any image

All images render via the `Img` component. `loading="lazy"` below the fold.
Locked aspect ratios — no free-form ratios.

## 6. Motion

- Every state change ≤200ms.
- Default ease: `cubic-bezier(0.4, 0, 0.2, 1)`.
- No bouncy springs, no parallax, no scroll-jacking.
- Respect `prefers-reduced-motion: reduce` — disable non-essential motion;
  structural transitions (header collapse) stay.

Named micro-interactions live in `redesign.md` §9 — don't add motion outside
that catalog without flagging.

## 7. Anti-slop guardrails

Hard rules. Don't violate without explicit approval.

1. **No new color values, font sizes, radii, or arbitrary Tailwind values**
   (`text-[17px]`, `bg-[#abc123]`). If the scale is missing something, the
   design is wrong, not the scale.
2. **No box-shadows. Anywhere.** Borders, the frame pattern, and corner
   crosses carry depth. Floating-cards-with-shadows is the single most
   "old-SaaS" look to avoid.
3. **No gradients.** Including subtle ones. The page is flat color + hairlines.
4. **No pill buttons. No `rounded-full`** except true circles (avatars).
5. **No emoji in UI. No stock photography. No hero illustrations.**
6. **No second accent color.** If something looks like it needs one, it doesn't —
   use the ink scale.
7. **No "Read more" / "Mehr erfahren" / "Click here".** Action affordances on
   tiles are an arrow glyph (`→`) only; the title carries meaning. Make the
   whole tile the link.

## 8. Borders & radii

All borders are 1px. No 2px, no 3px. No radius larger than 12px anywhere.
Pill buttons forbidden.

```
--radius-none: 0     hairline accents, hero borders
--radius-xs:   2px   chips, tags
--radius-sm:   4px   buttons, focus rings, inputs, cards
--radius-md:   6px   the logo mark
--radius-lg:   12px  rare — prefer hairline borders + radius-sm
```
