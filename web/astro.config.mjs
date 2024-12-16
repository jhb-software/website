// @ts-check
import { defineConfig, envField } from 'astro/config'

import tailwind from '@astrojs/tailwind'

export default defineConfig({
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
    },
  },
})
