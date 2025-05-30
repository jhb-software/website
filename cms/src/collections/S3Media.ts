import { anyone } from '@/shared/access/anyone'
import { authenticated } from '@/shared/access/authenticated'
import { CollectionGroups } from '@/shared/CollectionGroups'
import { CollectionConfig } from 'payload'

// TODO: merge this with the Media collection once the transition from Cloudinary to Hetzner S3 is complete

export const S3Media: CollectionConfig = {
  slug: 's3-media',
  labels: {
    singular: {
      de: 'S3 Mediendatei',
      en: 'S3 Media File',
    },
    plural: {
      de: 'S3 Medien',
      en: 'S3 Media',
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
    adminThumbnail: 'sm',
  },
  access: {
    read: anyone,
    update: authenticated,
    delete: authenticated,
    create: authenticated,
  },
  fields: [
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
