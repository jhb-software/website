import { AboutBlock } from '@/blocks/AboutBlock'
import { ArticlesBlock } from '@/blocks/ArticlesBlock'
import { AuthorsBlock } from '@/blocks/AuthorsBlock'
import { ContactBlock } from '@/blocks/ContactBlock'
import { CustomerLogosBlock } from '@/blocks/CustomerLogosBlock'
import { FeaturedProjectsListBlock } from '@/blocks/FeaturedProjectsList'
import { PhilosophyBlock } from '@/blocks/PhilosophyBlock'
import { ProjectsListBlock } from '@/blocks/ProjectsList'
import { RichTextBlock } from '@/blocks/RichTextBlock'
import { ServicesBlock } from '@/blocks/ServicesBlock'
import { TestimonialsBlock } from '@/blocks/TestimonialsBlock'
import { heroSection } from '@/fields/heroSection'
import { anyone } from '@/shared/access/anyone'
import { authenticated } from '@/shared/access/authenticated'
import { CollectionGroups } from '@/shared/CollectionGroups'
import { PageCollectionConfig } from '@jhb.software/payload-pages-plugin'

const Pages: PageCollectionConfig = {
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
  access: {
    read: anyone,
    update: authenticated,
    delete: authenticated,
    create: authenticated,
  },
  page: {
    parent: {
      collection: 'pages',
      name: 'parent',
    },
    isRootCollection: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    heroSection(),
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
          name: 'highlightBackground',
          type: 'checkbox',
          label: {
            de: 'Hintergrund hervorheben',
            en: 'Highlight Background',
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
            ArticlesBlock,
            AuthorsBlock,
            AboutBlock,
            PhilosophyBlock,
            ContactBlock,
          ],
          label: {
            de: 'Blöcke',
            en: 'Blocks',
          },
        },
      ],
    },
  ],
}

export default Pages
