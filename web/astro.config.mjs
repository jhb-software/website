// @ts-check
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, envField } from 'astro/config'
import { getRedirects } from './src/cms/getRedirects'

export default defineConfig({
  redirects: await getRedirects(),
  adapter: vercel({
    edgeMiddleware: true,
  }),
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
