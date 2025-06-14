import { logoURL, siteName } from '@/constants'
import { SITE_URL } from 'astro:env/client'
import type { Organization, WithContext } from 'schema-dts'

// TODO: add a new 'base data' global to the CMS with the following fields inside a organization group:
// - name
// - description
// - sameAs

export const organizationSchema = (): WithContext<Organization> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    logo: logoURL,
    sameAs: [
      'https://github.com/jhb-software',
      'https://www.x.com/jhb_software',
      'https://www.linkedin.com/company/jhb-software/',
    ],
    // TODO: add description, email etc.
    url: SITE_URL,
  }
}
