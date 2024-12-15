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
      virtual: true,
      admin: {
        readOnly: true,
      },
      hooks: {
        afterRead: [
          async ({ req: { payload } }) => {
            const customers = await payload.find({
              collection: 'customers',
              limit: 100,
              select: {
                // only select the id
              },
            })

            return customers.docs.map((customer) => customer.id)
          },
        ],
      },
    },
  ],
}
