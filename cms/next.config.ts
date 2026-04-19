import { withPayload } from '@payloadcms/next/withPayload'
import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
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
