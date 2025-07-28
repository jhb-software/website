import type { AstroGlobal } from 'astro'
import type { Labels } from 'cms/src/payload-types'
import { getLabels } from './cms/getLabels'
import { defaultLocale } from './cms/locales'
import type { Locale } from './cms/types'
import { localeFromHeader } from './utils/localeFromHeader'
import { localeFromPath } from './utils/localeFromPath'

interface GlobalState {
  readonly locale: Locale
  readonly preview: boolean
  readonly labels: Labels
}

/** Global state which should be initialized with initGlobalState() at the top of every page */
export let globalState: GlobalState

/**
 * Initializes the globalState of the website by fetching global data based on path params of the provided URL from the CMS.
 */
export async function initGlobalState(Astro: AstroGlobal) {
  const locale =
    localeFromPath(Astro.url.pathname) || localeFromHeader(Astro.request.headers) || defaultLocale
  const preview = Astro.url.pathname.startsWith('/preview')
  const labels = await getLabels({ locale, useCache: !preview })

  globalState = {
    locale,
    preview,
    labels,
  }
}
