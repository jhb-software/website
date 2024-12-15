import { CollectionGroups } from '@/shared/CollectionGroups'
import { CollectionConfig } from 'payload'

const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: {
    singular: {
      de: 'Testimonial',
      en: 'Testimonial',
    },
    plural: {
      de: 'Testimonials',
      en: 'Testimonials',
    },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'project', 'updatedAt', 'status'],
    group: CollectionGroups.ContentCollections,
  },
  versions: {
    drafts: true,
  },
  fields: [
    // Sidebar fields:
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      admin: {
        position: 'sidebar',
      },
      required: true,
      label: {
        en: 'Project',
        de: 'Projekt',
      },
    },

    // Body fields:
    {
      // This title field is needed, because the nested author.name field cannot be used as a title field in payload.
      name: 'title',
      type: 'text',
      label: 'Title',
      required: true,
      admin: {
        components: {
          Field: '/fields/components/CopyAuthorNameToTitleField',
        },
      },
    },
    {
      name: 'author',
      type: 'group',
      label: {
        en: 'Author',
        de: 'Autor',
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
          relationTo: 'media',
          required: true,
          label: {
            en: 'Image',
            de: 'Bild',
          },
        },
      ],
    },
    {
      name: 'text',
      type: 'textarea',
      required: true,
      localized: true,
    },
  ],
}

export default Testimonials
