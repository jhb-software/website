import { anthropic, createAnthropic } from '@ai-sdk/anthropic'
import { createOpenAI } from '@ai-sdk/openai'
import { adminSearchPlugin } from '@jhb.software/payload-admin-search'
import {
  openAIResolver as altTextOpenAIResolver,
  payloadAltTextPlugin,
} from '@jhb.software/payload-alt-text-plugin'
import { chatAgentPlugin, createPayloadBudget } from '@jhb.software/payload-chat-agent'
import {
  openAIResolver,
  payloadContentTranslatorPlugin,
} from '@jhb.software/payload-content-translator-plugin'
import { alternatePathsField, payloadPagesPlugin } from '@jhb.software/payload-pages-plugin'
import { vercelDeploymentsPlugin } from '@jhb.software/payload-vercel-deployments'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { resendAdapter } from '@payloadcms/email-resend'
import { mcpPlugin } from '@payloadcms/plugin-mcp'
import { searchPlugin } from '@payloadcms/plugin-search'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { FixedToolbarFeature, lexicalEditor, LinkFeature } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { de } from '@payloadcms/translations/languages/de'
import { en } from '@payloadcms/translations/languages/en'
import { attachDatabasePool } from '@vercel/functions'
import path from 'path'
import { buildConfig, CollectionConfig, CollectionSlug, GlobalSlug, User } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import type {
  Article,
  ArticleTag,
  Author,
  Customer,
  Image,
  Page,
  Project,
  Testimonial,
} from './payload-types'

import CodeBlock from './blocks/CodeBlock'
import ApiKeys from './collections/ApiKeys'
import Articles from './collections/Articles'
import ArticleTags from './collections/ArticleTags'
import Authors from './collections/Authors'
import Customers from './collections/Customers'
import { Images } from './collections/Images'
import Pages from './collections/Pages'
import Projects from './collections/Projects'
import { Redirects } from './collections/Redirects'
import Testimonials from './collections/Testimonials'
import { Users } from './collections/Users'
import { generateThumbnail } from './endpoints/generateThumbnail'
import { getGlobalData } from './endpoints/globalData'
import { getPagePropsByPath } from './endpoints/pageProps'
import { getSitemap } from './endpoints/sitemap'
import { getStaticPagesProps } from './endpoints/staticPages'
import Footer from './globals/Footer'
import Header from './globals/Header'
import Labels from './globals/Labels'
import { authenticated } from './shared/access/authenticated'
import { CollectionGroups } from './shared/CollectionGroups'
import { customTranslations } from './shared/customTranslations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const websiteName = 'JHB Software'

const { budget: chatBudget, collection: chatTokenUsageCollection } = createPayloadBudget({
  limit: 2_000_000,
  period: 'daily',
  scope: 'user',
})

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })
const anthropicClient = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

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
  Images,

  // System Collections
  Redirects,
  Users,
  ApiKeys,
  chatTokenUsageCollection,
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
    ? `${process.env.NEXT_PUBLIC_FRONTEND_URL}${preview ? '/preview' : ''}${path === '/' ? '' : path}`
    : null
}

