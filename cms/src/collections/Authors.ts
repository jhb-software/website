import { PageCollectionConfig } from '@jhb.software/payload-pages-plugin'

import { socialLinksField } from '@/fields/socialLinks'
import { anyone } from '@/shared/access/anyone'
import { authenticated } from '@/shared/access/authenticated'
import { CollectionGroups } from '@/shared/CollectionGroups'
import { lazyLoadingLivePreviewComponent } from '@/shared/lazyLoadingLivePreviewComponent'

const Authors: PageCollectionConfig = {
  slug: 'authors',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    ...lazyLoadingLivePreviewComponent,
    defaultColumns: ['name', 'path', 'updatedAt', 'status'],
    group: CollectionGroups.PagesCollections,
    useAsTitle: 'name',
  },
  labels: {
    plural: {
      de: 'Autoren',
      en: 'Authors',
    },
    singular: {
      de: 'Autor',
      en: 'Author',
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

    // Body fields:
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'profession',
      type: 'text',
      label: {
        de: 'Berufbezeichnung',
        en: 'Profession',
      },
      localized: true,
      required: true,
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'images',
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
    socialLinksField({ name: 'socialLinks', minRows: 1, required: true }),
    {
      name: 'description',
      type: 'richText',
      label: {
        de: 'Beschreibung',
        en: 'Description',
      },
      localized: true,
      required: true,
    },
  ],
}

export default Authors
