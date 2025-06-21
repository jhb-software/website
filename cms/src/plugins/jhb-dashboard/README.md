# JHB Dashboard Plugin

This plugin is utilized by all CMS apps used by JHB Software in website projects to integrate a custom dashboard component. It provides a comprehensive overview of various aspects of the website through multiple cards.

It is not pushed to npm because there is no reason for it to be a public package.

## Features

The dashboard includes the following features, which can be enabled or disabled via the plugin configuration:

- **Deployment Info**: Displays information about the current deployment status and allows to trigger a rebuild of the website.

Other features are work in progress.

## Requirements

### Environment Variables

The following environment variables are required for the plugin to work:

- `VERCEL_API_TOKEN`: The API token for the Vercel API.
- `FRONTEND_VERCEL_PROJECT_ID`: The ID of the Vercel project for the frontend.
- `FRONTEND_VERCEL_TEAM_ID`: The ID of the Vercel team for the frontend.

### Tailwind CSS

Tailwind CSS must be configured in the project for the dashboard cards to work. See the `app/(payload)/custom.scss` and the `postcss.config.mjs` files from the template project for more information.

### Packages / Dependencies

The following packages are required for the plugin to work:

- `@payloadcms/ui`
- `@payloadcms/translations`
- `tailwindcss`
- `@tailwindcss/postcss`
- `postcss`

Install the packages:

```bash
pnpm add @payloadcms/ui @payloadcms/translations tailwindcss @tailwindcss/postcss postcss
```
