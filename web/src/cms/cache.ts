import type { Translations } from 'cms/src/payload-types'
import type { Locale } from './types'

interface BuildCache {
  /** Map storing global blocks with composite key of `${locale}-${title}` */
  readonly globalBlocks: Map<string, any>

  /** Map storing translations for each locale */
  readonly translations: Map<Locale, Translations>
}

/** Global build cache which stores frequently used CMS resources when building the website */
export let buildCache: BuildCache = {
  globalBlocks: new Map(),
  translations: new Map(),
}
