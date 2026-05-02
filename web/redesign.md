# JHB Software — Website Redesign Spec

> **Status:** in progress. This document is the source of truth for the
> redesign. Implementation agents must read this end-to-end before touching
> the codebase. Every rule here exists for a reason — do not "improve" by
> deviating without flagging it back to the user.
>
> **Scope:** visual + interaction redesign only. Content stays. Information
> architecture stays. CMS schemas stay. Astro/Payload stack stays.
> URL structure stays. SEO/structured data stays.

---

## 1. Vision (one paragraph)

A minimal, edgy, technical website that reads as **considered engineering
craft**, not "agency template." Anchored by a deep cobalt that gives the
brand gravitas, with hot orange doing every interactive job (links, focus,
hover, accents, code chips). Heavy use of monospace for labels, code, and
brand thread. Background grid + corner cross marks frame content like a
technical drawing. The backslash `\` is a recurring brand thread —
appearing in the mark, breadcrumbs, code chips, and dividers — never inside
the wordmark itself.

**Explicitly avoided:** drop-shadow gradients, soft pastel palettes,
multi-color illustrations, hero stock photography, generic "Inter on a card
on a card on a card" SaaS look, AI-startup neon-lime aesthetic.

## 2. References

### 2.1 Visual / interaction references (what to copy from)

These sites are referenced for their **design** — the visual language,
typography, motion, and patterns. Implementation agents should look at
the actual rendered pages, not the source code.

| Site                                       | What we take                                                                |
| ------------------------------------------ | --------------------------------------------------------------------------- |
| [vercel.com](https://vercel.com)           | Restraint, hairline systems, monospace eyebrows, technical-drawing framing, **section framing pattern** (see §7.7) |
| [payloadcms.com](https://payloadcms.com)   | Off-white-on-near-black gravitas, dense mono usage                          |
| [aihero.dev](https://www.aihero.dev/)      | Edge of grid-as-design, content density                                     |
| [anthropic.com](https://www.anthropic.com) | Header wordmark scroll-collapse pattern (`Anthropic` → `A\`)                |

### 2.2 Content reference (what to read)

| Resource                                                             | What we take                                                                |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [vercel.com/design/guidelines](https://vercel.com/design/guidelines) | **Documentation content** — design system principles, naming conventions, accessibility patterns. Linked for what it *says*, not what it looks like. |

## 3. Scope

**Changes:** every Astro component under `src/components/`, every layout
under `src/layout/`, `src/styles.css`, possibly the logo SVG at
`public/icon.svg`.

**Does not change:** Payload collections, blocks, fields, access control,
the CMS schema, the Astro routing, JSON-LD schemas in `src/schema/`,
analytics, deployment, environment variables, the content itself.

---

## 4. Design tokens

All tokens live in `src/styles.css` under `@theme`. Components reference
them by name, never by raw value. Agents: **do not introduce new color
values, font sizes, spacing values, or radii outside this scale.** If the
scale is missing something, propose adding it to the scale; do not inline.

### 4.1 Color

```
--color-cobalt-950: #050E1F   /* near-black surface, dark mode bg */
--color-cobalt-900: #0A2540   /* PRIMARY ANCHOR — H1, primary buttons, mark, footer */
--color-cobalt-800: #14365C   /* hover state on cobalt surfaces */
--color-cobalt-100: #E8EEF7   /* faint cobalt wash, for chip backgrounds in cobalt family */

--color-orange-600: #FF5C00   /* PRIMARY ACCENT — focus rings, link hover, active states, hairline accents, mark diagonal */
--color-orange-100: #FFF1E8   /* chip background, faint accent wash */

--color-ink-950:    #0A0A0A   /* body text on light bg */
--color-ink-700:    #404040   /* secondary text */
--color-ink-500:    #737373   /* tertiary text */
--color-ink-300:    #A3A3A3   /* faint text, placeholders */

--color-paper:      #FAFAFA   /* page background, light mode */
--color-paper-pure: #FFFFFF   /* card / hero surface, light mode */

