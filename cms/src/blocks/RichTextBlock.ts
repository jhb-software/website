import { Block } from 'payload'

export const RichTextBlock: Block = {
  slug: 'rich-text',
  interfaceName: 'RichTextBlock',
  labels: {
    singular: {
      de: 'Formatierter Text Block',
      en: 'Rich Text Block',
    },
    plural: {
      de: 'Formatierte Texte Blöcke',
      en: 'Rich Text Blocks',
    },
  },
  fields: [
    {
      name: 'text',
      type: 'richText',
      required: true,
      localized: true,
    },
  ],
}
