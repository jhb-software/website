import { CollectionGroups } from '@/shared/CollectionGroups'
import { createPageCollectionConfig } from '@jhb.software/payload-pages-plugin'
import { CollectionConfig } from 'payload'

const Articles: CollectionConfig = createPageCollectionConfig({
  slug: 'articles',
  labels: {
    singular: {
      de: 'Artikel',
      en: 'Article',
    },
    plural: {
      de: 'Artikel',
      en: 'Articles',
    },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'path', 'updatedAt', 'status'],
    group: CollectionGroups.PagesCollections,
  },
  versions: {
    drafts: true,
  },
  page: {
    parentCollection: 'pages',
    parentField: 'parent',
    sharedParentDocument: true,
  },
  fields: [
    // Sidebar fields:

    // Body fields:
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: {
        en: 'Title',
        de: 'Titel',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      localized: true,
      label: {
        en: 'Excerpt',
        de: 'Kurzbeschreibung',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      localized: true,
      label: {
        en: 'Body',
        de: 'Inhalt',
      },
    },
  ],
})

export default Articles
