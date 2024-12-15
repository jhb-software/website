import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: () => [
    {
      source: '/',
      destination: '/admin',
      permanent: true,
    },
  ],
}

export default withPayload(nextConfig)
