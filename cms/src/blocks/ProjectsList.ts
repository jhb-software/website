import { Block } from 'payload'

export const ProjectsListBlock: Block = {
  slug: 'projects-list',
  interfaceName: 'ProjectsListBlock',
  labels: {
    plural: {
      de: 'Projekte Liste',
      en: 'Projects List',
    },
    singular: {
      de: 'Projekte Liste',
      en: 'Projects List',
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
                  not_equals: true,
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
