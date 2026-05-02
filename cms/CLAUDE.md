# CMS (Payload v3)

Modular collection + block system under `src/`.

## Directory layout

- `collections/` — content types, **plural** names (e.g. `Articles.ts`)
- `blocks/` — reusable content blocks mapped to frontend components. Suffix `Block` (e.g. `AuthorsListBlock.ts`)
- `globals/` — site-wide settings (`Header`, `Footer`, `Labels`)
- `endpoints/` — custom HTTP API endpoints
- `fields/` — reusable fields (e.g. `heroSection` used by the `pages` collection)

## Patterns

- Hierarchical page structure and path generation use [@jhb.software/payload-pages-plugin](https://github.com/jhb-software/payload-pages-plugin).

## Types

- After any schema change, run `pnpm generate:types`.
- Components must type their props with the generated CMS types. Reuse existing types; avoid type assertions.

## Commands

```bash
pnpm dev
pnpm build
pnpm generate:types
pnpm generate:importmap
pnpm lint
```
