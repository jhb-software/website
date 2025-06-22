import { SITE_URL } from 'astro:env/client'
import type { Locale } from './cms/types'

export const plausibleDomain = 'jhb.software'

export const iconPath = '/icon.png'

export const logoPath = '/logo.webp'
export const logoURL = new URL(logoPath, SITE_URL).toString()

export const siteOgImagePath = (locale: Locale) => {
  return `/og_${locale}.png`
}
export const siteOgImageURL = (locale: Locale) => {
  return new URL(siteOgImagePath(locale), SITE_URL).toString()
}

export const siteName = 'JHB Software'
