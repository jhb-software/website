import { Block } from 'payload'

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  labels: {
    singular: {
      de: 'Testimonials Block',
      en: 'Testimonials Block',
    },
    plural: {
      de: 'Testimonials Blöcke',
      en: 'Testimonials Blocks',
    },
  },
  fields: [
    {
      // This virtual field makes the data directly available to the frontend when a document with the block is requested
      name: 'testimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      required: true,
      virtual: true,
      // As the value of the field is set by the hook, do not validate it
      validate: () => true,
      admin: {
        readOnly: true,
      },
      hooks: {
        afterRead: [
          async ({ req: { payload } }) => {
            const testimonials = await payload.find({
              collection: 'testimonials',
              limit: 100,
              select: {
                // only select the id
              },
              where: {
                _status: {
                  equals: 'published',
                },
              },
              draft: false,
            })

            return testimonials.docs.map((testimonial) => testimonial.id)
          },
        ],
      },
    },
  ],
}
