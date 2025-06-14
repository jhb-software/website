import { linksField } from '@/fields/links'
import { socialLinksField } from '@/fields/socialLinks'
import { GlobalConfig } from 'payload'

const Footer: GlobalConfig = {
  slug: 'footer',
  label: {
    de: 'Fußzeile',
    en: 'Footer',
  },
  access: {
    read: () => true,
  },
  fields: [
    linksField({ name: 'links', relationTo: ['pages'], maxRows: 6 }),
    socialLinksField({ name: 'socialLinks', required: true, minRows: 1 }),
  ],
}

export default Footer
