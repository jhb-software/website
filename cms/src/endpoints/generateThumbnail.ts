import type { PayloadRequest } from 'payload'

import sharp from 'sharp'

type BackgroundPresetName = 'blue' | 'dark' | 'purple' | 'sunset' | 'teal'

type BackgroundInput = {
  /** Custom accent colors used for the blurred gradient blobs. */
  accents?: [string, string]
  /** Custom gradient colors (from → to). Overrides `preset`. */
  colors?: [string, string]
  /** Toggle the noisy film-grain overlay. Defaults to true. */
  noise?: boolean
  /** Named preset. Defaults to `blue` (brand). */
  preset?: BackgroundPresetName
}

type GenerateThumbnailBody = {
  /** If provided, the new image is set as the article's thumbnail. */
  articleId?: string
  background?: BackgroundInput
  /** Output format. Defaults to `webp`. */
  format?: 'png' | 'webp'
  subtitle: string
  title: string
}

type Preset = {
  accents: [string, string]
  gradient: [string, string]
  subtitleColor: string
  textColor: string
}

const PRESETS: Record<BackgroundPresetName, Preset> = {
  blue: {
    accents: ['#3b82f6', '#06b6d4'],
    gradient: ['#0a1b4a', '#193FAD'],
    subtitleColor: '#cbd5e1',
    textColor: '#ffffff',
  },
  dark: {
    accents: ['#3b82f6', '#8b5cf6'],
    gradient: ['#0a0a0a', '#1e293b'],
    subtitleColor: '#94a3b8',
    textColor: '#ffffff',
  },
  purple: {
    accents: ['#a855f7', '#ec4899'],
    gradient: ['#1e1b4b', '#4c1d95'],
    subtitleColor: '#cbd5e1',
    textColor: '#ffffff',
  },
  sunset: {
    accents: ['#fb923c', '#f472b6'],
    gradient: ['#7c2d12', '#c2410c'],
    subtitleColor: '#fee2e2',
    textColor: '#ffffff',
  },
  teal: {
    accents: ['#14b8a6', '#22d3ee'],
    gradient: ['#042f2e', '#115e59'],
    subtitleColor: '#cbd5e1',
    textColor: '#ffffff',
  },
}

const WIDTH = 1200
const HEIGHT = 630
const PADDING_X = 80

const HEX_REGEX = /^#(?:[0-9a-fA-F]{3}){1,2}$/

function resolvePreset(background?: BackgroundInput): Preset {
  const base = PRESETS[background?.preset ?? 'blue']
  const gradient =
    background?.colors && background.colors.every((c) => HEX_REGEX.test(c))
      ? background.colors
      : base.gradient
  const accents =
    background?.accents && background.accents.every((c) => HEX_REGEX.test(c))
      ? background.accents
      : base.accents
  return { ...base, accents, gradient }
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function wrapText(text: string, maxCharsPerLine: number, maxLines: number): string[] {
  const words = text.trim().split(/\s+/)
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const trial = current ? `${current} ${word}` : word
    if (trial.length > maxCharsPerLine && current) {
      lines.push(current)
      current = word
      if (lines.length === maxLines - 1) break
    } else {
      current = trial
    }
  }
  if (current && lines.length < maxLines) lines.push(current)
  // If we truncated, append ellipsis to last line.
  const joined = lines.join(' ')
  if (joined.length < text.length) {
    lines[lines.length - 1] = `${lines[lines.length - 1]!.replace(/[.,;:!?]+$/, '')}…`
  }
  return lines
}

