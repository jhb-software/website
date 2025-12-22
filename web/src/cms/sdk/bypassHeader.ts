/**
 * Adds the Vercel automation bypass header to a request if the secret is configured.
 * This allows fetching from CMS preview deployments that have Vercel Authentication enabled.
 */
export function addBypassHeader(
  init: RequestInit | undefined,
  bypassSecret: string | undefined,
): RequestInit {
  if (!bypassSecret) {
    return init ?? {}
  }

  const headers = new Headers(init?.headers)
  headers.set('x-vercel-protection-bypass', bypassSecret)

  return {
    ...init,
    headers,
  }
}
