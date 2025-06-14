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
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { de } from '@payloadcms/translations/languages/de'
import { en } from '@payloadcms/translations/languages/en'
import path from 'path'
import { buildConfig, CollectionConfig, CollectionSlug, GlobalSlug } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import CodeBlock from './blocks/CodeBlock'
import Articles from './collections/Articles'
import Authors from './collections/Authors'
import Customers from './collections/Customers'
import { Media } from './collections/Media'
import Page from './collections/Page'
import Project from './collections/Project'
import { Redirects } from './collections/Redirects'
import Testimonials from './collections/Testimonials'
import { Users } from './collections/Users'
import { getPagePropsByPath } from './endpoints/pageProps'
import { getSitemap } from './endpoints/sitemap'
import { getStatisPagesProps } from './endpoints/staticPages'
import Footer from './globals/footer'
import Header from './globals/header'
import Translations from './globals/translations'
import { Page as PageType, Project as ProjectType } from './payload-types'
import { customTranslations } from './shared/customTranslations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const siteName = 'JHB Software'

export const collections: CollectionConfig[] = [
  // Pages Collections
  Page,
  Project,
  Articles,
  Customers,
  Authors,

  // Data Collections
  Testimonials,
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
      titleSuffix: ` - ${siteName} CMS`,
      // TODO: add favicon
    },
    avatar: 'default',
    dateFormat: "dd. MMM yyyy HH:mm 'Uhr'",
    livePreview: {
      collections: pageCollectionsSlugs,
      url: ({ data }) => getPageUrl({ path: data.path, preview: true })!,
    },
  },
  i18n: {
    fallbackLanguage: 'de',
    supportedLanguages: { en, de },
    translations: customTranslations,
  },
  globals: [Header, Footer, Translations],
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
    defaultFromName: `${siteName} CMS`,
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
    translator({
      collections: translatableCollectionsSlugs,
      globals: [Header.slug, Footer.slug, Translations.slug] as GlobalSlug[],
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
      clientUploads: true,
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

        return `${doc.title} - ${siteName} ${suffix ?? ''}`
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