export default buildConfig({
  admin: {
    avatar: 'default',
    components: {
      graphics: {
        Icon: '/components/Icon',
        Logo: '/components/Logo',
      },
    },
    dashboard: {
      defaultLayout: [
        { widgetSlug: 'vercel-deployments', width: 'medium' },
        { widgetSlug: 'alt-text-health', width: 'medium' },
      ],
      widgets: [],
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
    // see https://vercel.com/guides/connection-pooling-with-functions
    afterOpenConnection: async (adapter) => attachDatabasePool(adapter.connection.getClient()),
    allowIDOnCreate: true,
    url: process.env.MONGODB_URI!,
  }),
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures.filter((feature) => feature.key !== 'relationship'),
      FixedToolbarFeature(),
      LinkFeature({ enabledCollections: pageCollectionsSlugs }),
    ],
  }),
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
    {
      handler: getGlobalData,
      method: 'get',
      path: '/global-data',
    },
    {
      custom: {
        description:
          'Generate a branded 1920x1080 article thumbnail (Montserrat typeface, matching the website) with title, subtitle and the JHB logo in the bottom-left. Backgrounds come as either `blobs` (gradient with blurred accent colors) or `gradient` (plain linear gradient), with an optional film-grain noise overlay. The image is uploaded to the `images` collection and (if `articleId` is provided) set as the article`s `image`.',
        schema: {
          body: {
            articleId: { required: false, type: 'string' },
            background: {
              properties: {
                accents: { items: { type: 'string' }, required: false, type: 'array' },
                colors: { items: { type: 'string' }, required: false, type: 'array' },
                noise: { required: false, type: 'boolean' },
                pattern: { enum: ['blobs', 'gradient'], required: false, type: 'string' },
                preset: {
                  enum: ['blue', 'purple', 'dark', 'teal', 'sunset'],
                  required: false,
                  type: 'string',
                },
              },
              required: false,
              type: 'object',
            },
            format: { enum: ['webp', 'png'], required: false, type: 'string' },
            subtitle: { required: true, type: 'string' },
            title: { required: true, type: 'string' },
          },
          response: {
            filename: { type: 'string' },
            id: { type: 'string' },
            linkedToArticle: { nullable: true, type: 'string' },
            url: { type: 'string' },
          },
        },
      },
      handler: generateThumbnail,
      method: 'post',
      path: '/generate-thumbnail',
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
    mcpPlugin({
      collections: {
        'article-tags': { enabled: true },
        articles: { enabled: true },
        authors: { enabled: true },
        customers: { enabled: true },
        images: { enabled: true },
        pages: { enabled: true },
        projects: { enabled: true },
        testimonials: { enabled: true },
      },
      globals: {
        footer: { enabled: true },
        header: { enabled: true },
        labels: { enabled: true },
      },
    }),
    vercelDeploymentsPlugin({
      vercel: {
        apiToken: process.env.VERCEL_API_TOKEN!,
        projectId: process.env.FRONTEND_VERCEL_PROJECT_ID!,
        teamId: process.env.FRONTEND_VERCEL_TEAM_ID,
      },
      widget: {
        websiteUrl: process.env.NEXT_PUBLIC_FRONTEND_URL,
      },
    }),
    adminSearchPlugin({}),
    payloadAltTextPlugin({
      collections: ['images'],
      getImageThumbnail: (doc) => {
        const image = doc as unknown as Image

        // use sm if possible to reduce token count and speed up the generation of the alt text
        return image.sizes?.sm?.url ?? image.sizes?.md?.url ?? image.sizes?.lg?.url ?? image.url!
      },
      resolver: altTextOpenAIResolver({
        apiKey: process.env.OPENAI_API_KEY!,
        model: 'gpt-4.1-mini',
      }),
    }),
    // There is an issue that when the s3 plugin comes after the search plugin in the plugins list,
    // and it includes the Images collection, image sizes uploads do not work. Therefore, the s3Storage plugin
    // is added before the search plugin.
    // see GitHub Issue: https://github.com/payloadcms/payload/issues/15431
    s3Storage({
      acl: 'public-read',
      bucket: process.env.HETZNER_BUCKET!,
      clientUploads: true,
      collections: {
        images: {
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
            case 'images':
              return (originalDoc as Image).filename
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
          read: authenticated,
          update: authenticated,
        },
        admin: {
          defaultColumns: ['title', 'excerpt', 'doc'],
          group: CollectionGroups.SystemCollections,
        },
      },
    }),
    payloadContentTranslatorPlugin({
      collections: collections
        .filter((collection) => ![Redirects.slug, Users.slug].includes(collection.slug))
        .map((collection) => collection.slug as CollectionSlug),
      globals: [Header.slug, Footer.slug, Labels.slug] as GlobalSlug[],
      resolver: openAIResolver({
        apiKey: process.env.OPENAI_API_KEY!,
        model: 'gpt-4o-mini',
      }),
    }),
    payloadPagesPlugin({
      generatePageURL,
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
        {
          admin: {
            description:
              'If checked, a noindex meta tag will be added to the page and it will be excluded from the sitemap.',
          },
          defaultValue: false,
          index: true,
          name: 'noIndex',
          type: 'checkbox',
        },
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
      uploadsCollection: 'images',
    }),
    // Adds `custom.description` and `custom.schema` to endpoints registered by
    // other plugins so the chat agent's `callEndpoint` tool can discover them
    // and construct valid calls. Must run before chatAgentPlugin and after the
    // plugins whose endpoints are described.
    // TODO: update the plugins to add descriptions and release new versions
    (config) => ({
      ...config,
      endpoints: (config.endpoints ?? []).map((endpoint) => {
        const key = `${endpoint.method?.toUpperCase()} ${endpoint.path}`
        const endpointMeta: Record<
          string,
          {
            description: string
            schema?: {
              body?: Record<string, unknown>
              query?: Record<string, unknown>
              response?: Record<string, unknown>
            }
          }
        > = {
          'GET /alt-text-plugin/health': {
            description:
              'Get alt-text coverage health: total images vs. images missing alt text per locale.',
          },
          'GET /vercel-deployments': {
            description:
              'List recent Vercel deployments of the frontend project with status and timestamps.',
          },
          'POST /alt-text-plugin/generate': {
            description: 'Generate an AI alt text for a single image.',
            schema: {
              body: {
                id: { required: true, type: 'string' },
                keywords: { required: false, type: 'string' },
                locale: { required: false, type: 'string' },
              },
            },
          },
          'POST /alt-text-plugin/generate/bulk': {
            description: 'Bulk-generate AI alt texts for multiple images.',
            schema: {
              body: {
                ids: { items: { type: 'string' }, required: true, type: 'array' },
                locale: { required: false, type: 'string' },
              },
            },
          },
          'POST /translator/translate': {
            description:
              'Translate a document or global from the default locale to another locale using AI.',
            schema: {
              body: {
                collection: { required: false, type: 'string' },
                global: { required: false, type: 'string' },
                id: { required: false, type: 'string' },
                sourceLocale: { required: true, type: 'string' },
                targetLocale: { required: true, type: 'string' },
              },
            },
          },
          'POST /vercel-deployments': {
            description: 'Trigger a new Vercel deployment of the frontend project.',
          },
        }
        const meta = endpointMeta[key]
        if (!meta) return endpoint
        return {
          ...endpoint,
          custom: { ...(endpoint.custom ?? {}), ...meta },
        }
      }),
    }),
    chatAgentPlugin({
      availableModels: [
        { id: 'claude-haiku-4-5', label: 'Claude Haiku 4.5' },
        { id: 'claude-sonnet-4-5', label: 'Claude Sonnet 4.5' },
        { id: 'gpt-5-mini', label: 'GPT-5 mini' },
      ],
      budget: chatBudget,
      defaultModel: 'claude-haiku-4-5',
      model: (id) => (id.startsWith('gpt-') ? openai(id) : anthropicClient(id)),
      tools: ({ defaultTools }) => ({
        ...defaultTools,
        webFetch: anthropic.tools.webFetch_20250910({ maxUses: 5 }),
        webSearch: anthropic.tools.webSearch_20250305({ maxUses: 5 }),
      }),
    }),
  ],
})
