import { anyone } from '@/shared/access/anyone'
import { authenticated } from '@/shared/access/authenticated'
import { CollectionGroups } from '@/shared/CollectionGroups'
import { RedirectsCollectionConfig } from '@jhb.software/payload-pages-plugin'

export const Redirects: RedirectsCollectionConfig = {
  slug: 'redirects',
  admin: {
    group: CollectionGroups.SystemCollections,
  },
  access: {
    read: anyone,
    update: authenticated,
    delete: authenticated,
    create: authenticated,
  },
  redirects: {},
  labels: {
    singular: {
      de: 'Weiterleitung',
      en: 'Redirect',
    },
    plural: {
      de: 'Weiterleitungen',
      en: 'Redirects',
    },
  },
  fields: [
    // the fields are added by the plugin
  ],
}
