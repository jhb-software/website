import type { PageProps } from 'cms/src/endpoints/pageProps'
import type { HeroSection, Page, SeoMetadata } from 'cms/src/payload-types'
import { payloadSDK } from './sdk'
import type { Locale } from './types'

export type PageMetaData = {
  meta: SeoMetadata
}

export type PageData = PageMetaData & {
  hero: HeroSection
  sections: Page['sections']
  [key: string]: unknown
}

export async function getPageData(
  props: PageProps,
  locale: Locale,
  options?: { preview?: boolean },
): Promise<PageData> {
  const result = await payloadSDK.find({
    collection: props.collection as any,
    locale,
    draft: options?.preview ? true : false,
    where: {
      id: {
        equals: props.id,
      },
      _status: options?.preview ? { in: ['draft', 'published'] } : { equals: 'published' },
    },
    limit: 1,
    pagination: false,
  })

  if (result.totalDocs === 0) {
    throw new Error('Page for props ' + JSON.stringify(props) + ' not found')
  }

  return result.docs.at(0) as unknown as PageData
}
