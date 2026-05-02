# JHB Software Website

Payload CMS (Next.js) backend in `/cms`, Astro static frontend in `/web`. Managed with pnpm.

See `cms/CLAUDE.md` and `web/CLAUDE.md` for area-specific conventions.

## Before committing

- `/cms`: `pnpm lint` and `pnpm format`
- `/web`: `pnpm lint`, `pnpm check`, and `pnpm format`
- If CMS schema changed: run `pnpm generate:types` in `/cms` so `/web` picks up the updated types.
