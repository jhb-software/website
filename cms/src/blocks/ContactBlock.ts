import { Block } from 'payload'

export const ContactBlock: Block = {
  slug: 'contact',
  interfaceName: 'ContactBlock',
  labels: {
    plural: 'Contact Blocks',
    singular: 'Contact Block',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          admin: {
            width: '50%',
          },
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          admin: {
            width: '50%',
          },
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'phone',
          type: 'text',
          admin: {
            width: '50%',
          },
          required: true,
        },
        {
          name: 'email',
          type: 'text',
          admin: {
            width: '50%',
          },
          label: 'E-Mail',
          required: true,
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social Media Links',
      required: true,
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
              options: [
                {
                  label: 'LinkedIn',
                  value: 'linkedin',
                },
                {
                  label: 'GitHub',
                  value: 'github',
                },
                {
                  label: 'WhatsApp',
                  value: 'whatsapp',
                },
              ],
              required: true,
            },
          ],
        },
      ],
    },
  ],
}

export default ContactBlock
