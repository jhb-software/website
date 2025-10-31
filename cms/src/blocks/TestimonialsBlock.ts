import { Block } from 'payload'

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  labels: {
    plural: {
      de: 'Testimonials Blöcke',
      en: 'Testimonials Blocks',
    },
    singular: {
      de: 'Testimonials Block',
      en: 'Testimonials Block',
    },
  },
  fields: [
    {
      name: 'testimonials',
      type: 'relationship',
      // As the value of the field is set by the hook, do not validate it
      admin: {
        readOnly: true,
      },
      // This virtual field makes the data directly available to the frontend when a document with the block is requested
      hasMany: true,
      hooks: {
        afterRead: [
          async ({ req: { payload } }) => {
            const testimonials = await payload.find({
              collection: 'testimonials',
              draft: false,
              limit: 100,
              select: {
                // only select the id
              },
              sort: '_order',
              where: {
                _status: {
                  equals: 'published',
                },
              },
            })

            return testimonials.docs.map((testimonial) => testimonial.id)
          },
        ],
      },
      relationTo: 'testimonials',
      required: true,
      validate: () => true,
      virtual: true,
    },
  ],
}
