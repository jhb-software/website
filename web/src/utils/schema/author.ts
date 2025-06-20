import { SITE_URL } from 'astro:env/client'
import type { Author, Media } from 'cms/src/payload-types'
import type { Person, WithContext } from 'schema-dts'
import { normalizePath } from '../normalizePath'

export const authorSchema = (author: Author): WithContext<Person> => {
  const sameAs: string[] = author.socialLinks?.map((link) => link.url) ?? []

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    jobTitle: author.profession,
    description: author.excerpt,
    image: (author.photo as Media)?.url ?? undefined,
    url: new URL(normalizePath(author.path, false), SITE_URL).toString(),
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': new URL(normalizePath(author.path, false), SITE_URL).toString(),
    },
  }
}
