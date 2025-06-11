import { anyone } from '@/shared/access/anyone'
import { authenticated } from '@/shared/access/authenticated'
import { CollectionGroups } from '@/shared/CollectionGroups'
import { createPageCollectionConfig } from '@jhb.software/payload-pages-plugin'
import { CollectionConfig } from 'payload'

const Projects: CollectionConfig = createPageCollectionConfig({
  slug: 'projects',
  labels: {
    singular: {
      de: 'Projekt',
      en: 'Project',
    },
    plural: {
      de: 'Projekte',
      en: 'Projects',
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
  enableQueryPresets: true,
  fields: [
    // Sidebar fields:
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      label: {
        en: 'Start Date',
        de: 'Startdatum',
      },
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'endDate',
      type: 'date',
      label: {
        en: 'End Date',
        de: 'Enddatum',
      },
      required: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: {
        en: 'Featured',
        de: 'Hervorgehoben',
      },
      required: true,
      admin: {
        position: 'sidebar',
        description: {
          en: 'Whether the project should be shown in the featured projects section.',
          de: 'Ob das Projekt in der hervorgehobenen Projekte-Section angezeigt werden soll.',
        },
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
      name: 'tags',
      type: 'select',
      hasMany: true,
      label: {
        en: 'Tags',
        de: 'Tags',
      },
      required: true,
      options: [
        {
          label: 'Web-App',
          value: 'web-app',
        },
        {
          label: 'Website',
          value: 'website',
        },
        {
          label: 'Mobile App',
          value: 'app',
        },
        {
          label: 'SEO',
          value: 'seo',
        },
        {
          label: 'CMS',
          value: 'cms',
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: {
        en: 'Image',
        de: 'Bild',
      },
    },
    {
      name: 'body',
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

export default Projects
