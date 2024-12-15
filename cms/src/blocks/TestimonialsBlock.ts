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
      // This virtual field holds all published testimonials, so that they are directly available to the frontend
      name: 'testimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      required: true,
      virtual: true,
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
