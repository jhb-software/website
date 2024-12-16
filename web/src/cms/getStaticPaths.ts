import { CMS_URL } from 'astro:env/server'

type StaticPagePropsCMS = {
  id: number
  paths: Partial<Record<string, string>>
  collection: string
}

type StaticPageProps = {
  params: {
    lang: string
    path: string
  }
  props: {
    id: number
    collection: string
  }
}

export async function getStaticPaths(): Promise<StaticPageProps[]> {
  const response = await fetch(`${CMS_URL}/api/static-paths`)
  const data = await response.json()

  const paths: StaticPageProps[] = []

  for (const path of data as StaticPagePropsCMS[]) {
    for (const lang of Object.keys(path.paths)) {
      paths.push({
        params: {
          lang: lang,
          path: path.paths[lang]?.replace(`/${lang}/`, '/') || '',
        },
        props: {
          id: path.id,
          collection: path.collection,
        },
      })
    }
  }

  return paths
}
