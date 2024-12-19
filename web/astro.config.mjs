// @ts-check
import tailwind from '@astrojs/tailwind'
import vercel from '@astrojs/vercel'
import { defineConfig, envField } from 'astro/config'

export default defineConfig({
  adapter: vercel({
    edgeMiddleware: true,
  }),
  integrations: [tailwind()],
  trailingSlash: 'never',
  env: {
    schema: {
      SITE_URL: envField.string({
        context: 'client',
        access: 'public',
      }),
      CMS_URL: envField.string({
        context: 'server',
        access: 'secret',
      }),
      PUBLIC_CLOUDINARY_CLOUD_NAME: envField.string({
        context: 'server',
        access: 'public',
      }),
    },
  },
})
