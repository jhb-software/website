import type { ArrayField, CollectionSlug, GroupField } from 'payload'

export const linksField = ({
  name,
  maxRows,
  relationTo,
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
  name: 'link',
  type: 'group',
  admin: {
    hideGutter: true,
  },
  interfaceName: 'Link',
  label: '',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'page',
          type: 'relationship',
          admin: {
            width: '50%',
          },
          label: {
            de: 'Seite',
            en: 'Page',
          },
          relationTo: relationTo,
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          admin: {
            width: '50%',
          },
          label: {
            de: 'Beschriftung',
            en: 'Label',
          },
          localized: true,
          required: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'icon',
          type: 'select',
          admin: {
            width: '50%',
          },
          options: [
            { label: 'Bars Staggered', value: 'bars-staggered' },
            { label: 'Comments', value: 'comments' },
            { label: 'Chevron Right', value: 'chevron-right' },
            { label: 'Chevron Down', value: 'chevron-down' },
          ],
          required: false,
        },
        {
          name: 'style',
          type: 'select',
          admin: {
            width: '50%',
          },
          defaultValue: 'primary',
          label: {
            de: 'Stil',
            en: 'Style',
          },
          options: [
            { label: { de: 'Primär', en: 'Primary' }, value: 'primary' },
            { label: { de: 'Text', en: 'Text' }, value: 'text' },
            { label: { de: 'Text Primär', en: 'Text Primary' }, value: 'text-primary' },
            { label: { de: 'Hell', en: 'Light' }, value: 'light' },
            { label: { de: 'Hell Primär', en: 'Light Primary' }, value: 'light-primary' },
          ],
          required: true,
        },
      ],
    },
  ],
})
