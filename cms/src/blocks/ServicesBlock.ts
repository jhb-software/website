import { Block } from 'payload'

export const ServicesBlock: Block = {
  slug: 'services',
  interfaceName: 'ServicesBlock',
  labels: {
    plural: {
      de: 'Leistungen Blöcke',
      en: 'Services Blocks',
    },
    singular: {
      de: 'Leistungen Block',
      en: 'Services Block',
    },
  },
  fields: [
    {
      name: 'services',
      type: 'array',
      label: {
        de: 'Leistungen',
        en: 'Services',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'title',
              type: 'text',
              admin: {
                width: '70%',
              },
              label: {
                de: 'Titel',
                en: 'Title',
              },
              localized: true,
              required: true,
            },
            {
              name: 'icon',
              type: 'select',
              admin: {
                width: '30%',
              },
              label: {
                de: 'Icon',
                en: 'Icon',
              },
              options: [
                { label: 'Mobile Phone', value: 'mobile-phone' },
                { label: 'Laptop', value: 'laptop' },
                { label: 'Laptop Code', value: 'laptop-code' },
              ],
              required: true,
            },
          ],
        },
        {
          name: 'description',
          type: 'textarea',
          label: {
            de: 'Beschreibung',
            en: 'Description',
          },
          localized: true,
          required: true,
        },
        {
          name: 'page',
          type: 'relationship',
          label: {
            de: 'Seite',
            en: 'Page',
          },
          relationTo: 'pages',
          required: true,
        },
      ],
    },
  ],
}
