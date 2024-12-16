import { CMS_URL } from 'astro:env/server'
import type { SeoMetadata } from 'cms/src/payload-types'
import type { StaticPageProps } from './getStaticPaths'

export type PageMetaData = {
  meta: SeoMetadata
}

export type PageData = PageMetaData & {
  [key: string]: unknown
}

// TODO: use the payload SDK to get the page data
export async function getPageData(props: StaticPageProps['props']): Promise<PageData> {
  const response = await fetch(`${CMS_URL}/api/${props.collection}/${props.id}`)
  const data = await response.json()

  if (!response.ok) {
    throw new Error('Failed to fetch page data. ' + JSON.stringify({ props, data }))
  }

  return data
}
