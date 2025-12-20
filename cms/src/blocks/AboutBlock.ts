import { Block } from 'payload'

export const AboutBlock: Block = {
  slug: 'about',
  interfaceName: 'AboutBlock',
  labels: {
    plural: {
      de: 'Über Mich Blöcke',
      en: 'About Me Blocks',
    },
    singular: {
      de: 'Über Mich Block',
      en: 'About Me Block',
    },
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            width: '50%',
          },
          localized: false,
          required: false,
        },
        {
          name: 'name',
          type: 'text',
          admin: {
            width: '50%',
          },
          localized: false,
          required: false,
        },
      ],
    },
    {
      name: 'text',
      type: 'richText',
      localized: true,
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'images',
      required: true,
    },
  ],
}
