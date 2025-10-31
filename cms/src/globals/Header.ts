import { GlobalConfig } from 'payload'

import { linksField } from '@/fields/links'
import { anyone } from '@/shared/access/anyone'
import { authenticated } from '@/shared/access/authenticated'

const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: anyone,
    update: authenticated,
  },
  label: {
    de: 'Kopfzeile',
    en: 'Header',
  },
  fields: [linksField({ name: 'links', maxRows: 6, relationTo: ['pages'] })],
}

export default Header
