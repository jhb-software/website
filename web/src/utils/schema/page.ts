import { SITE_URL } from 'astro:env/client'
import type { Page } from 'cms/src/payload-types'
import type { WebPage, WithContext } from 'schema-dts'
import { normalizePath } from '../normalizePath'
import { organizationSchema } from './organization'

export const pageSchema = (page: Page, locale: string): WithContext<WebPage> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.title,
    description: page.meta?.description,
    url: new URL(normalizePath(page.path, false), SITE_URL).toString(),
    publisher: organizationSchema(),
    datePublished: page.createdAt,
    dateModified: page.updatedAt,
    inLanguage: locale,
    mainEntity: {
      '@type': 'WebSite',
      '@id': SITE_URL,
      name: 'JHB Software',
      publisher: organizationSchema(),
    },
  }
}
