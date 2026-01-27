import { CollectionConfig } from 'payload'

import type { Image } from '@/payload-types'

import { anyone } from '@/shared/access/anyone'
import { authenticated } from '@/shared/access/authenticated'
import { CollectionGroups } from '@/shared/CollectionGroups'

export const Images: CollectionConfig = {
  slug: 'images',
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
      de: 'Bilder',
      en: 'Images',
    },
    singular: {
      de: 'Bild',
      en: 'Image',
    },
  },
  upload: {
    adminThumbnail: ({ doc }) => {
      // Specifying a function as adminThumbnail is the only way to fall back to different sizes.
      const image = doc as unknown as Image

      // With the new Payload version, URLs are now stored in the DB and can be accessed directly
      return (
        image.sizes?.sm?.url ||
        image.sizes?.md?.url ||
        image.sizes?.lg?.url ||
        image.url ||
        undefined
      )
    },
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
    mimeTypes: ['image/*'],
  },
  fields: [
    // the alt text and keywords fields are added by the plugin
  ],
}
