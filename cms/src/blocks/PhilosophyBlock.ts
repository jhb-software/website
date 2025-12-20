import { Block } from 'payload'

export const PhilosophyBlock: Block = {
  slug: 'philosophy',
  interfaceName: 'PhilosophyBlock',
  labels: {
    plural: {
      de: 'Philosophie Blöcke',
      en: 'Philosophy Blocks',
    },
    singular: {
      de: 'Philosophie Block',
      en: 'Philosophy Block',
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'text',
      type: 'richText',
      localized: true,
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      label: {
        de: 'Philosophie Elemente',
        en: 'Philosophy Items',
      },
      required: true,
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'text',
          type: 'textarea',
          localized: true,
          required: true,
        },
      ],
    },
  ],
}
