import { Block } from 'payload'

export const FeaturedProjectsListBlock: Block = {
  slug: 'featured-projects-list',
  interfaceName: 'FeaturedProjectsListBlock',
  labels: {
    plural: {
      de: 'Hervorgehobene Projekte Liste',
      en: 'Featured Projects List',
    },
    singular: {
      de: 'Hervorgehobene Projekte Liste',
      en: 'Featured Projects List',
    },
  },
  fields: [
    {
      name: 'projects',
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
            const projects = await payload.find({
              collection: 'projects',
              limit: 100,
              select: {
                // only select the id
              },
              where: {
                _status: {
                  equals: 'published',
                },
                featured: {
                  equals: true,
                },
              },
            })

            return projects.docs.map((project) => project.id)
          },
        ],
      },
      relationTo: 'projects',
      required: true,
      validate: () => true,
      virtual: true,
    },
  ],
}
