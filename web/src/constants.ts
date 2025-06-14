import { SITE_URL } from 'astro:env/client'
import type { Locale } from './cms/types'

export const logoPath = '/logo_medium.png'
export const logoURL = new URL(logoPath, SITE_URL).toString()

export const ogImagePath = (locale: Locale) => {
  return `/og_${locale}.png`
}
export const ogImageURL = (locale: Locale) => {
  return new URL(ogImagePath(locale), SITE_URL).toString()
}

export const siteName = 'JHB Software'
