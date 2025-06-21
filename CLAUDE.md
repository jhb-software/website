# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a monorepo for the JHB Software company website consisting of:

- **Frontend** (`/web`): Astro-based static site with Tailwind CSS
- **CMS** (`/cms`): Payload CMS with Next.js for content management
- **Plugin** (`/cms/plugins/cms-content-translator`): Custom translation plugin

## Essential Commands

### CMS Development (`/cms`)

```bash
cd cms
pnpm dev              # Start development server (default: http://localhost:3000)
pnpm build            # Build for production
pnpm generate:types   # Generate TypeScript types from Payload schema
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
```

### Frontend Development (`/web`)

```bash
cd web
pnpm dev              # Start Astro dev server (default: http://localhost:4321)
pnpm build            # Build static site
pnpm preview          # Preview production build
pnpm check            # Run Astro type checking
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
```

### Global Commands

```bash
pnpm install          # Install all dependencies (run from root)
```

## Architecture Overview

### CMS Architecture

The CMS uses Payload v3 with a modular collection and block system:

- **Collections** (`/cms/src/collections/`): Define content types (Articles, Authors, Projects, etc.)
- **Blocks** (`/cms/src/blocks/`): Reusable content blocks that map to frontend components
- **Globals** (`/cms/src/globals/`): Site-wide settings (Header, Footer, Translations)
- **Access Control**: Role-based permissions defined in each collection
- **Media Handling**: Cloud storage integration with automatic image optimization

Key architectural decisions:

- Lexical rich text editor for content editing
- Draft/publish workflow with versioning
- AI-powered translation and alt text generation via OpenAI
- Custom dashboard plugin for enhanced CMS experience

### Frontend Architecture

The frontend uses Astro's static site generation with dynamic CMS integration:

- **Dynamic Routing**: Language-based routing with `[lang]/[...path].astro`
- **CMS SDK** (`/web/src/cms-sdk/`): Type-safe data fetching from Payload
- **Component Mapping**: Each CMS block has a corresponding Astro component
- **Layouts**: Reusable layouts for different content types (Article, Author, Page, Project)
- **SEO**: Automated sitemap generation, structured data, and meta tags

Key architectural patterns:

- Server-side rendering for optimal performance
- Progressive enhancement with minimal client-side JavaScript
- Type-safe CMS data integration using generated types
- Tailwind CSS v4 for styling with custom design tokens

### Content Flow

1. Content is created/edited in the CMS
2. CMS generates TypeScript types for type safety
3. Frontend fetches data via SDK during build
4. Astro generates static pages with dynamic data
5. Deployed to Vercel with edge middleware for routing

### Development Workflow

1. Run CMS locally to manage content
2. Generate types after schema changes: `cd cms && pnpm generate:types`
3. Develop frontend components that consume CMS data
4. Test locally with both services running

## Important Configuration

### Environment Variables

Both packages require environment configuration:

- CMS: Database URL, storage credentials, API keys
- Web: CMS API URL, deployment settings

### TypeScript

Strict mode is enabled across the monorepo. Always ensure type safety when:

- Adding new CMS fields or collections
- Creating frontend components
- Integrating CMS data

### Code Style

- ESLint and Prettier are configured for consistency
- Always run `pnpm lint` and `pnpm format` before committing
- Follow existing patterns for imports and file organization

## Translation Requirements

This is a multi-language website. When adding labels or text to Astro components:

1. **Never hardcode text strings** - All user-facing text must be translatable
2. **Update the CMS translations global** - Add necessary fields to `/cms/src/globals/translations.ts`
3. **Access translations in components** - Use `const { translations } = globalState`
4. **Example usage**: `translations.articles['written-by']` or `translations.global['show-more']`

This ensures all UI text can be properly localized for different languages.

## Task Completion Checklist

When completing any task in this codebase, always perform these quality checks:

### Code Quality

- [ ] Run `pnpm lint` in the `cms` folder to check for linting issues
- [ ] Run `pnpm lint` in the `web` folder to check for linting issues
- [ ] Run `pnpm astro check` in the `web` folder to validate Astro components and TypeScript

### Type Safety

- [ ] If CMS schema was modified, run `cd cms && pnpm generate:types` to update TypeScript types
- [ ] Ensure all new components properly type their props using generated CMS types
