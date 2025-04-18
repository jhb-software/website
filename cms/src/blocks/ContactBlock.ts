import { Block } from 'payload'

export const ContactBlock: Block = {
  slug: 'contact',
  interfaceName: 'ContactBlock',
  labels: {
    singular: 'Contact Block',
    plural: 'Contact Blocks',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'image',
          type: 'upload',
          required: true,
          relationTo: 'media',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'phone',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'email',
          label: 'E-Mail',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'socialLinks',
      label: 'Social Media Links',
      type: 'array',
      required: true,
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
              type: 'select',
              required: true,
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
              admin: {
                width: '50%',
              },
            },
          ],
        },
      ],
    },
  ],
}

export default ContactBlock
