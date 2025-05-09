import type { AstroGlobal } from 'astro'
import type { Translations } from 'cms/src/payload-types'
import { getTranslations } from './cms/getTranslations'
import type { Locale } from './cms/types'

interface GlobalState {
  readonly locale: Locale
  readonly preview: boolean
  readonly translations: Translations
}

/** Global state which should be initialized with initGlobalState() at the top of every page */
export let globalState: GlobalState

/**
 * Initializes the globalState of the website by fetching global data based on path params of the provided URL from the CMS.
 */
export async function initGlobalState(Astro: AstroGlobal) {
  const locale = Astro.props.lang as Locale
  const translations = await getTranslations(locale)
  const preview = Astro.url.pathname.startsWith('/preview')

  const state: GlobalState = {
    locale,
    preview,
    translations,
  }

  globalState = state
}
