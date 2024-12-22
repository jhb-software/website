import type { Config } from '@/payload-types'
import { PageCollectionSlugs, pageCollectionsSlugs } from '@/payload.config'
import { createHash } from 'crypto'
import { PayloadRequest } from 'payload'

export type StaticPageProps = {
  id: string
  paths: Partial<Record<Config['locale'], string>>
  collection: PageCollectionSlugs
}

/**
 * Returns a list of all pages with the props the frontend needs to prerender them.
 */
export async function getStatisPagesProps(req: PayloadRequest) {
  const collectionItems: StaticPageProps[] = []

  for (const collection of pageCollectionsSlugs) {
    const data = await req.payload.find({
      collection: collection,
      limit: 1000,
      locale: 'all',
      depth: 0, // do not fetch related docs
      where: {
        _status: { equals: 'published' },
      },
      select: {
        path: true,
      },
    })

    type Doc = {
      id: string
      path: Partial<Record<Config['locale'], string>>
      collection: PageCollectionSlugs
    }

    for (const doc of data.docs as Doc[]) {
      for (const lang of Object.keys(doc.path)) {
        collectionItems.push({
          id: doc.id,
          paths: doc.path,
          collection: collection,
        })
      }
    }
  }

  const jsonString = JSON.stringify(collectionItems)
  const etag = createHash('md5').update(jsonString).digest('hex')

  // Check if the client has a matching etag
  const ifNoneMatch = req.headers.get('if-none-match')
  if (ifNoneMatch === etag) {
    return new Response(null, { status: 304 })
  }

  return new Response(jsonString, {
    headers: {
      'Content-Type': 'application/json',
      ETag: etag,
      'Cache-Control': 'no-cache',
    },
  })
}
