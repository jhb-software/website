# May 2026 Website Rework - Roadmap

Phases are strictly sequential — Phase 2 starts only after Phase 1 ships. No fixed launch date.

## Phase 1 — Visual redesign

New corporate design and identity. See `design.md` for the full visual spec.

- [x] Migrate all web components to the new design
- [x] Write `design.md`
- [x] Audit every page at sm/md/lg breakpoints and fix broken layouts
- [x] Design new logo, then ship the SVG and replace all usages in `web/` and `cms/`
- [ ] Address existing `TODO` comments for CMS collections and blocks
  - [ ] While doing this, deduplicate and extract shared abstractions in files touched by the redesign (Heading, MetaStrip, Eyebrow are precedents)
- [ ] Create a system for dynamic OG images based on the pages hero frame + the company logo
- [ ] Specify a subtle background pattern/texture for outside of the frame boxes in `design.md`, then implement across the site

## Phase 2 — Writing

- [ ] Write a tonality guide for humans and the CMS agent chat (rules, examples, do/don't pairs); expose it as context in the agent chat
- [ ] Rewrite copy on every existing page to match the tonality guide (existing pages only, no new pages)
- [ ] Rewrite all existing articles (including German) — AI drafts, manual edit pass
