import { linkFields } from '@/fields/link'
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
    {
      name: 'links',
      label: 'Links',
      type: 'array',
      fields: linkFields({ relationTo: ['pages'] }),
    },
  ],
}

export default Footer