// Scaled-down inline of /web/public/icon.svg — the brand mark.
const LOGO_SVG_CONTENT = `
  <path d="M0 18C0 8.06 8.06 0 18 0H24.73V24.73H0V18Z" fill="#193FAD"/>
  <rect y="24.73" width="24.73" height="23.27" fill="#214098"/>
  <rect y="48" width="24.73" height="24.73" fill="#1D3782"/>
  <path d="M0 72.73H24.73V96H18C8.06 96 0 87.94 0 78V72.73Z" fill="#182E6D"/>
  <rect x="24.73" y="72.73" width="23.27" height="23.27" fill="#1D3782"/>
  <rect x="48" y="72.73" width="24.73" height="23.27" fill="#214098"/>
  <path d="M72.73 72.73H96V78C96 87.94 87.94 96 78 96H72.73V72.73Z" fill="#193FAD"/>
  <rect x="72.73" y="48" width="23.27" height="24.73" fill="#2047D7"/>
  <rect x="72.73" y="24.73" width="23.27" height="23.27" fill="#2A54D9"/>
  <rect x="48" y="24.73" width="24.73" height="23.27" fill="#2047D7"/>
  <rect x="24.73" y="24.73" width="23.27" height="23.27" fill="#193FAD"/>
  <rect x="24.73" y="48" width="23.27" height="24.73" fill="#214098"/>
  <rect x="48" y="48" width="24.73" height="24.73" fill="#193FAD"/>
  <rect x="24.73" width="23.27" height="24.73" fill="#2047D7"/>
  <rect x="48" width="24.73" height="24.73" fill="#2A54D9"/>
  <path d="M72.73 0H78C87.94 0 96 8.06 96 18V24.73H72.73V0Z" fill="#305CE9"/>
  <path d="M63.47 68.9V28.17H73.65C78.77 28.17 82.61 29.14 85.17 31.08C87.77 33.02 89.07 35.58 89.07 38.76C89.07 40.89 88.55 42.75 87.5 44.34C86.45 45.89 85.02 47.1 83.19 47.95C81.37 48.8 79.27 49.23 76.91 49.23L78.01 46.84C80.57 46.84 82.84 47.27 84.82 48.12C86.8 48.94 88.33 50.16 89.42 51.79C90.54 53.42 91.11 55.42 91.11 57.78C91.11 61.27 89.73 64.01 86.97 65.99C84.22 67.93 80.17 68.9 74.81 68.9H63.47ZM63.47 61.8H74.12C76.56 61.8 78.4 61.41 79.64 60.63C80.92 59.82 81.56 58.54 81.56 56.79C81.56 55.09 80.92 53.83 79.64 53.01C78.4 52.16 76.56 51.73 74.12 51.73H63.47V44.87H72.49C74.78 44.87 76.52 44.48 77.72 43.7C78.96 42.89 79.59 41.67 79.59 40.04C79.59 38.45 78.96 37.26 77.72 36.49C76.52 35.67 74.78 35.27 72.49 35.27H63.47V61.8Z" fill="white"/>
  <path d="M51.67 28.17H61.09V68.9H51.67V28.17ZM52.36 52.2H34.18V44.17L52.36 44.23V52.2Z" fill="white"/>
  <path d="M17.23 69.59C14.48 69.59 11.94 69.09 9.61 68.08C7.62 67.22 5.54 64.62 5.54 64.62L10.15 58.62C11.54 60 11.54 60 12.75 60.75C13.99 61.49 15.33 61.86 16.76 61.86C20.6 61.86 22.52 59.61 22.52 55.11V35.73H8.21V28.17H31.89V54.58C31.89 59.62 30.65 63.39 28.17 65.87C25.69 68.35 22.04 69.59 17.23 69.59Z" fill="white"/>
`

