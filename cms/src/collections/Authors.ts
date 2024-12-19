import { anyone } from '@/shared/access/anyone'
import { authenticated } from '@/shared/access/authenticated'
import { CollectionGroups } from '@/shared/CollectionGroups'
import { createPageCollectionConfig } from '@jhb.software/payload-pages-plugin'
import { CollectionConfig } from 'payload'

const Authors: CollectionConfig = createPageCollectionConfig({
  slug: 'authors',
  labels: {
    singular: {
      de: 'Autor',
      en: 'Author',
    },
    plural: {
      de: 'Autoren',
      en: 'Authors',
    },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'path', 'updatedAt', 'status'],
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
    breadcrumbLabelField: 'name',
  },
  access: {
    read: anyone,
    update: authenticated,
    delete: authenticated,
    create: authenticated,
  },
  fields: [
    // Sidebar fields:

    // Body fields:
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'profession',
      type: 'text',
      required: true,
      localized: true,
      label: {
        en: 'Profession',
        de: 'Berufbezeichnung',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      localized: true,
      label: {
        en: 'Description',
        de: 'Beschreibung',
      },
    },
  ],
})

export default Authors
