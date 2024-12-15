import { createRedirectsCollectionConfig } from '@jhb.software/payload-pages-plugin'
import { CollectionGroups } from '@/shared/CollectionGroups'

export const Redirects = createRedirectsCollectionConfig({
  overrides: {
    admin: {
      group: CollectionGroups.SystemCollections,
    },
  },
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
})
