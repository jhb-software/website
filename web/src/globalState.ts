import type { AstroGlobal } from 'astro'
import type { Footer, Header, Labels } from 'cms/src/payload-types'
import { getGlobalData } from './cms/getGlobalData'
import { defaultLocale } from './cms/locales'
import type { Locale } from './cms/types'
import { localeFromHeader } from './utils/localeFromHeader'
import { localeFromPath } from './utils/localeFromPath'

interface GlobalState {
  readonly locale: Locale
  readonly preview: boolean
  readonly labels: Labels
  readonly header: Header
  readonly footer: Footer
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
  const { labels, header, footer } = await getGlobalData({ locale, preview })

  globalState = {
    locale,
    preview,
    labels,
    header,
    footer,
  }
}
