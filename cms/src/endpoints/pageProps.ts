import type { Config } from '@/payload-types'
import { locales, pageCollectionsSlugs } from '@/payload.config'
import { CollectionSlug, PayloadRequest } from 'payload'
import { StaticPageProps } from './staticPages'

export type PageProps = Omit<StaticPageProps, 'paths'>

/**
 * API handler which returns the `PageProps` of the page with the given path.
 *
 * This is used for the preview mode in the frontend.
 */
export async function getPagePropsByPath(req: PayloadRequest) {
  const path = req.query.path as string | undefined

  if (!path) {
    return new Response('No path provided in the body', { status: 400 })
  } else if (path.endsWith('/')) {
    return new Response('The provided path should not end with a trailing slash.', { status: 400 })
  } else if (!locales.includes(path.split('/')[1] as Config['locale'])) {
    return new Response(`The provided path does not start with ${locales.join(' or ')}.`, {
      status: 400,
    })
  }

  const parts = path.split('/')
  const locale = parts[1] as Config['locale']
  const slugs = parts.slice(2)

  // If there is none or only one slug after the locale, the path is for a page in the pages collection.
  // Therefore iterate over the pages collection first. Otherwise the order does not matter.
  const collections =
    slugs.length <= 1
      ? ['pages', ...pageCollectionsSlugs.filter((collection) => collection !== 'pages')]
      : pageCollectionsSlugs

  for (const collection of collections) {
    const data = await req.payload.find({
      collection: collection as CollectionSlug,
      limit: 1000,
      locale: locale,
      depth: 0,
      // For pages which have not been published yet (draft), the CMS by default returns the first/oldest draft instead of the latest draft.
      // This is a problem, because in the first version, there may be no parent set for all locales.
      // Therefore, set draft to true, which always returns the latest published or draft version.
      // ATTENTION: For published pages, this might return the latest unpublisheddraft instead of the published version.
      draft: true,
      where: {
        // filtering for the virtual path field is not supported, as it is not stored in the database
        // Instead, filter for the document slug, which always is the last part of the path
        slug: {
          equals:
            // TODO: implement a better way to detect the root page
            slugs.length == 0 && locale == 'de'
              ? 'startseite'
              : slugs.length == 0 && locale == 'en'
                ? 'frontpage'
                : slugs.at(-1),
        },
      },
      select: {
        id: true,
        slug: true,
        path: true,
        template: true,

        // TODO: remove this select once the setVirtualFieldsBeforeRead hook from the pages plugin is migrated
        parent: true,
      },
    })

    for (const doc of data.docs as unknown as { path: string; id: number }[]) {
      if (doc.path === path) {
        const pageProps: PageProps = {
          id: doc.id,
          collection: collection,
        }

        return new Response(JSON.stringify(pageProps), {
          headers: {
            'Content-Type': 'application/json',
          },
        })
      }
    }
  }

  return new Response(`No collection found for the given path ${path}`, { status: 404 })
}
