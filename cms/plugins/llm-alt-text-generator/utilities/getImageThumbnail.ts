import { Media } from '@/payload-types'

/** Extracts the thumbnail URL from a media document. */
export function getImageThumbnail(media: Media): string {
  let url = media.url

  if (media.sizes?.sm?.url) {
    url = media.sizes.sm.url
  } else {
    console.warn('No thumbnail (sm size) found for media', media)
  }

  if (!url) {
    throw new Error(`No URL found for media` + JSON.stringify(media))
  }

  if (url.startsWith('/api')) {
    url = `${process.env.NEXT_PUBLIC_CMS_URL}${url}`
  }

  if (!url.startsWith('https://')) {
    throw new Error(`Invalid URL for media: ${url}`)
  }

  return url
}
