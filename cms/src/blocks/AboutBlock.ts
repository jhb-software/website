import { Block } from 'payload'

export const AboutBlock: Block = {
  slug: 'about',
  interfaceName: 'AboutBlock',
  labels: {
    singular: {
      de: 'Über Mich Block',
      en: 'About Me Block',
    },
    plural: {
      de: 'Über Mich Blöcke',
      en: 'About Me Blocks',
    },
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: false,
          localized: false,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'name',
          type: 'text',
          required: false,
          localized: false,
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'text',
      type: 'richText',
      required: true,
      localized: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}
