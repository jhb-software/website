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
          async ({ draft, req }) => {
            const statusFilter = draft ? ['draft', 'published'] : ['published']
            const projects = await req.payload.find({
              collection: 'projects',
              draft,
              limit: 100,
              req,
              select: {
                // only select the id
              },
              where: {
                _status: {
                  in: statusFilter,
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
