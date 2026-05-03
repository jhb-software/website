# May 2026 Website Rework - Roadmap

Phases are strictly sequential — Phase 2 starts only after Phase 1 ships. No fixed launch date.

## Phase 1 — Visual redesign

New corporate design and identity. See `design.md` for the full visual spec.

- [x] Migrate all web components to the new design
- [x] Write `design.md`
- [x] Audit every page at sm/md/lg breakpoints and fix broken layouts
- [ ] Deduplicate and extract shared abstractions in files touched by the redesign (Heading, MetaStrip, Eyebrow are precedents)
- [ ] Address existing `TODO` comments for CMS collections and blocks
- [ ] Restyle the CMS OG/cover image generation endpoint to the new design (template/styling only, keep current implementation)
- [ ] Redesign static OG images for non-CMS pages (home, about, contact, etc.)
- [ ] Design new logo, then ship the SVG and replace all usages in `web/` and `cms/`
- [ ] Specify background pattern/texture in `design.md`, then implement across the site

## Phase 2 — Writing

- [ ] Write a tonality guide for humans and the CMS agent chat (rules, examples, do/don't pairs); expose it as context in the agent chat
- [ ] Rewrite copy on every existing page to match the tonality guide (existing pages only, no new pages)
- [ ] Rewrite all existing articles (including German) — AI drafts, manual edit pass
