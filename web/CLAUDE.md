# Frontend (Astro)

Astro static site generation with dynamic CMS integration. Tailwind CSS v4 with custom design tokens. SSR is used only for `/preview` pages.

## Directory layout

- `src/components/` — reusable `.astro` components
  - `src/components/blocks/` — components rendering CMS blocks (same names as the CMS block files)
- `src/layout/` — layout components (`HeroSection.astro`, `Footer.astro`, …)
  - `src/layout/collections/` — per-collection layouts (e.g. `ArticleLayout.astro`)
- `src/pages/` — dynamic routing
- `src/schema/` — JSON-LD structured data (see below)

## Environment variables

Use Astro's type-safe env, never `import.meta.env` directly.

1. Declare in `astro.config.mjs` under `env.schema`
2. Import from `astro:env/client` or `astro:env/server`

## View transitions

The site uses `<ClientRouter />`, so client `<script>` tags must run on every navigation, not just initial load.

- Wrap setup in the `astro:page-load` event (fires on initial load *and* after every client-side navigation)
- Never query the DOM at module scope — the elements won't exist after navigation

```typescript
// Bad — only runs once
const button = document.getElementById("my-button");
button?.addEventListener("click", handleClick);

// Good — runs on every page visit
document.addEventListener("astro:page-load", () => {
  const button = document.getElementById("my-button");
  button?.addEventListener("click", handleClick);
});
```

## Structured data (JSON-LD)

All schemas live in `src/schema/`.

1. **One file per type** — e.g. `article.ts`, `author.ts`
2. **Export name** — the main function is `{contentType}Schema` (e.g. `articleSchema`)
3. **Return type** — `WithContext<SchemaType>` from `schema-dts`
4. **URLs** — always `new URL(path, SITE_URL)`. Do **not** use `normalizePath`
5. **Usage** — call the schema function in a layout and render with `<Schema item={schema} />`

## Commands

```bash
pnpm dev
pnpm build
pnpm check
pnpm lint
```
