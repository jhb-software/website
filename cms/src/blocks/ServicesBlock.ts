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
          type: 'row',
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
              admin: {
                width: '70%',
              },
            },
            {
              name: 'icon',
              type: 'select',
              options: [
                { label: 'Mobile Phone', value: 'mobile-phone' },
                { label: 'Laptop', value: 'laptop' },
                { label: 'Laptop Code', value: 'laptop-code' },
              ],
              required: true,
              label: {
                de: 'Icon',
                en: 'Icon',
              },
              admin: {
                width: '30%',
              },
            },
          ],
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
