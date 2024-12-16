import { CMS_URL } from 'astro:env/server'
import type { PageProps } from 'cms/src/endpoints/pageProps'

export async function getPageProps(path: string): Promise<PageProps> {
  const response = await fetch(`${CMS_URL}/api/page-props?path=${path}`)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      'Failed to fetch page props for path: ' + path + '. ' + JSON.stringify({ data }),
    )
  }

  return data
}
