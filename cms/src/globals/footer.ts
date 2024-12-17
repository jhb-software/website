import { linksField } from '@/fields/links'
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
  fields: [linksField({ name: 'links', relationTo: ['pages'], maxRows: 6 })],
}

export default Footer
