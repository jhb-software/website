# JHB Software — Design

Short, load-into-context brand & visual reference for AI-driven UI work.

## Vision

Modern, technical, engineering craft. Forward-looking, clean, minimal, high
quality. Reads as **considered engineering**, not "agency template" — deep
cobalt for gravitas, hot orange doing every interactive job, heavy mono for
labels and code, hairline framing instead of floating cards.

Audience: CEOs, CTOs, and product owners (DE + international) needing an
experienced developer for custom software.

Reference: [vercel.com/design/guidelines](https://vercel.com/design/guidelines)
— for principles and accessibility patterns, not appearance.

## Color

```
--color-cobalt-950: #050E1F
--color-cobalt-900: #0A2540   ANCHOR — H1, primary buttons, mark, footer
--color-cobalt-800: #14365C   hover on cobalt
--color-cobalt-100: #E8EEF7

--color-orange-600: #FF5C00   ACCENT — focus, link hover, corner marks, `\`
--color-orange-100: #FFF1E8

--color-ink-950:    #0A0A0A
--color-ink-700:    #404040
--color-ink-500:    #737373
--color-ink-300:    #A3A3A3

--color-paper:      #FAFAFA
--color-paper-pure: #FFFFFF

--color-hairline:        #ECECEC
--color-hairline-strong: #D4D4D4
```

Cobalt 900 anchors — never body text or body backgrounds. Orange 600 is
interactive only — never body text, never a fill larger than ~40px. Tokens
live in `web/src/styles.css` under `@theme`.

## Typography

Geist Sans + Geist Mono, self-hosted via the `geist` npm package.

**Mono** for: eyebrows, form labels, code chips, breadcrumb separators,
file paths, stats numerals.
**Sans** for: everything else.

Headings tight (`line-height: 1.05`, `letter-spacing: -0.025em`). Body 1.55.
Mono uppercase eyebrows tracked `0.12em`.

## Signature patterns

The four patterns that make a JHB page recognizable.

### Section framing — `<SectionFrame>` + `<FrameCell>`

Default container for grouped content: **one outer hairline frame with
interior dividers** — not floating cards with gaps. Cells share borders. The
frame *is* the depth. Components in `web/src/layout/`.

Use for any 2+ related cells (services, values, projects, stats, FAQ). Don't
use for prose, single CTAs, running text.

Hover a cell → cell background → `--color-orange-100`; the outer frame edge
adjacent to the hovered cell → `--color-orange-600`. No translateY, no scale.

### Corner marks — `<CornerMark>`

Four `+` registration marks at the inner corners of major frames (hero, key
sections, footer top). 14px wide, 1px stroke, orange. One pair per block.
Component at `web/src/layout/CornerMark.astro`.

### Mono eyebrows

Above every major section heading:

```
\ 02 / LEISTUNGEN
Individuelle Software für Dein Unternehmen
```

Eyebrow: mono, `text-xs`, uppercase, tracking `0.12em`, `--color-ink-500`.
Leading `\` is orange. Heading: sans 600, cobalt 900.

### The `\` thread

The backslash is a recurring system element — separator, namespace, code
context. Always rendered in mono and orange.

Locations: breadcrumbs (`Home \ Articles \ Post`), language switcher
(`DE \ EN`), code chip prefix (`\ typescript`), section eyebrows, nav-hover
indicator. Never inside body prose. Never decorative.

## Imagery

**Allowed:** project screenshots (16:9, hairline frame), article covers
(16:9, hairline frame), headshots (1:1), schematic SVG visualizations
(strokes only, cobalt + orange), customer logos, sparing team photos on
About / Footer (1:1, hairline frame).

**Forbidden:** stock photography, decorative illustrations, hero art,
multi-color illustrations, drop shadows on images.

All images via the `Img` component. `loading="lazy"` below the fold.

## Iconography

**One library: Geist Icons.** Every glyph in the UI — social marks, nav,
buttons, card affordances, error pages — is a Geist icon. No mixing with
Lucide, Font Awesome, Heroicons, or one-off custom SVGs. If a concept isn't
in Geist, pick the closest Geist glyph rather than introduce a second style.

Visually: thin outlined strokes, square endcaps rounded, `currentColor` so
icons inherit text color. Never filled, never two-tone, never colored
outside the ink + cobalt + orange palette.

Conventions:

- Contact / messaging affordances use the chat-bubble glyph (Geist
  `messageSquare`). This is the icon next to "Kontakt".
- Social marks use Geist's brand glyphs. WhatsApp has no dedicated Geist
  mark — it falls back to the same chat bubble. Acceptable trade for a
  single-library system.
- Tile and CTA "go-to" affordances use the Geist `arrow-right` glyph (see
  Anti-slop #7).
- Disclosure controls use Geist `chevron-*`.
- Service category icons use the closest literal Geist glyph
  (`smartphone`, `monitor`, `code`) rather than ornamental illustrations.

## Motion

State changes ≤200ms. Default ease `cubic-bezier(0.4, 0, 0.2, 1)`. No bouncy
springs, no parallax, no scroll-jacking. Respect `prefers-reduced-motion`.

Named interactions (the entire catalog — don't add motion outside this list):
`header-collapse`, `nav-hover`, `link-underline`, `card-border`,
`cta-arrow-nudge`, `eyebrow-counter`, `corner-mark-draw`.

## Anti-slop guardrails

1. **No new color values, font sizes, or arbitrary Tailwind values.** If the
   scale is missing something, the design is wrong, not the scale.
2. **No rounded corners.** Sharp edges everywhere. No `border-radius`, no
   `rounded-*` Tailwind classes. Only exception: true circles (avatars).
3. **No box-shadows. Anywhere.** Borders, frames, and `<CornerMark>`s carry
   depth.
4. **No gradients.** The page is flat color + hairlines.
5. **No emoji in UI. No stock photography. No hero illustrations.**
6. **No second accent color.** Use the ink scale.
7. **No "Read more" / "Mehr erfahren" / "Click here".** Action affordances on
   tiles are the Geist `arrow-right` icon only — make the whole tile the link.
8. **No icons outside Geist.** See [Iconography](#iconography). No mixing
   libraries, no one-off inline SVG glyphs, no emoji-as-icon.
