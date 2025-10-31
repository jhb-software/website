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
  turbopack: {},
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
