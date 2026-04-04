import { getSitemap } from '@/cms/getSitemap'
import { locales } from '@/cms/locales'
import type { Locale } from '@/cms/types'
import { websiteConfig } from '@/config'
import { SITE_URL } from 'astro:env/client'

export async function GET() {
  const sitemapEntries = await Promise.all(
    locales.map(async (locale) => ({
      locale,
      entries: await getSitemap(locale as Locale),
    })),
  )

  const lines: string[] = [
    `# ${websiteConfig.name}`,
    '',
    `> ${websiteConfig.domain}`,
    '',
    'This website supports markdown content negotiation.',
    'Request any page with `Accept: text/markdown` to get a Markdown version,',
    'or append `.md` to any page URL.',
    '',
  ]

  for (const { locale, entries } of sitemapEntries) {
    lines.push(`## Pages (${locale})`, '')

    for (const entry of entries) {
      const url = new URL(entry.path, SITE_URL)
      lines.push(`- [${entry.path}](${url})`)
    }

    lines.push('')
  }

  return new Response(lines.join('\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
