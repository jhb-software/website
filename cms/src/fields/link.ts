import type { CollectionSlug, Field } from 'payload'

export const linkGroupField = ({ relationTo }: { relationTo: CollectionSlug[] }) => ({
  name: 'link',
  type: 'group',
  admin: {
    hideGutter: true,
  },
  fields: linkFields({ relationTo }),
})

export const linkFields = ({ relationTo }: { relationTo: CollectionSlug[] }): Field[] => [
  {
    type: 'row',
    fields: [
      {
        name: 'page',
        label: {
          de: 'Seite',
          en: 'Page',
        },
        type: 'relationship',
        relationTo: relationTo,
        required: true,
        admin: {
          width: '50%',
        },
      },
      // Theoretically, the label could be optional and the page title could be used as fallback.
      {
        name: 'label',
        label: {
          de: 'Beschriftung',
          en: 'Label',
        },
        type: 'text',
        localized: true,
        required: true,
        admin: {
          width: '50%',
        },
      },
    ],
  },
]
