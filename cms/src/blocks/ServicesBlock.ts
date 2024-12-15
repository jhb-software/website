import { Block } from 'payload'

export const ServicesBlock: Block = {
  slug: 'services',
  interfaceName: 'ServicesBlock',
  labels: {
    singular: {
      de: 'Leistungen Block',
      en: 'Services Block',
    },
    plural: {
      de: 'Leistungen Blöcke',
      en: 'Services Blocks',
    },
  },
  fields: [
    {
      name: 'services',
      label: {
        de: 'Leistungen',
        en: 'Services',
      },
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
          label: {
            de: 'Titel',
            en: 'Title',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          localized: true,
          label: {
            de: 'Beschreibung',
            en: 'Description',
          },
        },
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages',
          required: true,
          label: {
            de: 'Seite',
            en: 'Page',
          },
        },
      ],
    },
  ],
}
