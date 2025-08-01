import { jhbDashboardPlugin } from '@/plugins/jhb-dashboard/plugin'
import { adminSearchPlugin } from '@jhb.software/payload-admin-search'
import {
  alternatePathsField,
  getPageUrl,
  payloadPagesPlugin,
} from '@jhb.software/payload-pages-plugin'
import { payloadSeoPlugin } from '@jhb.software/payload-seo-plugin'
import { hetznerStorage } from '@joneslloyd/payload-storage-hetzner'
import { openAIResolver, translator } from '@payload-enchants/translator'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { resendAdapter } from '@payloadcms/email-resend'
import { searchPlugin } from '@payloadcms/plugin-search'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { de } from '@payloadcms/translations/languages/de'
import { en } from '@payloadcms/translations/languages/en'
import path from 'path'
import { buildConfig, CollectionConfig, CollectionSlug, GlobalSlug } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import CodeBlock from './blocks/CodeBlock'
import Articles from './collections/Articles'
import ArticleTags from './collections/ArticleTags'
import Authors from './collections/Authors'
import Customers from './collections/Customers'
import { Media } from './collections/Media'
import Pages from './collections/Pages'
import Project from './collections/Projects'
import { Redirects } from './collections/Redirects'
import Testimonials from './collections/Testimonials'
import { Users } from './collections/Users'
import { getPagePropsByPath } from './endpoints/pageProps'
import { getSitemap } from './endpoints/sitemap'
import { getStatisPagesProps } from './endpoints/staticPages'
import Footer from './globals/Footer'
import Header from './globals/Header'
import Labels from './globals/Labels'
import {
  Article,
  ArticleTag,
  Author,
  Customer,
  Media as MediaType,
  Page as PageType,
  Project as ProjectType,
  Testimonial,
  User,
} from './payload-types'
import { anyone } from './shared/access/anyone'
import { authenticated } from './shared/access/authenticated'
import { CollectionGroups } from './shared/CollectionGroups'
import { customTranslations } from './shared/customTranslations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const websiteName = 'JHB Software'

export const collections: CollectionConfig[] = [
  // Pages Collections
  Pages,
  Project,
  Articles,
  Customers,
  Authors,

  // Data Collections
  Testimonials,
  ArticleTags,
  Media,

  // System Collections
  Redirects,
  Users,
]

export const locales = ['de', 'en']

export const pageCollections: CollectionConfig[] = collections.filter(
  (collection) => 'page' in collection && typeof collection.page === 'object',
)
export const pageCollectionsSlugs: CollectionSlug[] = pageCollections.map(
  (collection) => collection.slug as CollectionSlug,
)
export type PageCollectionSlugs = (typeof pageCollectionsSlugs)[number]

const translatableCollectionsSlugs: CollectionSlug[] = collections
  .filter((collection) => ![Redirects.slug, Users.slug].includes(collection.slug as CollectionSlug))
  .map((collection) => collection.slug as CollectionSlug)

