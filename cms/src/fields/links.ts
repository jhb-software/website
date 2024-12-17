import type { ArrayField, CollectionSlug, GroupField } from 'payload'

export const linksField = ({
  name,
  relationTo,
  maxRows,
}: {
  name: string
  relationTo: CollectionSlug[]
  maxRows: number
}): ArrayField => ({
  name,
  type: 'array',
  admin: {
    components: {
      RowLabel: '/fields/components/LinkRowTitle',
    },
  },
  maxRows,
  fields: [linkGroup({ relationTo })],
})

const linkGroup = ({ relationTo }: { relationTo: CollectionSlug[] }): GroupField => ({
  type: 'group',
  name: 'link',
  interfaceName: 'Link',
  admin: {
    hideGutter: true,
  },
  label: '',
  fields: [
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
            width: '33%',
          },
        },
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
            width: '33%',
          },
        },
        {
          name: 'style',
          required: true,
          label: {
            de: 'Stil',
            en: 'Style',
          },
          type: 'select',
          options: [
            { label: { de: 'Primär', en: 'Primary' }, value: 'primary' },
            { label: { de: 'Text', en: 'Text' }, value: 'text' },
            { label: { de: 'Text Primär', en: 'Text Primary' }, value: 'text-primary' },
            { label: { de: 'Hell', en: 'Light' }, value: 'light' },
            { label: { de: 'Hell Primär', en: 'Light Primary' }, value: 'light-primary' },
          ],
          defaultValue: 'primary',
          admin: {
            width: '33%',
          },
        },
      ],
    },
  ],
})
