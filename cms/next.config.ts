import { withPayload } from '@payloadcms/next/withPayload'
import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  redirects: async () => [
    {
      source: '/',
      destination: '/admin',
      permanent: true,
    },
  ],
  turbopack: {},
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
