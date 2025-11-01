import { PayloadSDK } from '@payloadcms/sdk'
import type { RedirectConfig } from 'astro'
import type { Config } from 'cms/src/payload-types'
import 'dotenv/config'

// import.meta.env and astro:env is not available in config files, therefore use process.env instead:
const CMS_URL = process.env.CMS_URL

if (!CMS_URL) {
  throw new Error('CMS_URL environment variable is required')
}

const configSDK = new PayloadSDK<Config>({
  baseURL: CMS_URL + '/api',
})

/** Fetches the redirects from the CMS and converts them to the Astro `RedirectConfig` format. */
export async function getRedirects(): Promise<Record<string, RedirectConfig>> {
  const redirectsCms = await configSDK.find({
    collection: 'redirects',
    limit: 0, // query all
  })

  const redirects = redirectsCms.docs.reduce<Record<string, RedirectConfig>>((acc, doc) => {
    acc[doc.sourcePath] = {
      destination: doc.destinationPath,
      status: doc.type === 'permanent' ? 301 : 302,
    }
    return acc
  }, {})

  return redirects
}
