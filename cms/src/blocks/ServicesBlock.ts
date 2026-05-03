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
                width: '60%',
              },
              label: {
                de: 'Titel',
                en: 'Title',
              },
              localized: true,
              required: true,
            },
            {
              name: 'eyebrow',
              type: 'text',
              admin: {
                width: '20%',
              },
              label: {
                de: 'Eyebrow-Kürzel',
                en: 'Eyebrow tag',
              },
              localized: true,
              required: true,
            },
            {
              name: 'visualization',
              type: 'select',
              admin: {
                width: '20%',
              },
              label: {
                de: 'Visualisierung',
                en: 'Visualization',
              },
              options: [
                { label: { de: 'Mobile App', en: 'Mobile App' }, value: 'mobile' },
                { label: { de: 'Website / CMS', en: 'Website / CMS' }, value: 'web' },
                { label: { de: 'Webanwendung', en: 'Web App' }, value: 'webapp' },
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
        {
          name: 'isHero',
          type: 'checkbox',
          defaultValue: false,
          label: {
            de: 'Als Hero anzeigen',
            en: 'Show as hero',
          },
        },
      ],
    },
  ],
}
