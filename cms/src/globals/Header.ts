import { linksField } from '@/fields/links'
import { anyone } from '@/shared/access/anyone'
import { authenticated } from '@/shared/access/authenticated'
import { GlobalConfig } from 'payload'

const Header: GlobalConfig = {
  slug: 'header',
  label: {
    de: 'Kopfzeile',
    en: 'Header',
  },
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [linksField({ name: 'links', relationTo: ['pages'], maxRows: 6 })],
}

export default Header
