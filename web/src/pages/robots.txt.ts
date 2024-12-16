import { SITE_URL } from 'astro:env/client'
import { locales } from '../cms/locales'

export async function GET() {
  const robotsContent = [
    'User-agent: *',
    'Allow: /',
    ...locales.map((locale) => `Sitemap: ${SITE_URL}/${locale}/sitemap.xml`),
  ].join('\n')

  return new Response(robotsContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
