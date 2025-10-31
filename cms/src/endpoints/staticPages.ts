import { createHash } from 'crypto'
import { PayloadRequest } from 'payload'

import type { Config } from '@/payload-types'

import { PageCollectionSlugs, pageCollectionsSlugs } from '@/payload.config'

export type StaticPageProps = {
  id: string
  paths: Partial<Record<Config['locale'], string>>
  collection: PageCollectionSlugs
}

/**
 * Returns a list of all pages with the props the frontend needs to prerender them.
 */
export async function getStaticPagesProps(req: PayloadRequest) {
  const collectionItems: StaticPageProps[] = []

  for (const collection of pageCollectionsSlugs) {
    const data = await req.payload.find({
      collection: collection,
      depth: 0, // do not fetch related docs
      limit: 0,
      locale: 'all',
      select: {
        path: true,
      },
      where: {
        _status: { equals: 'published' },
      },
    })

    type Doc = {
      id: string
      path: Partial<Record<Config['locale'], string>>
      collection: PageCollectionSlugs
    }

    for (const doc of data.docs as Doc[]) {
      collectionItems.push({
        collection: collection,
        id: doc.id,
        paths: doc.path,
      })
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
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
      ETag: etag,
    },
  })
}
