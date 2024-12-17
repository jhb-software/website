import { Block } from 'payload'

export const ProjectsListBlock: Block = {
  slug: 'projects-list',
  interfaceName: 'ProjectsListBlock',
  labels: {
    singular: {
      de: 'Projekte Liste',
      en: 'Projects List',
    },
    plural: {
      de: 'Projekte Liste',
      en: 'Projects List',
    },
  },
  fields: [
    {
      // This virtual field makes the data directly available to the frontend when a document with the block is requested
      name: 'projects',
      type: 'relationship',
      relationTo: 'projects',
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
                  not_equals: true,
                },
              },
            })

            return projects.docs.map((project) => project.id)
          },
        ],
      },
    },
  ],
}