export default buildConfig({
  localization: {
    locales: locales.map((locale) => ({
      code: locale,
      label: {
        de: 'Deutsch',
        en: 'English',
      }[locale]!,
    })),
    defaultLocale: 'de',
  },
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ` - ${websiteName} CMS`,
      icons: [
        {
          rel: 'icon',
          type: 'image/png',
          url: `/icon.png`,
        },
      ],
      description: `${websiteName} CMS`,
      defaultOGImageType: 'off',
      openGraph: {
        siteName: `${websiteName} CMS`,
      },
    },
    avatar: 'default',
    dateFormat: "dd. MMM yyyy HH:mm 'Uhr'",
    livePreview: {
      collections: pageCollectionsSlugs,
      url: ({ data }) => getPageUrl({ path: data.path, preview: true })!,
    },
    components: {
      graphics: {
        Icon: '/components/Icon',
        Logo: '/components/Logo',
      },
    },
  },
  i18n: {
    fallbackLanguage: 'de',
    supportedLanguages: { en, de },
    translations: customTranslations,
  },
  globals: [Header, Footer, Labels],
  collections: collections,
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  csrf:
    process.env.NODE_ENV === 'production'
      ? ['https://cms.jhb.software']
      : ['http://localhost:3000', 'http://localhost:3001'],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.MONGODB_URI!,
    allowIDOnCreate: true,
  }),
  email: resendAdapter({
    defaultFromAddress: 'cms@jhb.software',
    defaultFromName: `${websiteName} CMS`,
    apiKey: process.env.RESEND_API_KEY!,
  }),
  endpoints: [
    {
      path: '/static-paths',
      method: 'get',
      handler: getStatisPagesProps,
    },
    {
      path: '/sitemap',
      method: 'get',
      handler: getSitemap,
    },
    {
      path: '/page-props',
      method: 'get',
      handler: getPagePropsByPath,
    },
  ],
  blocks: [
    // Since the CodeBlock is only used inside the RichText editor of the articles, add it here to generate the type
    CodeBlock,
  ],
  sharp,
  plugins: [
    jhbDashboardPlugin({
      title: websiteName + ' CMS',
      frontend: {
        url: process.env.NEXT_PUBLIC_FRONTEND_URL!,
      },
      features: {
        deploymentInfo: true,
      },
    }),
    adminSearchPlugin({}),
    searchPlugin({
      localize: true,
      collections: collections.map((collection) => collection.slug as CollectionSlug),
      beforeSync: ({ originalDoc, searchDoc }) => {
        const getTitle = () => {
          switch (searchDoc.doc.relationTo as CollectionSlug) {
            case 'authors':
              return (originalDoc as Author).name
            case 'articles':
              return (originalDoc as Article).title
            case 'projects':
              return (originalDoc as ProjectType).title
            case 'pages':
              return (originalDoc as PageType).title
            case 'customers':
              return (originalDoc as Customer).name
            case 'testimonials':
              return (originalDoc as Testimonial).title
            case 'article-tags':
              return (originalDoc as ArticleTag).name
            case 'media':
              return (originalDoc as MediaType).filename
            case 'users':
              return (originalDoc as User).firstName + ' ' + (originalDoc as User).lastName
            default:
              return originalDoc.title
          }
        }

        return {
          ...searchDoc,
          title: getTitle(),
        }
      },
      searchOverrides: {
        admin: {
          group: CollectionGroups.SystemCollections,
          defaultColumns: ['title', 'excerpt', 'doc'],
        },
        access: {
          read: anyone,
          update: authenticated,
          delete: authenticated,
          create: authenticated,
        },
      },
    }),
    translator({
      collections: translatableCollectionsSlugs,
      globals: [Header.slug, Footer.slug, Labels.slug] as GlobalSlug[],
      resolvers: [
        openAIResolver({
          apiKey: process.env.OPENAI_API_KEY!,
        }),
      ],
    }),
    payloadPagesPlugin({}),
    hetznerStorage({
      collections: {
        media: {
          // serve files directly from hetzner object storage to improve performance
          disablePayloadAccessControl: true,
        },
      },
      bucket: process.env.HETZNER_BUCKET!,
      region: 'nbg1',
      credentials: {
        accessKeyId: process.env.HETZNER_ACCESS_KEY_ID!,
        secretAccessKey: process.env.HETZNER_SECRET_ACCESS_KEY!,
      },
      cacheControl: 'public, max-age=2592000', // max age 30 days
      // TODO: reactive client uploads once the issue is fixed: https://github.com/joneslloyd/hetzner-object-storage/issues/1#issuecomment-2970473793
      // clientUploads: true,
      acl: 'public-read',
    }),
    payloadSeoPlugin({
      // JHB plugin related config
      websiteContext: {
        topic: 'Software Developer for mobile, web-apps and websites',
      },
      documentContentTransformers: {
        pages: async (doc: PageType) => ({
          title: doc.title,
          subTitle: doc.hero.subtitle,
        }),
        projects: async (doc: ProjectType, lexicalToPlainText) => ({
          title: doc.title,
          excerpt: doc.excerpt,
          tags: doc.tags?.join(', '),
          body: (await lexicalToPlainText(doc.body)) ?? '',
        }),
      },

      // Payload official seo plugin config:
      collections: pageCollectionsSlugs,
      uploadsCollection: 'media',
      generateTitle: ({ doc, collectionConfig, locale }) => {
        const suffixMap: Record<string, Record<string, string>> = {
          projects: {
            de: 'Referenzen',
            en: 'References',
          },
          articles: {
            de: 'Artikel',
            en: 'Articles',
          },
          authors: {
            de: 'Autoren',
            en: 'Authors',
          },
        }

        const suffix = suffixMap[collectionConfig?.slug ?? '']?.[locale ?? 'de']

        return `${doc.title} - ${websiteName} ${suffix ?? ''}`
      },
      generateURL: ({ doc }) => getPageUrl({ path: doc.path })!,
      interfaceName: 'SeoMetadata',
      fields: ({ defaultFields }) => [
        ...defaultFields.map((field) => {
          if ('name' in field) {
            if (field.name === 'title') {
              return {
                ...field,
                required: true,
                label: {
                  de: 'Titel',
                  en: 'Title',
                },
              }
            } else if (field.name === 'description') {
              return {
                ...field,
                required: true,
                label: {
                  de: 'Beschreibung',
                  en: 'Description',
                },
              }
            } else if (field.name === 'image') {
              return {
                ...field,
                label: {
                  de: 'Bild',
                  en: 'Image',
                },
              }
            }
          }

          return field
        }),
        alternatePathsField(),
      ],
    }),
  ],
})
