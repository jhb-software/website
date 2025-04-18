import { Block } from 'payload'

export const PhilosophyBlock: Block = {
  slug: 'philosophy',
  interfaceName: 'PhilosophyBlock',
  labels: {
    singular: {
      de: 'Philosophie Block',
      en: 'Philosophy Block',
    },
    plural: {
      de: 'Philosophie Blöcke',
      en: 'Philosophy Blocks',
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'text',
      type: 'richText',
      required: true,
      localized: true,
    },
    {
      name: 'items',
      type: 'array',
      label: {
        en: 'Philosophy Items',
        de: 'Philosophie Elemente',
      },
      required: true,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'text',
          type: 'textarea',
          required: true,
          localized: true,
        },
      ],
    },
  ],
}
