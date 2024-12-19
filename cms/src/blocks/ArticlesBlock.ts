import { Block } from 'payload'

export const ArticlesBlock: Block = {
  slug: 'articles',
  interfaceName: 'ArticlesBlock',
  labels: {
    singular: {
      de: 'Artikel Block',
      en: 'Articles Block',
    },
    plural: {
      de: 'Artikel Blöcke',
      en: 'Articles Blocks',
    },
  },
  fields: [
    {
      // This virtual field makes the data directly available to the frontend when a document with the block is requested
      name: 'articles',
      type: 'relationship',
      relationTo: 'articles',
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
            const articles = await payload.find({
              collection: 'articles',
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

            return articles.docs.map((article) => article.id)
          },
        ],
      },
    },
  ],
}
