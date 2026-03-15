import type { LexicalNode } from '@jhb.software/astro-payload-richtext-lexical'
import type { APIContext, APIRoute, GetStaticPaths } from 'astro'
import type { Article } from 'cms/src/payload-types'
import { getPageData } from '../../cms/getPageData'
import { getStaticPaths as getStaticPathsCms } from '../../cms/getStaticPaths'
import type { Locale } from '../../cms/types'
import { lexicalToMarkdown } from '../../utils/lexicalToMarkdown'

function escapeYamlString(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getStaticPathsCms()
  return paths.filter((p) => p.props.collection === 'articles')
}

export const GET: APIRoute = async ({ props, params }: APIContext) => {
  const { id } = props as { id: string }
  const { lang } = params
  const locale = lang as Locale

  const article = await getPageData<Article>('articles', id, locale)

  const authors = article.authors
    ?.map((a) => (typeof a === 'object' ? a.name : null))
    .filter(Boolean)
    .join(', ')

  const tags = article.tags
    ?.map((t) => (typeof t === 'object' ? t.name : null))
    .filter(Boolean)
    .join(', ')

  const frontmatterLines = [
    '---',
    `title: "${escapeYamlString(article.title)}"`,
    `excerpt: "${escapeYamlString(article.excerpt)}"`,
    ...(authors ? [`authors: "${escapeYamlString(authors)}"`] : []),
    ...(tags ? [`tags: "${escapeYamlString(tags)}"`] : []),
    `date: "${article.createdAt}"`,
    `updated: "${article.updatedAt}"`,
    '---',
    '',
    '',
  ]

  const frontmatter = frontmatterLines.join('\n')
  const content = lexicalToMarkdown(
    article.content.root.children as unknown as LexicalNode[],
  )

  return new Response(frontmatter + content, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  })
}
