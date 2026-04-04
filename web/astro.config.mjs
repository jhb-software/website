// @ts-check
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, envField } from 'astro/config'
import { getRedirects } from './src/cms/getRedirects'
import { htmlToMarkdown } from './src/integrations/htmlToMarkdown'

export default defineConfig({
  redirects: await getRedirects(),
  integrations: [htmlToMarkdown()],
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
  trailingSlash: 'never',
  env: {
    schema: {
      SITE_URL: envField.string({
        context: 'client',
        access: 'public',
      }),
      CMS_URL: envField.string({
        context: 'client',
        access: 'public',
      }),
      VERCEL_ENV: envField.enum({
        values: ['production', 'preview', 'development'],
        context: 'server',
        access: 'public',
      }),
      CMS_VERCEL_AUTOMATION_BYPASS_SECRET: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
    },
  },
})