--color-hairline:        #ECECEC   /* default 1px divider */
--color-hairline-strong: #D4D4D4   /* grid background, framing borders */
```

**Usage rules:**

- **Cobalt 900** is the *anchor*: H1, primary CTAs (filled), mark
  background, footer background, header lockup. Never used for body text or
  body backgrounds.
- **Orange 600** is the *interactive accent*: link `:hover`, focus rings,
  active nav, the corner cross marks framing hero blocks, the `\` glyphs in
  breadcrumbs and chips, the orange diagonal in the mark. Never used for
  body text. Never used as a background fill larger than ~40px square.
- **Ink** scale is for all body/UI text on light backgrounds.
- **Hairline** colors are for the grid background and dividers only.

### 4.2 Typography

```
--font-sans: 'Geist', ui-sans-serif, system-ui, -apple-system;
--font-mono: 'Geist Mono', ui-monospace, 'SF Mono', Menlo, monospace;
```

Self-host via the `geist` npm package. **Do not** load from Google Fonts
or a CDN.

**When to use mono:**

- Eyebrows / kickers (uppercase, tracked, small)
- Labels above form inputs
- Code chips / tags
- Breadcrumb separators (`\`)
- File paths, command examples
- Logo wordmark fallback only (the wordmark is `Geist Sans Medium`)
- Numbers in stats / data tables

**When to use sans:**

- Everything else: H1–H6, body, nav, buttons, captions

**Type scale:**

```
--text-xs:   0.75rem  (12px)  /* mono labels, eyebrows */
--text-sm:   0.875rem (14px)  /* small body, button, nav */
--text-base: 1rem     (16px)  /* body */
--text-lg:   1.125rem (18px)  /* lede */
--text-xl:   1.5rem   (24px)  /* H4 */
--text-2xl:  2rem     (32px)  /* H3 */
--text-3xl:  2.75rem  (44px)  /* H2 */
--text-4xl:  3.5rem   (56px)  /* H1 mobile */
--text-5xl:  4.5rem   (72px)  /* H1 desktop hero */
```

Line heights: headings `1.05` (tight), body `1.55`, mono `1.4`.
Letter-spacing: H1/H2 `-0.025em`, mono uppercase eyebrows `0.12em`.

### 4.3 Spacing scale

Use Tailwind's default 4px base. **Do not** use arbitrary values
(`p-[17px]`, `mt-[23px]`). If the scale is missing something, the design
is wrong, not the scale.

### 4.4 Radii

```
--radius-none: 0      /* hairline accents, hero borders */
--radius-xs:   2px    /* chips, tags */
--radius-sm:   4px    /* buttons, focus rings, inputs */
--radius-md:   6px    /* the logo mark tiles */
--radius-lg:   12px   /* cards (rare — prefer hairline borders + radius-sm) */
```

No radius larger than 12px anywhere. No `rounded-full` except for true
circular elements (avatars). Pill buttons are forbidden.

### 4.5 Borders

All borders are 1px. No 2px, no 3px. Borders use `--color-hairline` by
default, `--color-orange-600` for accent moments (focus rings, hover
underlines, hairline accents under section headings).

---

## 5. Logo system (two-tier)

### 5.1 The mark — `[mark]`

A 4×4 grid of square tiles. Sharp corners (`--radius-md` = 6px on the
outer square, no rounding on inner tiles). The 4 tiles on the
top-left → bottom-right diagonal — positions `(0,0)`, `(1,1)`, `(2,2)`,
`(3,3)` — are filled `--color-orange-600`. The remaining 12 tiles
alternate between `--color-cobalt-900` and `--color-cobalt-800`. The mark
encodes the brand `\` thread visually.

**Drop the white "JHB" letterforms from the current logo.** The mark is
pure pictogram; the wordmark carries the letters. This is the Vercel
`▲` / Linear-mark pattern.

**Contexts:**

- Header lockup (top of page, before scroll collapse)
- Header collapsed state (the only thing visible after scroll)
- Favicon
- OG/social cards
- Footer corner
- Email signature

**File:** replace `public/icon.svg` with the new mark. Generate
`public/favicon.ico` and OG-card variants from the same source.

**Draft SVG (working starting point — iterate during implementation):**

```svg
<svg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="JHB Software">
  <defs>
    <clipPath id="markOuter">
      <rect x="0" y="0" width="96" height="96" rx="6" />
    </clipPath>
  </defs>
  <g clip-path="url(#markOuter)">
    <rect x="0"  y="0"  width="24" height="24" fill="#FF5C00"/>
    <rect x="24" y="0"  width="24" height="24" fill="#14365C"/>
    <rect x="48" y="0"  width="24" height="24" fill="#0A2540"/>
    <rect x="72" y="0"  width="24" height="24" fill="#14365C"/>
    <rect x="0"  y="24" width="24" height="24" fill="#0A2540"/>
    <rect x="24" y="24" width="24" height="24" fill="#FF5C00"/>
    <rect x="48" y="24" width="24" height="24" fill="#14365C"/>
    <rect x="72" y="24" width="24" height="24" fill="#0A2540"/>
    <rect x="0"  y="48" width="24" height="24" fill="#14365C"/>
    <rect x="24" y="48" width="24" height="24" fill="#0A2540"/>
    <rect x="48" y="48" width="24" height="24" fill="#FF5C00"/>
    <rect x="72" y="48" width="24" height="24" fill="#14365C"/>
    <rect x="0"  y="72" width="24" height="24" fill="#0A2540"/>
    <rect x="24" y="72" width="24" height="24" fill="#14365C"/>
    <rect x="48" y="72" width="24" height="24" fill="#0A2540"/>
    <rect x="72" y="72" width="24" height="24" fill="#FF5C00"/>
  </g>
