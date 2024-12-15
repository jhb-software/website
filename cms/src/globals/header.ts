import { linkFields } from '@/fields/link'
import { GlobalConfig } from 'payload'

const Header: GlobalConfig = {
  slug: 'header',
  label: {
    de: 'Kopfzeile',
    en: 'Header',
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

export default Header
