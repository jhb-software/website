import { payloadCloudinaryPlugin } from '@jhb.software/payload-cloudinary-plugin'
import {
  alternatePathsField,
  getPageUrl,
  payloadPagesPlugin,
} from '@jhb.software/payload-pages-plugin'
import { payloadSeoPlugin } from '@jhb.software/payload-seo-plugin'
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { de } from '@payloadcms/translations/languages/de'
import { en } from '@payloadcms/translations/languages/en'
import path from 'path'
import { buildConfig, CollectionConfig, CollectionSlug } from 'payload'
import { fileURLToPath } from 'url'
import Articles from './collections/Articles'
import Customers from './collections/Customers'
import { Media } from './collections/Media'
import Page from './collections/Page'
import Project from './collections/Project'
import { Redirects } from './collections/Redirects'
import Testimonials from './collections/Testimonials'
import { Users } from './collections/Users'
import { getSitemap } from './endpoints/sitemap'
import { getStatisPagesProps } from './endpoints/staticPages'
import Footer from './globals/footer'
import Header from './globals/header'
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

  // Data Collections
  Testimonials,
  Media,

  // System Collections
  Redirects,
  Users,
]

export const locales = ['de', 'en']

export const pageCollections: CollectionConfig[] = collections.filter(
  (collection) => typeof (collection as any).page === 'object',
)
export const pageCollectionsSlugs: CollectionSlug[] = pageCollections.map(
  (collection) => collection.slug as CollectionSlug,
)
export type PageCollectionSlugs = (typeof pageCollectionsSlugs)[number]

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
  },
  i18n: {
    fallbackLanguage: 'de',
    supportedLanguages: { en, de },
    translations: customTranslations,
  },
  globals: [Header, Footer],
  collections: collections,
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || '',
    },
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
  ],
  plugins: [
    payloadPagesPlugin({}),
    payloadCloudinaryPlugin({}),
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
        projects: async (doc: ProjectType, lexicalToPlainText: any) => ({
          title: doc.title,
          excerpt: doc.excerpt,
          tags: doc.tags?.join(', '),
          body: (await lexicalToPlainText(doc.body)) ?? '',
        }),
      },

      // Payload official seo plugin config:
      collections: ['pages', 'projects'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }: { doc: any }) => `${doc.title} - ${siteName}`,
      generateURL: ({ doc }: { doc: any }) => getPageUrl({ path: doc.path })!,
      interfaceName: 'SeoMetadata',
      fields: ({ defaultFields }: { defaultFields: any }) => [
        ...defaultFields.map((field: any) => {
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