</svg>
```

Working asset: `/tmp/jhb-mark-draft.svg`. Move into `public/icon.svg`
during implementation. Test legibility at 16px (favicon) before locking.

### 5.2 The wordmark

Pure typography: `JHB Software` set in **Geist Sans Medium**, tracking
`-0.01em`. **No slash inside the wordmark.** No special characters. The
wordmark is a name, not a logo.

### 5.3 The header lockup

```
[mark]  JHB Software         [Leistungen] [Referenzen] [Artikel] [Kontakt]   [DE \ EN]
```

- Spacing: 12px between mark and wordmark.
- Vertical alignment: baseline of wordmark aligned to optical center of mark.
- Language switcher uses the brand `\` as separator: `DE \ EN`.

### 5.4 Scroll collapse (Anthropic-pattern)

When the page scrolls past `80px`:

1. The wordmark `JHB Software` fades + width-collapses to `0` over `200ms`,
   easing `cubic-bezier(0.4, 0, 0.2, 1)`.
2. The mark stays in place. The header height shrinks from `72px` →
   `56px` over the same duration.
3. The header background goes from transparent → `--color-paper-pure` with
   a 1px hairline bottom border, also over `200ms`.

When the page scrolls back above `80px`, the reverse animation plays.

**Implementation:** sticky header. Tiny client script wrapped in
`astro:page-load` (per CLAUDE.md). Toggle a `data-collapsed` attribute on
the header element at the threshold. All animation done in CSS via that
attribute. No layout jump on toggle (Geist Mono fixed-width metrics in the
collapsed nav prevent reflow).

---

## 6. The brand `\` thread

The backslash is a recurring system element. It appears wherever a
"separator," "namespace," or "code-context" signal would help. **Always
rendered in `--font-mono` and `--color-orange-600` (or current text color
when used in monospace contexts where orange would be too loud).**

Locations:

- **Mark diagonal** — orange tiles forming a `\` (see §5.1)
- **Breadcrumbs** — `Home \ Articles \ Post Title` (separator is mono, orange)
- **Language switcher** — `DE \ EN`
- **Code chip prefix** — `\ typescript`, `\ astro`, `\ payload`
- **Section eyebrows** — `\ 01 / Leistungen`, `\ 02 / Referenzen` (mono, uppercase, tracked)
- **Footer divider blocks** — `\` glyphs at the corners of footer columns
- **Hover indicator on nav links** — `\` glyph appears before the active
  link on hover (~120ms ease-out)

**Never:**

- Inside body prose
- Inside the wordmark
- As decoration without semantic meaning (don't sprinkle for vibes — every
  `\` should mark a separation, prefix, or context)

---

## 7. Layout patterns

### 7.1 Page width

- Max content width: `1200px` (matches current `Section.astro`).
- Horizontal gutter: `32px` desktop, `20px` mobile.
- Hero blocks may bleed full-width with internal padding.

### 7.2 Background grid

Subtle 1px grid in `--color-hairline-strong`, 56px cells, applied to
hero/section blocks (not the page background). **Always masked by a
radial-gradient so the grid fades behind content.** Reference
implementation:

```css
.hero {
  position: relative;
  background: var(--color-paper-pure);
  border: 1px solid var(--color-hairline-strong);
}
.hero::before {
  content: '';
  position: absolute; inset: 0;
  background-image:
    linear-gradient(to right, var(--color-hairline-strong) 1px, transparent 1px),
    linear-gradient(to bottom, var(--color-hairline-strong) 1px, transparent 1px);
  background-size: 56px 56px;
  opacity: 0.55;
  -webkit-mask-image: radial-gradient(
    ellipse 70% 65% at 38% 55%,
    transparent 0%, transparent 35%,
    rgba(0,0,0,0.6) 70%, rgba(0,0,0,1) 100%
  );
  mask-image: radial-gradient(
    ellipse 70% 65% at 38% 55%,
    transparent 0%, transparent 35%,
    rgba(0,0,0,0.6) 70%, rgba(0,0,0,1) 100%
  );
  pointer-events: none;
}
```

### 7.3 Corner cross marks

Each major content block (hero, key sections) gets four `+` marks at the
inner corners — 14px wide, 1px stroke, `--color-orange-600`. Reads like a
technical drawing's registration marks. **One pair per block — not
sprinkled everywhere.** Reserved for hero, the top-of-page section
introducing each major page area, and the footer top edge.

### 7.4 Section eyebrows

Above every major section heading: a mono uppercase eyebrow.

```
\ 02 / LEISTUNGEN
Individuelle Software für Dein Unternehmen
```

- Eyebrow: `--font-mono`, `--text-xs`, uppercase, tracking `0.12em`,
  `--color-ink-500`. The leading `\` is `--color-orange-600`.
- Heading: `--font-sans`, weight `600`, color `--color-cobalt-900`.

### 7.5 Service grid (Tier 1 — Leistungen) — bento layout

An asymmetric 2-column bento with one **hero card** (left, taller) and
two **compact cards** stacked (right). Equal 3-up grids look like template
SaaS — bento adds visual rhythm and signals "this is the showcase."

```
┌─────────────────────────┬──────────────┐
│                         │  Mobile Apps │  (compact)
│   Webanwendungen        │              │
│   (HERO — bigger viz,   ├──────────────┤
│    more breathing room) │  Websites    │  (compact)
│                         │  & CMS       │
└─────────────────────────┴──────────────┘
```

CSS skeleton:

```css
.service-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  grid-template-areas:
    "hero compact-1"
    "hero compact-2";
  gap: 24px;
}
.service-card.hero      { grid-area: hero; }
.service-card.compact-1 { grid-area: compact-1; }
.service-card.compact-2 { grid-area: compact-2; }
```

**Hero card placement:** **Webanwendungen** (the dashboard visualization
works best at large size; also the most strategically valuable service).
This is a deliberate hierarchy choice, not a defect. Mobile and CMS get
compact cards.

**Hero card sizing:**

- Visual area: `~360px` tall (vs 140px for compact)
- Meta padding: `32px` (vs 20px for compact)
- `h3`: `26px` (vs 17px for compact)
- Body: `15px` (vs 13px for compact)
- The SVG visualization renders at full scale (or `transform: scale(1.4)`
  if reusing the same SVG asset — design hero-specific assets if budget
  allows).

**Compact card sizing:**

- Visual area: `140px` tall, SVG at `transform: scale(0.7)` for compact
  context (or design dedicated compact assets).
- Meta padding: `20px`.

**Card structure (both sizes, top to bottom):**

- `Visual` — `--color-paper-pure` background, masked grid (32px cells,
  `--color-hairline-strong`, `opacity 0.4`), 1px hairline bottom border.
  Contains an SVG visualization (see below).
- `Meta` block:
  - Mono eyebrow with orange `\` prefix (`\ MOBILE`, `\ WEB`, `\ WEBAPP`)
  - `h3` — sans, weight 600, `--color-cobalt-900`
  - One-line description, sans, `--color-ink-700`, `line-height 1.55`
  - Arrow-only affordance — the **whole card is the link** (`<a>`-wraps
    the cell content). Bottom-right arrow glyph (`→`, mono, `--color-ink-700`)
    nudges +2px on hover (`cta-arrow-nudge`). **No "Mehr erfahren" text**
    (per §11.11).

**Frame pattern (important — not floating cards):** the bento is rendered
as **one continuous outer frame** with **shared interior hairlines**
dividing it into cells. **Cells share borders — no gap between them.**
This is the §7.7 section-framing pattern applied to the service grid.

```css
.service-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  grid-template-areas:
    "hero compact-1"
    "hero compact-2";
  gap: 0;                              /* SHARED borders, not gaps */
  border: 1px solid var(--color-hairline-strong);
  border-radius: var(--radius-sm);
  overflow: hidden;                    /* clips child borders to outer radius */
}
.service-card {
  border: 0;
  border-radius: 0;
}
.service-card + .service-card,
.service-card.compact-1,
.service-card.compact-2 {
  border-left: 1px solid var(--color-hairline-strong);
}
.service-card.compact-2 {
  border-top: 1px solid var(--color-hairline-strong);
}
```

**Hover state for a frame-cell:** the cell's *interior background* shifts
to `--color-orange-100` (5% wash) over 150ms, and the outer frame's
edge segment adjacent to that cell highlights to `--color-orange-600`.
**No card lift, no border-color-on-the-card** (the card has no border of
its own — only the section frame does).

**Mobile breakpoint:** below `768px`, the bento collapses to a single-column
stack: hero on top, compacts below in source order. Interior dividers
become horizontal hairlines.

**Card frame:**

- 1px `--color-hairline-strong` border, `--radius-sm`, no shadow
- Hover: border color → `--color-orange-600` over 150ms (matches §9
  `card-border` micro-interaction)
- Cursor `pointer` (whole card is the link)

**Visualization rules:**

Each visualization is a custom SVG. The visualization must be a **functional
metaphor** for the service — a mobile card animates like a mobile app, a
dashboard card animates like a dashboard. Pure decoration is forbidden.

Style constraints (mechanically enforce these to prevent slop):

- **Strokes only or strokes + flat fills.** No gradients, no shadows.
- Strokes: `1.5px`, `--color-cobalt-900`. Accent strokes / fills:
  `--color-orange-600`. No other colors except `--color-paper-pure` for
  surface fills and `--color-cobalt-100` for muted block fills.
- Hairline supporting elements (list lines, field underlines) use
  `1px`, `--color-hairline-strong`.
- Optical centering inside the 220px visual area, no asymmetry without
  intent.
- Mono numerals when text appears (e.g. dashboard stats).

**Scroll-in animation (first appearance only):**

- Triggered by `IntersectionObserver` at `threshold: 0.3`. Once fired,
  observer disconnects from that card.
- Lines draw in via `stroke-dasharray` / `stroke-dashoffset` over
  `~600ms`.
- Filled elements fade in via opacity over `~250ms`.
- Sequence is staggered, total duration **`≤1500ms`** per card. No
  individual element animates after that ceiling.
- Cards animate independently (not as a coordinated row) — each is its
  own intersection.

**Hover animation:**

- A single ambient micro-loop kicks in on hover (e.g. indicator dot
  sliding, bars re-animating, data dots flowing).
- ~1.4-2s loop duration, infinite, paused on `mouseleave`.
- Always uses `--color-orange-600` for the moving element.
- Hover animation must not interrupt or restart the scroll-in animation
  state.

**Reduced motion:**

- `prefers-reduced-motion: reduce` → both scroll-in and hover animations
  are disabled. Visualization renders immediately in its final state.
  Cards still respond to hover via border color change.

**Reference visualizations (initial cut — refine in implementation):**

- *Mobile Apps*: phone outline with 5 list items, one orange indicator
  dot. Hover: indicator slides through items.
- *Websites & CMS*: CMS editor (top) with labeled fields → orange
  connecting arrow → rendered site (bottom) with content blocks. Hover:
  orange data dots flow from editor to site.
- *Webanwendungen*: dashboard with 7 bars (1 orange accent), 3 stat
  cards with mono numerals, a sparkline. Hover: bars re-animate.

Working prototype: `/tmp/jhb-service-grid.html` (will move into
`web/src/components/blocks/` during implementation).

### 7.6 Value grid (Tier 2 — Werte)

A 4-column grid of smaller cards for the "Software die bleibt" values.
Quieter than the service grid — same system, lower volume.

**Cards (initial set):**

1. **Qualität über Quantität** — Wenige Projekte, dafür mit voller Aufmerksamkeit.
2. **Nachhaltige Lösungen** — Code der in fünf Jahren noch wartbar ist.
3. **Lösungsorientiert** — Pragmatische Wege statt Lehrbuch-Architektur.
4. **Fair & transparent** — Klare Preise, ehrliche Schätzungen, kein Kleingedrucktes.

**Card structure:**

- 24px padding, no separate visual area
- Single 32×32 schematic glyph (top-left) — cobalt strokes, optional
  orange accent dot or stroke
- `h4` — sans, weight 600, 15px, `--color-cobalt-900`
- One-line description, sans, 13px, `--color-ink-700`

**Frame:** same as service card (1px hairline → orange on hover).

**Animation:** **hover-only.** No scroll-in. Hover triggers the orange
accent stroke/dot to pulse subtly (opacity 0.5 → 1, 1s, alternate). Static
at rest. This deliberately contrasts with the richer scroll-in of Tier 1
to signal hierarchy.

The value grid uses the **same frame pattern as the service grid**
(§7.5) — one continuous outer frame with shared interior hairlines
dividing the 4 cells. **Not 4 floating cards with gaps between them.**

### 7.7 Section framing — the Vercel pattern

This is one of the highest-leverage patterns we're stealing from
[vercel.com](https://vercel.com). Look at their homepage immediately
below the hero — content sections do not sit as **floating cards with
shadows** on a page background. They sit inside **explicit hairline
frames** that span the page width, with **interior hairlines dividing
the frame into cells** that share borders. The whole effect reads as a
**technical drawing or graph paper**, not a SaaS landing page.

**This pattern replaces the "cards-on-background" default.** Whenever
multiple content blocks would naturally group into a section (a feature
grid, a stats row, a testimonials cluster, a column of values), the
default rendering is **one frame with interior dividers**, not N
separate cards.

**Mechanics:**

```
┌────────────────────────────────────────────┐
│ \ 02 / LEISTUNGEN                          │  ← eyebrow above frame
│ Was wir entwickeln                         │  ← heading above frame
│                                            │
│ ┌──────────────┬──────────────┬──────────┐ │
│ │              │              │          │ │
│ │   cell A     │   cell B     │ cell C   │ │  ← shared interior
│ │              │              │          │ │     hairlines, no gaps
│ ├──────────────┴──────────────┴──────────┤ │
│ │   cell D (spans full width)            │ │
│ └────────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

