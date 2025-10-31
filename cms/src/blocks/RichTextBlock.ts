import { Block } from 'payload'

export const RichTextBlock: Block = {
  slug: 'rich-text',
  interfaceName: 'RichTextBlock',
  labels: {
    plural: {
      de: 'Formatierte Texte Blöcke',
      en: 'Rich Text Blocks',
    },
    singular: {
      de: 'Formatierter Text Block',
      en: 'Rich Text Block',
    },
  },
  fields: [
    {
      name: 'text',
      type: 'richText',
      localized: true,
      required: true,
    },
  ],
}
