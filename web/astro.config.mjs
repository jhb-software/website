// @ts-check
import { defineConfig, envField } from 'astro/config'

import tailwind from '@astrojs/tailwind'

export default defineConfig({
  integrations: [tailwind()],
  env:{
    schema: {
      CMS_URL: envField.string({
        context: 'server',
        access: 'secret',
      }),
    },
  },
})
