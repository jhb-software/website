import type { Config } from '@/payload-types'
import { locales, pageCollectionsSlugs } from '@/payload.config'
import { PayloadRequest } from 'payload'

export type SitemapEntry = {
  path: string
  updatedAt: string
}

/**
 * Returns a list of all sitemap entries for the given locale.
 */
export async function getSitemap(req: PayloadRequest) {
  const locale = String(req.query.locale) as Config['locale']

  if (!locale) {
    return new Response('No locale query parameter provided.', { status: 400 })
  } else if (!locales.includes(locale)) {
    return new Response(
      `Invalid locale query parameter provided. Only ${locales.join(', ')} are allowed.`,
      {
        status: 400,
      },
    )
  }

  const pages: SitemapEntry[] = []

  for (const collection of pageCollectionsSlugs) {
    const data = await req.payload.find({
      collection: collection,
      limit: 1000,
      locale: locale,
      depth: 0, // do not fetch related docs
      where: {
        _status: { equals: 'published' },
      },
      select: {
        path: true,
        updatedAt: true,

        // TODO: remove these selects once the setVirtualFieldsBeforeRead hook from the pages plugin is migrated
        slug: true,
        parent: true,
      },
    })

    type Doc = {
      id: string
      path: string
      updatedAt: string
    }

    for (const doc of data.docs as Doc[]) {
      pages.push({
        path: doc.path,
        updatedAt: doc.updatedAt,
      })
    }
  }

  return new Response(JSON.stringify(pages), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
