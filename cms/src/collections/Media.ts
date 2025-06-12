import { anyone } from '@/shared/access/anyone'
import { authenticated } from '@/shared/access/authenticated'
import { CollectionGroups } from '@/shared/CollectionGroups'
import { CollectionConfig } from 'payload'
import { AltTextField } from 'plugins/llm-alt-text-generator/AltTextField'
import { injectBulkGenerateButton } from 'plugins/llm-alt-text-generator/injectBulkGenerateButton'

export const Media: CollectionConfig = injectBulkGenerateButton({
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
      name: 'context',
      label: 'Context',
      type: 'text',
      required: false,
      localized: true,
      admin: {
        description:
          'Details not visible in the image (such as the location or event). Used to enhance AI-generated alt text with additional context.',
      },
    },
    AltTextField({
      label: {
        de: 'Alternativer Text',
        en: 'Alternative Text',
      },
      localized: true,
    }),
    {
      name: 'keywords',
      label: 'Keywords',
      type: 'text',
      hasMany: true,
      required: false,
      localized: true,
      hidden: true, // this field is currently not used, but it is kept for future use
      admin: {
        description: 'Keywords which describe the image. Used for searching the image.',
        readOnly: true,
      },
    },
  ],
})
