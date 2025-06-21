import { linksField } from '@/fields/links'
import { socialLinksField } from '@/fields/socialLinks'
import { anyone } from '@/shared/access/anyone'
import { authenticated } from '@/shared/access/authenticated'
import { GlobalConfig } from 'payload'

const Footer: GlobalConfig = {
  slug: 'footer',
  label: {
    de: 'Fußzeile',
    en: 'Footer',
  },
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    linksField({ name: 'links', relationTo: ['pages'], maxRows: 6 }),
    socialLinksField({ name: 'socialLinks', required: true, minRows: 1 }),
  ],
}

export default Footer
