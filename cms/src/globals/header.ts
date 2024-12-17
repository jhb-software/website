import { linksField } from '@/fields/links'
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
  fields: [linksField({ name: 'links', relationTo: ['pages'], maxRows: 6 })],
}

export default Header
