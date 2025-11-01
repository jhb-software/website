import { SITE_URL } from 'astro:env/client'
import type { Article, Author } from 'cms/src/payload-types'
import type { Person, Article as SchemaArticle, WithContext } from 'schema-dts'
import { organizationSchema } from './organization'

export const articleSchema = (article: Article, locale: string): WithContext<SchemaArticle> => {
  const authors = Array.isArray(article.authors) ? (article.authors as Author[]) : []

  const authorSchemas: Person[] = authors.map((author) => ({
    '@type': 'Person',
    name: author.name,
    url: new URL(author.path, SITE_URL).toString(),
    image: typeof author.photo === 'object' ? (author.photo.url ?? undefined) : undefined,
    jobTitle: author.profession,
  }))

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: typeof article.image === 'object' ? (article.image.url ?? undefined) : undefined,
    author: authorSchemas.length === 1 ? authorSchemas[0] : authorSchemas,
    publisher: organizationSchema(),
    datePublished: article.createdAt,
    dateModified: article.updatedAt,
    url: new URL(article.path, SITE_URL).toString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': new URL(article.path, SITE_URL).toString(),
    },
    keywords: article.tags?.join(', '),
    articleSection: 'Technology',
    inLanguage: locale,
  }
}
