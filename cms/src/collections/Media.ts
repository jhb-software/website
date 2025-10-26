import { Media as MediaType } from '@/payload-types'
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
    defaultColumns: ['filename', 'title', 'alt', 'createdAt', 'updatedAt'],
  },
  upload: {
    mimeTypes: ['image/*', 'application/pdf'],
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
        width: 1200,
        height: 630,
      },
    ],
    hideRemoveFile: true, // disable this feature as it is not intuitive for the user what implications it has
    adminThumbnail: ({ doc }) => {
      // Use the direct URLs to the S3 bucket instead of the default /api/media URL to improve performance.
      // (Because disablePayloadAccessControl is true, the URLs are the direct URLs to the S3 bucket.)
      const media = doc as unknown as MediaType
      const directUrl =
        media.sizes?.sm?.url ?? media.sizes?.md?.url ?? media.sizes?.lg?.url ?? media.url ?? null

      if (!directUrl) {
        console.warn('Could not find adminThumbnail URL. Doc:', doc)
      }

      return directUrl
    },
  },
  access: {
    read: anyone,
    update: authenticated,
    delete: authenticated,
    create: authenticated,
  },
  fields: [
    // the alt text and keywords fields are added by the plugin
  ],
}
