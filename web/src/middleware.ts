import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware(async (context, next) => {
  const acceptHeader = context.request.headers.get('accept') ?? ''

  if (acceptHeader.includes('text/markdown')) {
    const url = new URL(context.request.url)

    // Only rewrite paths that don't look like static asset requests
    const ASSET_EXTENSION_RE = /\.(html|md|js|css|json|xml|txt|ico|svg|png|jpg|jpeg|webp|gif|woff2?|ttf|eot)$/i
    if (!ASSET_EXTENSION_RE.test(url.pathname)) {
      url.pathname = url.pathname + '.md'
      return context.rewrite(url)
    }
  }

  return next()
})
