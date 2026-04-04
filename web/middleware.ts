import { rewrite } from '@vercel/functions'

/**
 * Vercel Routing Middleware for markdown content negotiation.
 *
 * Rewrites requests with `Accept: text/markdown` to the pre-built .md version
 * of the page. This runs before Vercel's filesystem resolution, which is
 * necessary because static HTML files would otherwise be served before any
 * rewrite rules are evaluated.
 *
 * Uses native Vercel middleware instead of Astro's `edgeMiddleware: true`
 * because of an upstream bug (withastro/astro#16156) where Astro's edge
 * middleware drops the HTTP method and body when calling next().
 */
export default function middleware(request: Request) {
  const url = new URL(request.url)
  const path = url.pathname
  const accept = request.headers.get('accept') || ''

  const hasFileExtension = /\.[a-zA-Z0-9]+$/.test(path)
  const wantsMarkdown = accept.includes('text/markdown')

  if (hasFileExtension || !wantsMarkdown) {
    return
  }

  return rewrite(new URL(path + '.md', request.url))
}

export const config = {
  matcher: ['/((?!api|preview|_astro|assets|favicon)(?!.*\\.\\w+$).+)'],
}
