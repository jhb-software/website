import { CMS_URL } from 'astro:env/server'
import type { PageProps } from 'cms/src/endpoints/pageProps'
import type { SeoMetadata } from 'cms/src/payload-types'
import type { Locale } from './types'

export type PageMetaData = {
  meta: SeoMetadata
}

export type PageData = PageMetaData & {
  [key: string]: unknown
}

// TODO: use the payload SDK to get the page data
export async function getPageData(
  props: PageProps,
  locale: Locale,
  options?: { preview?: boolean },
): Promise<PageData> {
  const queryOptions = new URLSearchParams()

  queryOptions.set('locale', locale)
  queryOptions.set('limit', '1')
  queryOptions.set('pagination', 'false')

  if (options?.preview) {
    queryOptions.set('draft', 'true')
    queryOptions.set('where[_status][in]', 'published,draft')
  } else {
    queryOptions.set('draft', 'false')
    queryOptions.set('where[_status][equals]', 'published')
  }

  const response = await fetch(
    `${CMS_URL}/api/${props.collection}/${props.id}?${queryOptions.toString()}`,
  )
  const data = await response.json()

  if (!response.ok) {
    throw new Error('Failed to fetch page data. ' + JSON.stringify({ props, data }))
  }

  return data
}
