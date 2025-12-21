import { SITE_URL } from 'astro:env/client'
import type { Locale } from './cms/types'

type WebsiteConfig = {
  url: string
  name: string
  domain: string
  icon: string
  logo: {
    path: string
    url: string
  }
  ogImage: {
    path: (locale: Locale) => string
    url: (locale: Locale) => string
  }
  socialUrls: string[]
}

export const websiteConfig: WebsiteConfig = {
  url: SITE_URL,
  name: 'JHB Software',
  domain: 'jhb.software',
  icon: '/icon.png',
  logo: {
    path: '/logo.webp',
    url: new URL('/logo.webp', SITE_URL).toString(),
  },
  ogImage: {
    path: (locale: Locale) => `/og_${locale}.png`,
    url: (locale: Locale) => new URL(`/og_${locale}.png`, SITE_URL).toString(),
  },
  socialUrls: [
    'https://github.com/jhb-software',
    'https://www.x.com/jhb_software',
    'https://www.linkedin.com/company/jhb-software/',
  ],
}
