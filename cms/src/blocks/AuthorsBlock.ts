import { Block } from 'payload'

export const AuthorsBlock: Block = {
  slug: 'authors',
  interfaceName: 'AuthorsBlock',
  labels: {
    singular: {
      de: 'Autoren Block',
      en: 'Authors Block',
    },
    plural: {
      de: 'Autoren Blöcke',
      en: 'Authors Blocks',
    },
  },
  fields: [
    {
      // This virtual field makes the data directly available to the frontend when a document with the block is requested
      name: 'authors',
      type: 'relationship',
      relationTo: 'authors',
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
            const authors = await payload.find({
              collection: 'authors',
              limit: 100,
              select: {
                // only select the id
              },
              where: {
                _status: {
                  equals: 'published',
                },
              },
              sort: 'createdAt',
            })

            return authors.docs.map((author) => author.id)
          },
        ],
      },
    },
  ],
}
