import { CollectionConfig } from 'payload'

import { anyone } from '@/shared/access/anyone'
import { authenticated } from '@/shared/access/authenticated'
import { CollectionGroups } from '@/shared/CollectionGroups'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['filename', 'title', 'alt', 'createdAt', 'updatedAt'],
    group: CollectionGroups.MediaCollections,
  },
  labels: {
    plural: {
      de: 'Medien',
      en: 'Media',
    },
    singular: {
      de: 'Mediendatei',
      en: 'Media File',
    },
  },
  upload: {
    hideRemoveFile: true, // disable this feature as it is not intuitive for the user what implications it has
    imageSizes: [
      {
        name: 'xs',
        width: 480,
      },
      {
        name: 'sm',
        width: 768,
      },
      {
        name: 'md',
        width: 1024,
      },
      {
        name: 'lg',
        width: 1920,
      },
      {
        name: 'xl',
        width: 2560,
      },
      {
        // optimal size for an Open Graph (OG) image
        name: 'og',
        height: 630,
        width: 1200,
      },
    ],
  },
  fields: [
    // the alt text and keywords fields are added by the plugin
  ],
}
