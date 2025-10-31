import { Block } from 'payload'

export const ArticlesBlock: Block = {
  slug: 'articles',
  interfaceName: 'ArticlesBlock',
  labels: {
    plural: {
      de: 'Artikel Blöcke',
      en: 'Articles Blocks',
    },
    singular: {
      de: 'Artikel Block',
      en: 'Articles Block',
    },
  },
  fields: [
    {
      name: 'articles',
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
            const articles = await payload.find({
              collection: 'articles',
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

            return articles.docs.map((article) => article.id)
          },
        ],
      },
      relationTo: 'articles',
      required: true,
      validate: () => true,
      virtual: true,
    },
  ],
}
