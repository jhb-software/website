import { CollectionConfig } from 'payload'

import { anyone } from '@/shared/access/anyone'
import { authenticated } from '@/shared/access/authenticated'
import { CollectionGroups } from '@/shared/CollectionGroups'

const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'author', 'project', 'updatedAt', 'status'],
    group: CollectionGroups.ContentCollections,
    useAsTitle: 'title',
  },
  labels: {
    plural: {
      de: 'Testimonials',
      en: 'Testimonials',
    },
    singular: {
      de: 'Testimonial',
      en: 'Testimonial',
    },
  },
  orderable: true,
  versions: {
    drafts: true,
  },
  fields: [
    // Sidebar fields:
    {
      name: 'project',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      label: {
        de: 'Projekt',
        en: 'Project',
      },
      relationTo: 'projects',
      required: true,
    },

    // Body fields:
    {
      // This title field is needed, because the nested author.name field cannot be used as a title field in payload.
      name: 'title',
      type: 'text',
      admin: {
        components: {
          Field: '/fields/components/CopyAuthorNameToTitleField',
        },
      },
      label: 'Title',
      required: true,
    },
    {
      name: 'author',
      type: 'group',
      label: {
        de: 'Autor',
        en: 'Author',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          label: {
            de: 'Bild',
            en: 'Image',
          },
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'text',
      type: 'textarea',
      localized: true,
      required: true,
    },
  ],
}

export default Testimonials
