import type { ArrayField } from 'payload'

export const socialLinksField = ({
  name,
  maxRows,
  minRows,
  required = true,
}: {
  name: string
  required: boolean
  minRows?: number | undefined
  maxRows?: number | undefined
}): ArrayField => ({
  name,
  type: 'array',
  interfaceName: 'SocialLinks',
  label: 'Social Links',
  labels: {
    plural: 'Social Links',
    singular: 'Social Link',
  },
  maxRows,
  minRows,
  required,
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'url',
          type: 'text',
          admin: {
            width: '50%',
          },
          label: 'URL',
          required: true,
        },
        {
          name: 'icon',
          type: 'select',
          admin: {
            width: '50%',
          },
          label: 'Icon',
          options: [
            { label: 'GitHub', value: 'github' },
            { label: 'WhatsApp', value: 'whatsapp' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'X', value: 'x' },
          ],
          required: true,
        },
      ],
    },
  ],
})
