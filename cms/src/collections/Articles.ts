import { anyone } from '@/shared/access/anyone'
import { authenticated } from '@/shared/access/authenticated'
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
    drafts: {
      autosave: true,
    },
  },
  page: {
    parentCollection: 'pages',
    parentField: 'parent',
    sharedParentDocument: true,
  },
  access: {
    read: anyone,
    update: authenticated,
    delete: authenticated,
    create: authenticated,
  },
  fields: [
    // Sidebar fields:
    {
      name: 'authors',
      type: 'relationship',
      relationTo: 'authors',
      required: true,
      hasMany: true,
      minRows: 1,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'categories',
      type: 'select',
      options: [
        {
          label: 'Web',
          value: 'web',
        },
        {
          label: 'App',
          value: 'app',
        },
      ],
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
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
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: false,
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