**Rules:**

- **Outer frame:** 1px `--color-hairline-strong` border, `--radius-sm`,
  `overflow: hidden` so child borders clip cleanly to the outer radius.
- **Interior dividers:** 1px `--color-hairline-strong`. Applied as
  `border-left` / `border-top` on the second/subsequent cells.
- **Gap between cells:** zero. Cells share the dividing line.
- **Cell padding:** consistent within a frame (typically 24px or 32px).
- **No drop shadows.** Anywhere. The frame *is* the depth.
- **Corner cross marks** at the four outer corners of the frame (per
  §7.3 — orange, 14px, 1px stroke). These are the registration marks
  that make the frame read as "deliberate technical drawing" rather
  than "rectangle."
- **Background grid** (per §7.2) renders inside the frame with the
  radial mask hiding it behind active cell content.

**When to frame, when to not:**

- **Frame:** any section with 2+ related content cells (service grid,
  value grid, testimonials cluster, project tiles, stats rows, FAQ
  groups).
- **Don't frame:** prose-heavy sections (article body, hero copy,
  about-text). Prose flows in the page reading column without an
  outer frame — frames are for *grouped collections*, not running text.
- **Don't double-frame:** a frame should not contain another frame.
  One level of grouping per visual unit.

**Hover state per cell:**

