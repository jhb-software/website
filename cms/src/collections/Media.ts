import { anyone } from '@/shared/access/anyone'
import { authenticated } from '@/shared/access/authenticated'
import { CollectionGroups } from '@/shared/CollectionGroups'
import { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: {
      de: 'Mediendatei',
      en: 'Media File',
    },
    plural: {
      de: 'Medien',
      en: 'Media',
    },
  },
  admin: {
    group: CollectionGroups.MediaCollections,
  },
  access: {
    read: anyone,
    update: authenticated,
    delete: authenticated,
    create: authenticated,
  },
  fields: [
    // The other fields are automatically added by the plugin
    {
      name: 'alt',
      label: {
        de: 'Alternativer Text',
        en: 'Alternative Text',
      },
      type: 'text',
      required: true,
      localized: true,
    },
  ],
}
