import { withPayload } from '@payloadcms/next/withPayload'
import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
  // The `getResources` MCP tool reads markdown files from `cms/resources/` at runtime
  // (see `src/mcp/resources.ts`). The directory is scanned dynamically, so static
  // tracing can't detect it — force-include the files into the serverless function
  // that serves Payload's API (and thus the MCP endpoint) under `api/[...slug]`.
  outputFileTracingIncludes: {
    '/api/[...slug]': ['./resources/**/*.md'],
  },
  redirects: async () => [
    {
      destination: '/admin',
      permanent: true,
      source: '/',
    },
  ],
  // `@resvg/resvg-js` loads a platform-specific `.node` native binding via its
  // `js-binding.js` shim, which Turbopack refuses to inline into an ESM chunk.
  // Listing it here keeps it as a runtime `require` in the serverless function.
  serverExternalPackages: ['@resvg/resvg-js'],
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
