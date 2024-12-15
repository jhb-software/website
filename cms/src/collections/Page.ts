import { CustomerLogosBlock } from '@/blocks/CustomerLogosBlock'
import { FeaturedProjectsListBlock } from '@/blocks/FeaturedProjectsList'
import { ProjectsListBlock } from '@/blocks/ProjectsList'
import { RichTextBlock } from '@/blocks/RichTextBlock'
import { ServicesBlock } from '@/blocks/ServicesBlock'
import { TestimonialsBlock } from '@/blocks/TestimonialsBlock'
import { linkFields } from '@/fields/link'
import { CollectionGroups } from '@/shared/CollectionGroups'
import { createPageCollectionConfig } from '@jhb.software/payload-pages-plugin'
import { CollectionConfig } from 'payload'

const Page: CollectionConfig = createPageCollectionConfig({
  slug: 'pages',
  labels: {
    singular: {
      de: 'Seite',
      en: 'Page',
    },
    plural: {
      de: 'Seiten',
      en: 'Pages',
    },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'path', 'status', 'updatedAt'],
    group: CollectionGroups.PagesCollections,
  },
  versions: {
    drafts: true,
  },
  page: {
    parentCollection: 'pages',
    parentField: 'parent',
    isRootCollection: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'hero',
      type: 'group',
      label: {
        de: 'Hero Abschnitt',
        en: 'Hero Section',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
          label: {
            de: 'Titel',
            en: 'Title',
          },
        },
        {
          name: 'subtitle',
          type: 'textarea',
          localized: true,
          required: true,
          label: {
            de: 'Untertitel',
            en: 'Subtitle',
          },
        },
        {
          name: 'links',
          type: 'array',
          admin: {
            components: {
              RowLabel: '/fields/components/LinkRowTitle',
            },
          },
          fields: linkFields({ relationTo: ['pages'] }),
        },
      ],
    },
    {
      name: 'sections',
      type: 'array',
      label: {
        de: 'Inhalts Abschnitte',
        en: 'Content Sections',
      },
      labels: {
        singular: {
          de: 'Abschnitt',
          en: 'Section',
        },
        plural: {
          de: 'Abschnitte',
          en: 'Sections',
        },
      },
      admin: {
        components: {
          RowLabel: '/fields/components/SectionRowTitle',
        },
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
          label: {
            de: 'Titel',
            en: 'Title',
          },
        },
        {
          name: 'subTitle',
          type: 'textarea',
          localized: true,
          label: {
            de: 'Untertitel',
            en: 'Subtitle',
          },
        },
        {
          name: 'blocks',
          type: 'blocks',
          blocks: [
            RichTextBlock,
            ServicesBlock,
            TestimonialsBlock,
            CustomerLogosBlock,
            FeaturedProjectsListBlock,
            ProjectsListBlock,
          ],
          label: {
            de: 'Blöcke',
            en: 'Blocks',
          },
        },
      ],
    },
  ],
})

export default Page
