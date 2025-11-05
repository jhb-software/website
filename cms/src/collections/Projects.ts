import { PageCollectionConfig } from '@jhb.software/payload-pages-plugin'

import { anyone } from '@/shared/access/anyone'
import { authenticated } from '@/shared/access/authenticated'
import { CollectionGroups } from '@/shared/CollectionGroups'

// TODO: add an AI-functionality to generate a project page from notes. Here are some informations on what to include in the prompt:
// - title: The title of the project, do not include the customer name, instead focus on the WHAT instead of the for WHO.
// - excerpt: A short description of the scope of the project, what was implemented.
// - body: A detailed description of the project, a brief introduction to the customer, then the problem with the implemented solution and a note on the time frame and the technologies used.

const Projects: PageCollectionConfig = {
  slug: 'projects',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'path', 'updatedAt', 'status'],
    group: CollectionGroups.PagesCollections,
    useAsTitle: 'title',
  },
  defaultPopulate: {
    // only populate the fields that are required by the frontend (e.g. for project cards and list views)
    createdAt: true,
    customer: true,
    endDate: true,
    excerpt: true,
    featured: true,
    image: true,
    path: true,
    startDate: true,
    tags: true,
    title: true,
    updatedAt: true,
  },
  enableQueryPresets: true,
  labels: {
    plural: {
      de: 'Projekte',
      en: 'Projects',
    },
    singular: {
      de: 'Projekt',
      en: 'Project',
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
      name: 'customer',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      relationTo: 'customers',
      required: true,
    },
    {
      name: 'startDate',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
      label: {
        de: 'Startdatum',
        en: 'Start Date',
      },
      required: true,
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
      label: {
        de: 'Enddatum',
        en: 'End Date',
      },
      required: false,
    },
    {
      name: 'featured',
      type: 'checkbox',
      admin: {
        description: {
          de: 'Ob das Projekt in der hervorgehobenen Projekte-Section angezeigt werden soll.',
          en: 'Whether the project should be shown in the featured projects section.',
        },
        position: 'sidebar',
      },
      label: {
        de: 'Hervorgehoben',
        en: 'Featured',
      },
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
      name: 'tags',
      type: 'select',
      hasMany: true,
      label: {
        de: 'Tags',
        en: 'Tags',
      },
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
      // TODO: rename this field to content to be consistent with the articles rich text field
      // NOTE: a database migration is needed
      name: 'body',
      type: 'richText',
      label: {
        de: 'Inhalt',
        en: 'Content',
      },
      localized: true,
      required: true,
    },
    {
      name: 'testimonials',
      type: 'join',
      collection: 'testimonials',
      label: {
        de: 'Referenzen',
        en: 'Testimonials',
      },
      on: 'project',
    },
  ],
}

export default Projects