- Background: shift to `--color-orange-100` (5% orange wash) over
  150ms.
- The dividing hairlines adjacent to the hovered cell remain neutral
  (orange-on-orange would muddy). The single edge of the *outer frame*
  bordering the hovered cell shifts to `--color-orange-600`.
- No translateY, no scale, no shadow. The frame is solid; cells light
  up *inside* the frame.

**Anti-patterns (forbidden):**

- ❌ Cards with `box-shadow` floating on a page background.
- ❌ Cards with their own borders separated by gap.
- ❌ Cards with `border-radius` on each side (gives the
  "rounded-card-stack" look that screams 2018 SaaS).
- ❌ Multiple radii within a frame (only the outer corners are
  rounded; interior cells have sharp corners since they share the
  outer radius via clipping).

**Existing card components to refactor (§8.4 etc.):** the Card
component should be split into two:

- `<SectionFrame>` — the outer hairline-frame container.
- `<FrameCell>` — a child cell. No border of its own, no radius.
- Existing `Card` usage for **standalone** items (rare — only when a
  single card sits alone on a page) keeps its hairline border + radius.

---

## 8. Components

### 8.1 Buttons

Two variants only.

**Primary (filled):**

- Background: `--color-cobalt-900`. Text: white. Hover:
  `--color-cobalt-800`. Active: solid orange ring (1px, 2px offset) on
  focus-visible.
- Padding: `11px 18px`. Font: sans medium 14px.
- Trailing `→` arrow in mono, opacity 0.7.

**Ghost:**

- Background: transparent. Text: `--color-ink-950`. Border: 1px
  `--color-hairline-strong`. Hover: text becomes `--color-orange-600`,
  border stays the same.
- Same padding/font as primary.

**No tertiary, no destructive, no pill, no gradient.** Forbidden.

### 8.2 Links (in body / prose)

- Default: `--color-ink-950`, underlined with `text-decoration-color:
  --color-hairline-strong`, `text-underline-offset: 4px`.
- Hover: `color: --color-orange-600`, underline color matches.
- Visited: same as default (we are not a 1996 wiki).
- External links get a trailing `↗` glyph in mono.

### 8.3 Code chips / tags

```
\ typescript
```

