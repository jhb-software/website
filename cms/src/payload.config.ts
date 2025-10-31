import { adminSearchPlugin } from '@jhb.software/payload-admin-search'
import { payloadAltTextPlugin } from '@jhb.software/payload-alt-text-plugin'
import { alternatePathsField, payloadPagesPlugin } from '@jhb.software/payload-pages-plugin'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { resendAdapter } from '@payloadcms/email-resend'
import { searchPlugin } from '@payloadcms/plugin-search'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { de } from '@payloadcms/translations/languages/de'
import { en } from '@payloadcms/translations/languages/en'
import path from 'path'
import { buildConfig, CollectionConfig, CollectionSlug, GlobalSlug, User } from 'payload'
import { openAIResolver, translator } from 'plugins/cms-content-translator/src'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import CodeBlock from './blocks/CodeBlock'
import Articles from './collections/Articles'
import ArticleTags from './collections/ArticleTags'
import Authors from './collections/Authors'
import Customers from './collections/Customers'
import { Media } from './collections/Media'
import Pages from './collections/Pages'
import Projects from './collections/Projects'
import { Redirects } from './collections/Redirects'
import Testimonials from './collections/Testimonials'
import { Users } from './collections/Users'
import { getPagePropsByPath } from './endpoints/pageProps'
import { getSitemap } from './endpoints/sitemap'
import { getStaticPagesProps } from './endpoints/staticPages'
import Footer from './globals/Footer'
import Header from './globals/Header'
import Labels from './globals/Labels'
import {
  Article,
  ArticleTag,
  Author,
  Customer,
  Media as MediaType,
  Page,
  Project,
  Testimonial,
} from './payload-types'
import { jhbDashboardPlugin } from './plugins/jhb-dashboard/plugin'
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
  Projects,
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

const generatePageURL = ({
  path,
  preview,
}: {
  path: string | null
  preview: boolean
}): string | null => {
  return path && process.env.NEXT_PUBLIC_FRONTEND_URL
    ? `${process.env.NEXT_PUBLIC_FRONTEND_URL}${preview ? '/preview' : ''}${path}`
    : null
}

const translatableCollectionsSlugs: CollectionSlug[] = collections
  .filter((collection) => ![Redirects.slug, Users.slug].includes(collection.slug as CollectionSlug))
  .map((collection) => collection.slug as CollectionSlug)