function buildThumbnailSvg({
  preset,
  subtitle,
  title,
  useNoise,
}: {
  preset: Preset
  subtitle: string
  title: string
  useNoise: boolean
}): string {
  const titleLines = wrapText(title, 24, 3)
  const subtitleLines = wrapText(subtitle, 60, 2)

  const titleFontSize = titleLines.length > 2 ? 60 : 72
  const titleLineHeight = Math.round(titleFontSize * 1.15)
  const subtitleFontSize = 30
  const subtitleLineHeight = Math.round(subtitleFontSize * 1.3)

  const textBlockHeight =
    titleLines.length * titleLineHeight + 28 + subtitleLines.length * subtitleLineHeight
  const textStartY = Math.round((HEIGHT - textBlockHeight) / 2) + titleFontSize

  const titleTspans = titleLines
    .map(
      (line, i) =>
        `<tspan x="${PADDING_X}" dy="${i === 0 ? 0 : titleLineHeight}">${escapeXml(line)}</tspan>`,
    )
    .join('')

  const subtitleTspans = subtitleLines
    .map(
      (line, i) =>
        `<tspan x="${PADDING_X}" dy="${i === 0 ? 0 : subtitleLineHeight}">${escapeXml(line)}</tspan>`,
    )
    .join('')

  const subtitleY = textStartY + titleLines.length * titleLineHeight + 16

  const noiseLayer = useNoise
    ? `<rect width="${WIDTH}" height="${HEIGHT}" filter="url(#noise)" opacity="0.55"/>`
    : ''

  const logoSize = 72
  const logoX = PADDING_X - 4
  const logoY = HEIGHT - logoSize - 56
  const logoScale = logoSize / 96

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${preset.gradient[0]}"/>
      <stop offset="100%" stop-color="${preset.gradient[1]}"/>
    </linearGradient>
    <filter id="softBlur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="140"/>
    </filter>
    <filter id="noise" x="0%" y="0%" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.2 0"/>
    </filter>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <g filter="url(#softBlur)">
    <circle cx="180" cy="140" r="260" fill="${preset.accents[0]}" opacity="0.75"/>
    <circle cx="1030" cy="480" r="320" fill="${preset.accents[1]}" opacity="0.65"/>
    <circle cx="720" cy="80" r="180" fill="${preset.accents[0]}" opacity="0.45"/>
    <circle cx="520" cy="560" r="220" fill="${preset.accents[1]}" opacity="0.35"/>
  </g>
  ${noiseLayer}
  <text font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-size="${titleFontSize}" font-weight="700" fill="${preset.textColor}" y="${textStartY}" style="letter-spacing:-0.02em">${titleTspans}</text>
  <text font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" font-size="${subtitleFontSize}" font-weight="400" fill="${preset.subtitleColor}" y="${subtitleY}">${subtitleTspans}</text>
  <g transform="translate(${logoX} ${logoY}) scale(${logoScale})">${LOGO_SVG_CONTENT}</g>
</svg>`
}

/**
 * Generates a branded article thumbnail (1200×630 OG size), uploads it to the
 * `images` collection, and optionally sets it as the `image` of an article.
 *
 * Intended to be invoked by the content agent to speed up article creation.
 */
export async function generateThumbnail(req: PayloadRequest) {
  if (!req.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  let body: GenerateThumbnailBody
  try {
    body = (await req.json?.()) as GenerateThumbnailBody
  } catch {
    return new Response('Invalid JSON body', { status: 400 })
  }

  const title = typeof body?.title === 'string' ? body.title.trim() : ''
  const subtitle = typeof body?.subtitle === 'string' ? body.subtitle.trim() : ''
  if (!title) return new Response('`title` is required', { status: 400 })
  if (!subtitle) return new Response('`subtitle` is required', { status: 400 })

  const format: 'png' | 'webp' = body.format === 'png' ? 'png' : 'webp'
  const useNoise = body.background?.noise !== false
  const preset = resolvePreset(body.background)

  const svg = buildThumbnailSvg({ preset, subtitle, title, useNoise })

  let buffer: Buffer
  try {
    const pipeline = sharp(Buffer.from(svg))
    buffer =
      format === 'png'
        ? await pipeline.png({ compressionLevel: 9 }).toBuffer()
        : await pipeline.webp({ quality: 92 }).toBuffer()
  } catch (error) {
    req.payload.logger.error({ err: error, msg: 'Failed to render thumbnail SVG' })
    return new Response('Failed to render thumbnail', { status: 500 })
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
  const filename = `thumbnail-${slug || 'article'}-${Date.now()}.${format}`

  const image = await req.payload.create({
    collection: 'images',
    data: { alt: `${title} — ${subtitle}` },
    file: {
      data: buffer,
      mimetype: format === 'png' ? 'image/png' : 'image/webp',
      name: filename,
      size: buffer.length,
    },
    req,
  })

  if (body.articleId) {
    try {
      await req.payload.update({
        collection: 'articles',
        data: { image: image.id },
        id: body.articleId,
        req,
      })
    } catch (error) {
      req.payload.logger.error({
        articleId: body.articleId,
        err: error,
        msg: 'Thumbnail was created but linking it to the article failed',
      })
      return new Response(
        JSON.stringify({
          error: 'Thumbnail was created but could not be linked to the article',
          image: { filename: image.filename, id: image.id, url: image.url },
        }),
        { headers: { 'Content-Type': 'application/json' }, status: 502 },
      )
    }
  }

  return new Response(
    JSON.stringify({
      filename: image.filename,
      id: image.id,
      linkedToArticle: body.articleId ?? null,
      url: image.url,
    }),
    { headers: { 'Content-Type': 'application/json' }, status: 201 },
  )
}
