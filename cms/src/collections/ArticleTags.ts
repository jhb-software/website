import { CollectionConfig } from 'payload'

import { anyone } from '@/shared/access/anyone'
import { authenticated } from '@/shared/access/authenticated'
import { CollectionGroups } from '@/shared/CollectionGroups'

const ArticleTags: CollectionConfig = {
  slug: 'article-tags',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name'],
    group: CollectionGroups.ContentCollections,
    useAsTitle: 'name',
  },
  labels: {
    plural: {
      de: 'Artikel-Tags',
      en: 'Article Tags',
    },
    singular: {
      de: 'Artikel-Tag',
      en: 'Article Tag',
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      localized: true,
      required: true,
    },
  ],
}

export default ArticleTags
