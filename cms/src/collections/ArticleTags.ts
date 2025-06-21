import { anyone } from '@/shared/access/anyone'
import { authenticated } from '@/shared/access/authenticated'
import { CollectionGroups } from '@/shared/CollectionGroups'
import { CollectionConfig } from 'payload'

const ArticleTags: CollectionConfig = {
  slug: 'article-tags',
  labels: {
    singular: {
      de: 'Artikel-Tag',
      en: 'Article Tag',
    },
    plural: {
      de: 'Artikel-Tags',
      en: 'Article Tags',
    },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name'],
    group: CollectionGroups.ContentCollections,
  },
  access: {
    read: anyone,
    update: authenticated,
    delete: authenticated,
    create: authenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
  ],
}

export default ArticleTags
