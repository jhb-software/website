import { socialLinksField } from '@/fields/socialLinks'
import { anyone } from '@/shared/access/anyone'
import { authenticated } from '@/shared/access/authenticated'
import { CollectionGroups } from '@/shared/CollectionGroups'
import { PageCollectionConfig } from '@jhb.software/payload-pages-plugin'

const Authors: PageCollectionConfig = {
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
    drafts: true,
  },
  page: {
    parent: {
      collection: 'pages',
      name: 'parent',
      sharedDocument: true,
    },
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
      name: 'excerpt',
      type: 'textarea',
      required: true,
      localized: true,
      label: {
        en: 'Excerpt',
        de: 'Kurzbeschreibung',
      },
    },
    socialLinksField({ name: 'socialLinks', required: true, minRows: 1 }),
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
}

export default Authors
