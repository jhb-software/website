import { PageCollectionConfig } from '@jhb.software/payload-pages-plugin'

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

const Pages: PageCollectionConfig = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'path', 'status', 'updatedAt'],
    group: CollectionGroups.PagesCollections,
    useAsTitle: 'title',
  },
  labels: {
    plural: {
      de: 'Seiten',
      en: 'Pages',
    },
    singular: {
      de: 'Seite',
      en: 'Page',
    },
  },
  page: {
    isRootCollection: true,
    parent: {
      name: 'parent',
      collection: 'pages',
    },
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
    heroSection(),
    {
      name: 'sections',
      type: 'array',
      admin: {
        components: {
          RowLabel: '/fields/components/SectionRowTitle',
        },
      },
      label: {
        de: 'Inhalts Abschnitte',
        en: 'Content Sections',
      },
      labels: {
        plural: {
          de: 'Abschnitte',
          en: 'Sections',
        },
        singular: {
          de: 'Abschnitt',
          en: 'Section',
        },
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: {
            de: 'Titel',
            en: 'Title',
          },
          localized: true,
        },
        {
          name: 'subTitle',
          type: 'textarea',
          label: {
            de: 'Untertitel',
            en: 'Subtitle',
          },
          localized: true,
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