export default buildConfig({
  admin: {
    avatar: 'default',
    components: {
      graphics: {
        Icon: '/components/Icon',
        Logo: '/components/Logo',
      },
    },
    dateFormat: "dd. MMM yyyy HH:mm 'Uhr'",
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      defaultOGImageType: 'off',
      description: `${websiteName} CMS`,
      icons: [
        {
          rel: 'icon',
          type: 'image/png',
          url: `/icon.png`,
        },
      ],
      openGraph: {
        siteName: `${websiteName} CMS`,
      },
      titleSuffix: ` - ${websiteName} CMS`,
    },
    user: Users.slug,
  },
  blocks: [
    // Since the CodeBlock is only used inside the RichText editor of the articles, add it here to generate the type
    CodeBlock,
  ],
  collections: collections,
  csrf:
    process.env.NODE_ENV === 'production'
      ? ['https://cms.jhb.software']
      : ['http://localhost:3000', 'http://localhost:3001'],
  db: mongooseAdapter({
    allowIDOnCreate: true,
    url: process.env.MONGODB_URI!,
  }),
  editor: lexicalEditor(),
  email: resendAdapter({
    apiKey: process.env.RESEND_API_KEY!,
    defaultFromAddress: 'cms@jhb.software',
    defaultFromName: `${websiteName} CMS`,
  }),
  endpoints: [
    {
      handler: getStaticPagesProps,
      method: 'get',
      path: '/static-paths',
    },
    {
      handler: getSitemap,
      method: 'get',
      path: '/sitemap',
    },
    {
      handler: getPagePropsByPath,
      method: 'get',
      path: '/page-props',
    },
  ],
  globals: [Header, Footer, Labels],
  i18n: {
    fallbackLanguage: 'de',
    supportedLanguages: { de, en },
    translations: customTranslations,
  },
  localization: {
    defaultLocale: 'de',
    locales: locales.map((locale) => ({
      code: locale,
      label: {
        de: 'Deutsch',
        en: 'English',
      }[locale]!,
    })),
  },
  secret: process.env.PAYLOAD_SECRET || '',
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  plugins: [
    jhbDashboardPlugin({
      features: {
        deploymentInfo: true,
      },
      frontend: {
        url: process.env.NEXT_PUBLIC_FRONTEND_URL!,
      },
      title: websiteName + ' CMS',
    }),
    adminSearchPlugin({}),
    payloadAltTextPlugin({
      collections: ['media'],
      getImageThumbnail: (doc) => {
        const image = doc as unknown as MediaType

        // use sm if possible to reduce token count and speed up the generation of the alt text
        return image.sizes?.sm?.url ?? image.sizes?.md?.url ?? image.sizes?.lg?.url ?? image.url!
      },
      model: 'gpt-4.1-mini',
      openAIApiKey: process.env.OPENAI_API_KEY!,
    }),
    searchPlugin({
      beforeSync: ({ originalDoc, searchDoc }) => {
        const getTitle = () => {
          switch (searchDoc.doc.relationTo as CollectionSlug) {
            case 'authors':
              return (originalDoc as Author).name
            case 'articles':
              return (originalDoc as Article).title
            case 'projects':
              return (originalDoc as Project).title
            case 'pages':
              return (originalDoc as Page).title
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
      collections: collections.map((collection) => collection.slug as CollectionSlug),
      localize: true,
      searchOverrides: {
        access: {
          create: authenticated,
          delete: authenticated,
          read: anyone,
          update: authenticated,
        },
        admin: {
          defaultColumns: ['title', 'excerpt', 'doc'],
          group: CollectionGroups.SystemCollections,
        },
      },
    }),
    translator({
      collections: translatableCollectionsSlugs,
      disabled: true, // temporary disabled because of dependency mismatch issues
      globals: [Header.slug, Footer.slug, Labels.slug] as GlobalSlug[],
      resolvers: [
        openAIResolver({
          apiKey: process.env.OPENAI_API_KEY!,
        }),
      ],
    }),
    payloadPagesPlugin({
      generatePageURL,
    }),
    s3Storage({
      acl: 'public-read',
      bucket: process.env.HETZNER_BUCKET!,
      clientUploads: true,
      collections: {
        media: {
          // serve files directly from hetzner object storage to improve performance
          disablePayloadAccessControl: true,
        },
      },
      config: {
        credentials: {
          accessKeyId: process.env.HETZNER_ACCESS_KEY_ID!,
          secretAccessKey: process.env.HETZNER_SECRET_ACCESS_KEY!,
        },
        endpoint: 'https://nbg1.your-objectstorage.com',
        region: 'nbg1',
        // TODO: setting cache control is not (yet) supported by the s3 plugin
        // see: https://github.com/payloadcms/payload/pull/14412
        // cacheControl: 'public, max-age=2592000', // max age 30 days
      },
    }),
    seoPlugin({
      collections: pageCollectionsSlugs,
      fields: ({ defaultFields }) => [
        ...defaultFields.map((field) => {
          if ('name' in field) {
            if (field.name === 'title') {
              return {
                ...field,
                label: {
                  de: 'Titel',
                  en: 'Title',
                },
                required: true,
              }
            } else if (field.name === 'description') {
              return {
                ...field,
                label: {
                  de: 'Beschreibung',
                  en: 'Description',
                },
                required: true,
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
      generateTitle: ({ collectionConfig, doc, locale }) => {
        const suffixMap: Record<string, Record<string, string>> = {
          articles: {
            de: 'Artikel',
            en: 'Articles',
          },
          authors: {
            de: 'Autoren',
            en: 'Authors',
          },
          projects: {
            de: 'Referenzen',
            en: 'References',
          },
        }
        const suffix = suffixMap[collectionConfig?.slug ?? '']?.[locale ?? 'de']
        return `${doc.title} - ${websiteName} ${suffix ?? ''}`
      },
      generateURL: ({ doc }) => generatePageURL({ path: doc.path, preview: false }) ?? '',
      interfaceName: 'SeoMetadata',
      uploadsCollection: 'media',
    }),
  ],
})
