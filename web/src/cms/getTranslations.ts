import type { Translations } from 'cms/src/payload-types'
import { buildCache } from './cache'
import { payloadSDK } from './sdk'
import type { Locale } from './types'

export async function getTranslations(locale: Locale): Promise<Translations> {
  if (buildCache.translations.has(locale)) {
    return buildCache.translations.get(locale)!
  }

  const translations = await payloadSDK.findGlobal({
    slug: 'translations',
    locale,
  })

  buildCache.translations.set(locale, translations)

  return translations
}
