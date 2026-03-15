import type { LexicalNode } from '@jhb.software/astro-payload-richtext-lexical'
import type { APIContext, APIRoute, GetStaticPaths } from 'astro'
import type { Article, Author, Page, Project, RichTextBlock } from 'cms/src/payload-types'
import type { CollectionSlug } from 'payload'
import { getPageData } from '../../cms/getPageData'
import { getStaticPaths as getStaticPathsCms } from '../../cms/getStaticPaths'
import type { Locale } from '../../cms/types'
import { lexicalToMarkdown } from '../../utils/lexicalToMarkdown'

type PageCollection = Article | Project | Author | Page

function escapeYamlString(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

function richTextToMarkdown(richText: { root: { children: unknown[] } }): string {
  return lexicalToMarkdown(richText.root.children as LexicalNode[])
}

function buildMarkdown(
  collection: string,
  doc: PageCollection,
): { frontmatter: Record<string, string>; content: string } {
  switch (collection) {
    case 'articles': {
      const article = doc as Article
      const authors = article.authors
        ?.map((a) => (typeof a === 'object' ? a.name : null))
        .filter(Boolean)
        .join(', ')
      const tags = article.tags
        ?.map((t) => (typeof t === 'object' ? t.name : null))
        .filter(Boolean)
        .join(', ')
      return {
        frontmatter: {
          title: article.title,
          excerpt: article.excerpt,
          ...(authors ? { authors } : {}),
          ...(tags ? { tags } : {}),
          date: article.createdAt,
          updated: article.updatedAt,
        },
        content: richTextToMarkdown(article.content),
      }
    }

    case 'projects': {
      const project = doc as Project
      const customer =
        typeof project.customer === 'object' ? project.customer.name : undefined
      return {
        frontmatter: {
          title: project.title,
          excerpt: project.excerpt,
          ...(customer ? { customer } : {}),
          tags: (project.tags ?? []).join(', '),
          date: project.createdAt,
          updated: project.updatedAt,
        },
        content: richTextToMarkdown(project.body),
      }
    }

    case 'authors': {
      const author = doc as Author
      return {
        frontmatter: {
          name: author.name,
          profession: author.profession,
          excerpt: author.excerpt,
          date: author.createdAt,
          updated: author.updatedAt,
        },
        content: richTextToMarkdown(author.description),
      }
    }

    case 'pages': {
      const page = doc as Page
      const contentParts: string[] = []
      for (const section of page.sections ?? []) {
        if (section.title) contentParts.push(`## ${section.title}\n\n`)
        if (section.subTitle) contentParts.push(`### ${section.subTitle}\n\n`)
        for (const block of section.blocks ?? []) {
          if (block.blockType === 'rich-text') {
            contentParts.push(richTextToMarkdown((block as RichTextBlock).text))
          }
        }
      }
      return {
        frontmatter: {
          title: page.title,
          date: page.createdAt,
          updated: page.updatedAt,
        },
        content: contentParts.join(''),
      }
    }

    default:
      return { frontmatter: {}, content: '' }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return await getStaticPathsCms()
}

export const GET: APIRoute = async ({ props, params }: APIContext) => {
  const { collection, id } = props as { collection: string; id: string }
  const { lang } = params
  const locale = lang as Locale

  const doc = await getPageData<PageCollection>(collection as CollectionSlug, id, locale)

  const { frontmatter, content } = buildMarkdown(collection, doc)

  const frontmatterLines = [
    '---',
    ...Object.entries(frontmatter).map(([k, v]) => `${k}: "${escapeYamlString(v)}"`),
    '---',
    '',
    '',
  ]

  return new Response(frontmatterLines.join('\n') + content, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  })
}
