import type { Translations } from 'cms/src/payload-types'
import { payloadSDK } from './sdk'
import type { Locale } from './types'

/** Fetches the translations from the CMS. */
export async function getTranslations({
  locale,
  useCache = true,
}: {
  locale: Locale
  useCache?: boolean
}): Promise<Translations> {
  return await payloadSDK.findGlobal(
    {
      slug: 'translations',
      locale,
    },
    useCache,
  )
}
