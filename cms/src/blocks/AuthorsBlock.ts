import { Block } from 'payload'

export const AuthorsBlock: Block = {
  slug: 'authors',
  interfaceName: 'AuthorsBlock',
  labels: {
    plural: {
      de: 'Autoren Blöcke',
      en: 'Authors Blocks',
    },
    singular: {
      de: 'Autoren Block',
      en: 'Authors Block',
    },
  },
  fields: [
    {
      name: 'authors',
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
            const authors = await payload.find({
              collection: 'authors',
              limit: 100,
              select: {
                // only select the id
              },
              sort: 'createdAt',
              where: {
                _status: {
                  equals: 'published',
                },
              },
            })

            return authors.docs.map((author) => author.id)
          },
        ],
      },
      relationTo: 'authors',
      required: true,
      validate: () => true,
      virtual: true,
    },
  ],
}