- Background: `--color-orange-100`. Text: `--color-cobalt-900`. Leading
  `\` glyph in `--color-orange-600`.
- `--font-mono`, `--text-xs`, padding `4px 8px`, radius `--radius-xs`.

### 8.4 Cards — almost always inside a SectionFrame

**The default container for grouped content is the section frame
pattern (§7.7), not standalone cards.** Standalone cards are rare and
should be questioned — if there are 2+ similar items, use a frame.

For the rare standalone card (e.g. a single CTA card on a page that
isn't part of a grid):

- Background: `--color-paper-pure`.
- Border: 1px `--color-hairline-strong`. **No shadow. Ever.**
- Radius: `--radius-sm`.
- Hover: border color shifts to `--color-orange-600` over 150ms. No
  translateY, no scale, no box-shadow.

For grouped cards (project tiles, article tiles, service tiles, value
tiles, testimonial tiles): use `<SectionFrame>` + `<FrameCell>` per
§7.7. Cells have no border of their own and no individual radius.

### 8.5 Forms

- Inputs: 1px hairline border, no fill, sans 14px, padding `10px 12px`.
- Focus: 2px orange outline, 2px offset. Border becomes
  `--color-cobalt-900`.
- Labels: mono uppercase eyebrow above the input.
- Error state: 1px orange border, error text in orange below input.

---

## 9. Motion

**Principles:**

- Every interaction has a state change ≤ 200ms. Nothing slower.
- Default ease: `cubic-bezier(0.4, 0, 0.2, 1)` (Material's "standard easing" — applied via Tailwind `ease-[cubic-bezier(0.4,0,0.2,1)]` or a CSS variable).
- Reduce motion: respect `prefers-reduced-motion: reduce` and disable all
  non-essential motion (the header collapse stays — it's structural).
- No bouncy springs. No parallax. No scroll-jacking.

**Named micro-interactions:**

| Name                | Trigger                            | Behavior                                                                 |
| ------------------- | ---------------------------------- | ------------------------------------------------------------------------ |
| `header-collapse`   | Scroll past 80px                   | Wordmark fades + collapses, header height shrinks (see §5.4)             |
| `nav-hover`         | Hover any header nav link          | Orange `\` glyph fades in to the left of the link, 120ms                 |
| `link-underline`    | Hover any in-prose link            | Underline color animates to orange over 100ms                            |
| `card-border`       | Hover a card                       | Border color shifts to orange over 150ms                                 |
| `cta-arrow-nudge`   | Hover a primary button             | Trailing `→` translates +2px on x-axis over 120ms                        |
| `eyebrow-counter`   | First scroll into a section        | The `01`, `02`, ... numeric in eyebrows count up from 00 over 400ms (intersection observer; once per section) |
| `corner-mark-draw`  | First scroll into a hero/section   | Corner crosses draw in (animate stroke from 0 → full) over 300ms, staggered 60ms (intersection observer; once per section) |
| `service-card-draw` | First scroll into a service card   | SVG visualization assembles via stroke-dasharray + opacity, ≤1500ms total per card, staggered. See §7.5. |
| `service-card-hover`| Hover a service card (Tier 1)      | Ambient micro-loop in orange (indicator slides / bars rebar / data dots flow), 1.4–2s loop, paused on mouseleave. See §7.5. |
| `value-glyph-pulse` | Hover a value card (Tier 2)        | Orange accent stroke/dot pulses 0.5 → 1 opacity, 1s, alternate, infinite. See §7.6. |

That's the entire motion catalog. **Do not add motion outside this list
without flagging.**

---

## 10. Dark mode

**Status: open decision.** Light mode ships first (per user direction).
Dark mode is a follow-up phase.

Tentative mapping for when we get there:

```
Light                 Dark
--color-paper      → --color-cobalt-950 (#050E1F)
--color-paper-pure → --color-cobalt-900 (#0A2540)  /* surfaces */
--color-ink-950    → #FAFAFA  /* body text */
--color-cobalt-900 → #FFFFFF  /* anchor — H1 inverts to pure white */
--color-orange-600 → #FF6B14  /* slightly brighter to compensate for dark surround */
--color-hairline   → #1A2A42
```

**Open questions:**

- Does the cobalt anchor still anchor in dark mode, or does white take over
  that role? (My instinct: white H1, cobalt becomes the surface — the
  anchor migrates from "the loud color" to "the quiet color" in dark mode.)
- How do the corner cross marks render against a dark background? Probably
  same orange, but at lower opacity.
- Toggle UX: respect `prefers-color-scheme`, with optional manual toggle in
  the footer? Or no manual toggle at all?

To be grilled when we get to phase 2.

---

## 11. Anti-slop guardrails

Hard rules. Agents implementing the redesign **must not** violate these
without explicit user approval.

1. **No new color values.** Every color in the codebase resolves to a
   token in §4.1. If you need a color that isn't there, propose adding it
   to the scale; do not inline a hex.
2. **No new font sizes.** Use the type scale in §4.2. Same propose-or-stop
   rule.
3. **No arbitrary Tailwind values** (`text-[17px]`, `p-[23px]`,
   `bg-[#abc123]`). Forbidden. If the scale doesn't have it, the design is
   wrong.
4. **No box-shadows. Anywhere.** Borders + the section frame pattern
   (§7.7) + the corner crosses carry depth. Shadows = slop in this
   system. Floating-cards-with-shadows is the **single most "old SaaS"
   look** to avoid — when in doubt, use a `<SectionFrame>` instead.
5. **No gradients.** Including subtle ones. The page is flat color +
   hairlines.
6. **No emoji in UI.** None.
7. **No "hero illustrations" or stock photography.** Project screenshots
   in cards are fine; decorative art is not.
8. **No motion outside §9.** No "fancy hover effects." No scroll
   animations beyond the named ones.
9. **No new icon sets.** The corner crosses, the `\`, the `→`, the `↗`
   are the icon system. If a UI surface needs another glyph, ask first.
10. **No second accent color.** If something looks like it needs a
    "second accent," it doesn't — use ink scale.
11. **No "Read more" / "Mehr erfahren" / "Click here" / "Learn more" CTA
    copy.** Action affordances on tiles, cards, and tile-like blocks are
    signalled by an arrow glyph (`→`) only — the title or surrounding
    context carries the meaning. Make the whole tile the link target.
    Reserve text labels for buttons that act on something specific
    ("Kontakt aufnehmen", "Projekt starten") — never for "go look at this
    other thing" links.

---

## 12. Resolved defaults (previously open items)

The implementation agent should follow these defaults. Each is a
considered first cut — flag back to the user *before* deviating, but
otherwise proceed.

### 12.1 Logo SVG asset

Resolved — see §5.1 for the draft SVG and `/tmp/jhb-mark-draft.svg`.
Move into `public/icon.svg` and generate favicon variants. Validate
legibility at 16px before final commit.

### 12.2 Imagery treatment (project screenshots, article covers)

- **Project tile screenshots**: rendered inside a 1px hairline frame
  matching the card's border (`--color-hairline-strong`). No drop shadow.
  No rounded corners on the image itself (the card's `--radius-sm`
  clips them via `overflow: hidden`).
- **Hover behavior**: image stays full color. Card border shifts to
  orange (per §8.4). No image filter changes — the schematic system
  carries the design language; project screenshots stay honest.
- **Article cover images**: same treatment. Centered, 16:9 aspect,
  hairline frame, no shadow.
- **Loading**: all images via `Img` component (per `web/CLAUDE.md`).
  Use `loading="lazy"` for everything below the fold.
- **Aspect ratios**: locked to 16:9 (project tiles, article covers) or
  1:1 (testimonial avatars, author headshots). No free-form ratios.

### 12.3 Header `Kontakt` CTA

**Filled cobalt primary button** (per §8.1 primary). It's the page's
single conversion path; ghost would lose it in the nav. Stays filled in
both expanded and collapsed header states.

### 12.4 Footer architecture

**Restyle, do not restructure.** Keep the current information
architecture (legal links, sitemap columns, contact, social). Apply:

- Background: `--color-cobalt-900` (the only large cobalt fill in the
  whole site — anchors the bottom)
- Text: white / `--color-cobalt-100` for muted
- Top border: 1px `--color-orange-600` hairline accent (full width)
- Corner crosses at the top-left and top-right of the footer (orange,
  per §7.3)
- Mono uppercase column headings, `\` glyph prefix on each
- Small mark in the bottom-left corner

### 12.5 Mobile header

- Collapsed state only — no full wordmark phase on mobile (the screen is
  too narrow for the wordmark + nav lockup).
- Layout: `[mark]` left, `[hamburger]` right. Wordmark hidden.
- Hamburger opens a full-screen overlay nav: paper background, large
  sans nav links, mono labels, orange `\` separators between sections.
- The DE/EN switcher moves into the overlay (not in the collapsed bar).
- Breakpoint: below `768px`.

### 12.6 DE/EN switcher

- **Desktop expanded**: top-right of header, after the `Kontakt` CTA,
  formatted `DE \ EN` with the `\` in `--color-orange-600`. The
  inactive language is `--color-ink-500`, the active is
  `--color-cobalt-900`.
- **Desktop collapsed**: switcher persists but compresses — only the
  active language code is visible (`DE` or `EN`), with a hover state
  revealing the alternate.
- **Mobile**: lives inside the overlay nav (per §12.5).

### 12.7 Live preview / admin toolbar

`PreviewAdminToolbar.astro` is unchanged structurally. Restyle to match
the new system: cobalt background, mono labels, orange accents. Sits
above the header (does not interfere with scroll-collapse).

### 12.8 Page-by-page block sequences

The implementation agent should restyle existing block components in
place rather than restructure the page IA. Block components live in
`src/components/blocks/` and map 1:1 to Payload blocks. Order on the
homepage stays as-is. New pieces:

**Homepage block sequence:**

1. `HeroSection` — H1 + lede + 2 CTAs, masked grid, 4 corner crosses
2. `\ 02 / LEISTUNGEN` eyebrow → **Service bento (Tier 1, §7.5)** — NEW
   block, replaces current 3-column "Leistungen" section
3. `\ 03 / REFERENZEN` eyebrow → existing Projects block, restyled with
   hairline-frame project cards (§12.2)
4. `\ 04 / ÜBER` eyebrow → existing About block, restyled
5. `\ 05 / SOFTWARE DIE BLEIBT` eyebrow → **Value bento (Tier 2, §7.6)** —
   restyled "Software die bleibt" section
6. `\ 06 / KUNDEN SAGEN` eyebrow → existing Testimonials block, restyled
7. Footer

**Other pages** — apply the same patterns:

- **Service detail pages** (`/de/leistungen/<slug>`): use the hero card's
  full visualization at top, then deep-dive content with the same
  eyebrow + section pattern.
- **Project detail** (`/de/referenzen/<slug>`): hero with project name +
  client + tags (mono chips), screenshot grid (§12.2), case study prose
  in the existing `RichText` flow.
- **Article detail** (`/de/artikel/<slug>`): existing layout, restyled.
  Mono eyebrow with date + reading time. Cover image with hairline
  frame. Body uses the existing `RichText` component (no changes to
  prose styles beyond the global token swap).
- **Contact** (`/de/kontakt`): hero + form. Form follows §8.5.

### 12.9 Dark mode

Deferred to phase 2 — see §10.

---

## 12.11 Overriding CMS content during redesign

Some CMS content (`title`, `subTitle`, descriptions, labels) was authored
for the old layout and doesn't fit the new patterns — e.g. a section
"subtitle" that's a full descriptive sentence won't work as the short
heading the redesign §7.4 calls for. **It is acceptable to hardcode an
override in the corresponding Astro component** rather than block on a
CMS migration.

Rules:

- Mark every override with a `// TODO(cms-content): …` comment that
  describes (a) what was overridden, (b) the proposed CMS field
  shape, and (c) the affected pages, so we can reconcile in a later
  CMS pass.
- Prefer **layout overrides** (e.g. render `subTitle` as a smaller
  lede instead of a giant heading) over **content overrides** when
  possible — they don't drift from the source of truth.
- When you must override copy, render it from a per-block constant
  near the top of the component, not inline, so future CMS migration
  is a search-and-replace.
- Do **not** override hero copy (`HeroSection.title`, `subtitle`) —
  those are user-facing brand copy and need user judgment per §12.10.

## 12.10 Still genuinely open (flag to user during implementation)

These need human judgment that we couldn't pre-resolve:

- **Service detail pages content** — the current site may not have full
  detail pages for each service. If the implementation agent creates
  them, the user should review the page IA before content is written.
- **Hero copy changes** — the redesign keeps content as-is, but the H1
  may benefit from light editing once typography is in place. Flag any
  proposed copy changes; do not change autonomously.
- **Logo asset final approval** — the §5.1 SVG is a draft. User must
  approve the rendered output before it replaces `public/icon.svg`.

---

## 13. Implementation sequencing

When we move to build, do it in this order. Do **not** parallelize across
all pages — the design system needs to stabilize on one page before
fanning out, or we drift.

1. **Token layer** — update `src/styles.css` with the new `@theme` block
   (color, font, type scale, radii). Ship Geist via the `geist` npm
   package.
2. **Logo SVG** — replace `public/icon.svg` with the new mark. Add OG/social variants.
3. **Header + footer + Layout.astro** — rebuild the header with the
   scroll-collapse, the new lockup, the new nav/lang switcher. Restyle
   the footer.
4. **Homepage end-to-end** — restyle every block on the homepage as a
   prototype of the system. Iterate visually until happy.
5. **Component primitives** — once the homepage is locked, extract any
   patterns into reusable components (Section, Eyebrow, CornerCrosses,
   Chip, etc.).
6. **Other pages** — apply the system to services, projects, articles,
   contact. Largely mechanical at this point.
7. **Dark mode** — separate phase.

---

## 14. CLAUDE.md additions (to write after sign-off)

Once this spec is locked and partially implemented, add a `redesign`
skill or update `web/CLAUDE.md` with:

- The token scale reference
- The brand `\` thread rule
- The motion catalog
- The anti-slop guardrails (§11) verbatim — these need to be loaded into
  every agent's context, not just at the start of the redesign.

---

## Changelog

- **2026-05-02** — Initial draft. Locked: color (cobalt + orange),
  typography (Geist Sans + Mono), logo system (two-tier, tile-grid mark
  with `\` diagonal, clean wordmark, Anthropic-style scroll collapse),
  brand `\` thread, layout grid + corner crosses, component patterns,
  motion catalog, anti-slop guardrails. Open: dark mode, logo SVG, page
  structures, imagery treatment.
- **2026-05-02** — Added §7.5 service grid (Tier 1) and §7.6 value grid
  (Tier 2). Vercel-style schematic visualizations per service card,
  scroll-in + hover micro-interactions. Working prototype at
  `/tmp/jhb-service-grid.html`. Updated motion catalog with three new
  named interactions.
- **2026-05-02** — Service grid converted from equal-3-up to **bento
  layout** (1 hero + 2 stacked compact). Webanwendungen designated as
  hero card. §7.5 updated with bento spec and per-size sizing rules.
- **2026-05-02** — Resolved §12 open items into defaults: logo SVG draft
  inlined in §5.1, imagery treatment, header CTA filled, footer
  restyle (cobalt fill + orange accents), mobile header (collapsed +
  overlay nav), DE/EN switcher rules, page-by-page block sequencing.
  Plan now ready for implementation handoff.
- **2026-05-02** — Added §7.7 **section framing pattern** (the Vercel
  signature): grouped cells share an outer frame with interior hairlines
  rather than rendering as floating cards with gaps. Bento (§7.5) and
  value grid (§7.6) updated to follow the frame pattern. §8.4 (cards)
  and §11 (anti-slop rule #4) updated to reinforce. Prototype at
  `/tmp/jhb-service-grid.html` updated to demonstrate the pattern.
- **2026-05-02** — References split into §2.1 (visual/interaction —
  vercel.com, payloadcms.com, aihero.dev, anthropic.com) and §2.2
  (content — Vercel design guidelines, linked for documentation, not
  appearance).
