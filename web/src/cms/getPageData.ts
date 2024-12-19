import type { Page, Project } from 'cms/src/payload-types'
import type { PageCollectionSlugs } from 'cms/src/payload.config'
import { payloadSDK } from './sdk'
import type { Locale } from './types'

export type PageData = {
  pages: Page
  projects: Project
}

export async function getPageData<T extends PageCollectionSlugs>(
  collection: T,
  id: string,
  locale: Locale,
  options?: { preview?: boolean },
): Promise<T extends keyof PageData ? PageData[T] : never> {
  const result = await payloadSDK.find({
    collection: collection,
    locale,
    draft: options?.preview ? true : false,
    where: {
      id: {
        equals: id,
      },
      _status: options?.preview ? { in: ['draft', 'published'] } : { equals: 'published' },
    },
    limit: 1,
    pagination: false,
  })

  if (result.totalDocs === 0) {
    throw new Error('Page for collection ' + collection + ' with id ' + id + ' not found')
  }

  return result.docs.at(0) as unknown as T extends keyof PageData ? PageData[T] : never
}
