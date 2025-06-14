import type { ArrayField } from 'payload'

export const socialLinksField = ({
  name,
  required = true,
  minRows,
  maxRows,
}: {
  name: string
  required: boolean
  minRows?: number | undefined
  maxRows?: number | undefined
}): ArrayField => ({
  name,
  type: 'array',
  interfaceName: 'SocialLinks',
  labels: {
    singular: 'Social Link',
    plural: 'Social Links',
  },
  label: 'Social Links',
  required,
  minRows,
  maxRows,
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'url',
          label: 'URL',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'icon',
          label: 'Icon',
          type: 'select',
          required: true,
          options: [
            { label: 'GitHub', value: 'github' },
            { label: 'WhatsApp', value: 'whatsapp' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'Facebook', value: 'facebook' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'X', value: 'x' },
          ],
          admin: {
            width: '50%',
          },
        },
      ],
    },
  ],
})
