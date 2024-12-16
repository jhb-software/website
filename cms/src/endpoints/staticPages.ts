
import type { Config } from '@/payload-types'
import { PageCollectionSlugs, pageCollectionsSlugs } from '@/payload.config'
import { PayloadRequest } from 'payload'


type StaticPageProps = {
  id: number
  paths: Partial<Record<Config['locale'], string>>
  collection: string
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

        // TODO: remove these selects once the setVirtualFieldsBeforeRead hook from the pages plugin is migrated
        slug: true,
        parent: true,
      },
    })

    type Doc = {
      id: number
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

  return new Response(JSON.stringify(collectionItems), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
