import { RedirectsCollectionConfig } from '@jhb.software/payload-pages-plugin'

import { anyone } from '@/shared/access/anyone'
import { authenticated } from '@/shared/access/authenticated'
import { CollectionGroups } from '@/shared/CollectionGroups'

export const Redirects: RedirectsCollectionConfig = {
  slug: 'redirects',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: CollectionGroups.SystemCollections,
  },
  labels: {
    plural: {
      de: 'Weiterleitungen',
      en: 'Redirects',
    },
    singular: {
      de: 'Weiterleitung',
      en: 'Redirect',
    },
  },
  redirects: {},
  fields: [
    // the fields are added by the plugin
  ],
}
