import { Block } from 'payload'

export const CustomerLogosBlock: Block = {
  slug: 'customer-logos',
  interfaceName: 'CustomerLogosBlock',
  labels: {
    singular: {
      de: 'Kundenlogos',
      en: 'Customer Logos',
    },
    plural: {
      de: 'Kundenlogos',
      en: 'Customer Logos',
    },
  },
  fields: [
    {
      name: 'customers',
      type: 'relationship',
      relationTo: 'customers',
      hasMany: true,
      required: true,
      maxRows: 12,
    },
  ],
}
