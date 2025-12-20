import { GlobalConfig } from 'payload'

import { linksField } from '@/fields/links'
import { socialLinksField } from '@/fields/socialLinks'
import { anyone } from '@/shared/access/anyone'
import { authenticated } from '@/shared/access/authenticated'

const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: anyone,
    update: authenticated,
  },
  label: {
    de: 'Fußzeile',
    en: 'Footer',
  },
  fields: [
    linksField({ name: 'links', maxRows: 6, relationTo: ['pages'] }),
    socialLinksField({ name: 'socialLinks', minRows: 1, required: true }),
  ],
}

export default Footer
