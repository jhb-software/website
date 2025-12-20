import { Block } from 'payload'

export const CustomerLogosBlock: Block = {
  slug: 'customer-logos',
  interfaceName: 'CustomerLogosBlock',
  labels: {
    plural: {
      de: 'Kundenlogos',
      en: 'Customer Logos',
    },
    singular: {
      de: 'Kundenlogos',
      en: 'Customer Logos',
    },
  },
  fields: [
    {
      name: 'customers',
      type: 'relationship',
      hasMany: true,
      maxRows: 12,
      relationTo: 'customers',
      required: true,
    },
  ],
}
