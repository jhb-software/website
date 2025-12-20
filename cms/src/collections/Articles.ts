import { PageCollectionConfig } from '@jhb.software/payload-pages-plugin'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { BlocksFeature } from 'node_modules/@payloadcms/richtext-lexical/dist/features/blocks/server'

import CodeBlock from '@/blocks/CodeBlock'
import { anyone } from '@/shared/access/anyone'
import { authenticated } from '@/shared/access/authenticated'
import { CollectionGroups } from '@/shared/CollectionGroups'
import { lazyLoadingLivePreviewComponent } from '@/shared/lazyLoadingLivePreviewComponent'

const Articles: PageCollectionConfig = {
  slug: 'articles',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    ...lazyLoadingLivePreviewComponent,
    defaultColumns: ['title', 'path', 'updatedAt', 'status'],
    group: CollectionGroups.PagesCollections,
    useAsTitle: 'title',
  },
  defaultPopulate: {
    // only populate the fields that are required by the frontend (e.g. for article cards and list views)
    authors: true,
    createdAt: true,
    excerpt: true,
    image: true,
    path: true,
    tags: true,
    title: true,
    updatedAt: true,
  },
  labels: {
    plural: {
      de: 'Artikel',
      en: 'Articles',
    },
    singular: {
      de: 'Artikel',
      en: 'Article',
    },
  },
  page: {
    parent: {
      name: 'parent',
      collection: 'pages',
      sharedDocument: true,
    },
  },
  versions: {
    drafts: true,
  },
  fields: [
    // Sidebar fields:
    {
      name: 'authors',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      minRows: 1,
      relationTo: 'authors',
      required: true,
    },
    {
      name: 'tags',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      minRows: 1,
      relationTo: 'article-tags',
      required: true,
    },
    // Body fields:
    {
      name: 'title',
      type: 'text',
      label: {
        de: 'Titel',
        en: 'Title',
      },
      localized: true,
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: {
        de: 'Kurzbeschreibung',
        en: 'Excerpt',
      },
      localized: true,
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      label: {
        de: 'Bild',
        en: 'Image',
      },
      relationTo: 'images',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          BlocksFeature({
            blocks: [CodeBlock],
          }),
        ],
      }),
      label: {
        de: 'Inhalt',
        en: 'Content',
      },
      localized: true,
      required: true,
    },
  ],
}

export default Articles
