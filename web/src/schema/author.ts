import { SITE_URL } from 'astro:env/client'
import type { Author } from 'cms/src/payload-types'
import type { Person, WithContext } from 'schema-dts'

export const authorSchema = (author: Author): WithContext<Person> => {
  const sameAs: string[] = author.socialLinks?.map((link) => link.url) ?? []

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    jobTitle: author.profession,
    description: author.excerpt,
    image: typeof author.photo === 'object' ? (author.photo.url ?? undefined) : undefined,
    url: new URL(author.path, SITE_URL).toString(),
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': new URL(author.path, SITE_URL).toString(),
    },
  }
}
