import { Block } from 'payload'

export const CodeBlock: Block = {
  slug: 'code',
  interfaceName: 'CodeBlock',
  labels: {
    plural: 'Code Blocks',
    singular: 'Code Block',
  },
  fields: [
    {
      name: 'code',
      type: 'code',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
      localized: true,
    },
  ],
}

export default CodeBlock
