import type { PayloadRequest } from 'payload'

import { Resvg } from '@resvg/resvg-js'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import sharp from 'sharp'

type Theme = 'dark' | 'light'

type GenerateThumbnailBody = {
  /** If provided, the new image is set as the article's thumbnail. */
  articleId?: string
  /** Mono eyebrow label rendered above the title. Defaults to `ARTICLE`. */
  eyebrow?: string
  /**
   * Custom filename (without extension). Sanitized to `[a-z0-9-]` and clamped
   * to 60 chars. If omitted, the filename is derived from `title`.
   */
  filename?: string
  /** Output format. Defaults to `webp`. */
  format?: 'png' | 'webp'
  subtitle: string
  /**
   * Surface theme.
   * - `light` (default): canvas surface, primary title, neutral-muted subtitle.
   * - `dark`: primary-deep surface, surface title, primary-soft subtitle.
   */
  theme?: Theme
  title: string
}

type ThemePalette = {
  background: string
  border: string
  cornerMark: string
  eyebrow: string
  eyebrowBackslash: string
  subtitle: string
  title: string
}

// Token names per /web/design.md — values can shift without renaming.
const PALETTES: Record<Theme, ThemePalette> = {
  dark: {
    background: '#050e1f', // primary-deep
    border: 'rgba(255,255,255,0.20)', // hairline on dark surface (matches Footer)
    cornerMark: '#0f766e', // tertiary
    eyebrow: '#a8d4c8', // tertiary-soft (legible mono on primary-deep)
    eyebrowBackslash: '#0f766e', // tertiary
    subtitle: '#e8eef7', // primary-soft
    title: '#ffffff', // surface
  },
  light: {
    background: '#ffffff', // surface
    border: '#d4d4d4', // border-strong
    cornerMark: '#0f766e', // tertiary
    eyebrow: '#737373', // neutral-subtle
    eyebrowBackslash: '#0f766e', // tertiary
    subtitle: '#404040', // neutral-muted
    title: '#0a2540', // primary
  },
}

const WIDTH = 1920
const HEIGHT = 1080
const FRAME_INSET = 64
const CONTENT_PADDING = 80

// JHB brand mark — see /web/public/icon.svg. Solid primary square with white
// JHB lettering. Inlined so the endpoint stays self-contained.
const LOGO_INNER = `
  <rect width="96" height="96" fill="#0a2540"/>
  <path transform="translate(8.14 62.2) scale(0.04 -0.04)" fill="#ffffff" d="M314.59967041015625 -16.0Q226.20001220703125 -16.0 166.00015258789062 19.899932861328125Q105.80029296875 55.79986572265625 74.90032958984375 118.19976806640625Q44.0003662109375 180.59967041015625 43.0003662109375 259.99957275390625L217.3990478515625 267.59954833984375Q219.19903564453125 193.59942626953125 244.39920043945312 159.999267578125Q269.599365234375 126.39910888671875 314.59967041015625 126.39910888671875Q359.4000244140625 126.39910888671875 384.7001953125 157.79934692382812Q410.0003662109375 189.1995849609375 410.0003662109375 257.599853515625V710.0H583.9990234375V257.599853515625Q583.9990234375 174.19989013671875 549.9991149902344 112.69992065429688Q515.9992065429688 51.199951171875 455.4993591308594 17.5999755859375Q394.99951171875 -16.0 314.59967041015625 -16.0Z M667.5003662109375 0.0V710.0H841.4990234375V376.1998291015625L766.2994995117188 428.59954833984375H1156.9003295898438L1081.7008056640625 376.1998291015625V710.0H1255.699462890625V0.0H1081.7008056640625V337.8001708984375L1156.9003295898438 286.200439453125H766.2994995117188L841.4990234375 337.8001708984375V0.0Z M1354.0003662109375 0.0V710.0H1641.19970703125Q1775.1995849609375 710.0 1847.3994445800781 663.6000061035156Q1919.5993041992188 617.2000122070312 1919.5993041992188 516.6000366210938Q1919.5993041992188 473.0 1902.3992614746094 441.199951171875Q1885.19921875 409.39990234375 1851.399169921875 390.69989013671875Q1817.59912109375 371.9998779296875 1768.9990844726562 367.199951171875L1768.799072265625 366.800048828125Q1858.1990966796875 359.60015869140625 1903.8992004394531 315.10009765625Q1949.5993041992188 270.60003662109375 1949.5993041992188 195.79998779296875Q1949.5993041992188 96.4000244140625 1877.7994384765625 48.20001220703125Q1805.9995727539062 0.0 1673.1998291015625 0.0ZM1527.9990234375 136.7991943359375H1662.7999877929688Q1711.8003540039062 136.7991943359375 1743.3004760742188 156.79934692382812Q1774.8005981445312 176.79949951171875 1774.8005981445312 218.39971923828125Q1774.8005981445312 259.99993896484375 1743.7004699707031 280.7001037597656Q1712.600341796875 301.4002685546875 1662.7999877929688 301.4002685546875H1527.9990234375ZM1527.9990234375 420.5997314453125H1634.7998046875Q1684.000244140625 420.5997314453125 1714.4004211425781 439.69989013671875Q1744.8005981445312 458.800048828125 1744.8005981445312 496.60028076171875Q1744.8005981445312 536.6005249023438 1715.1004333496094 554.9006652832031Q1685.4002685546875 573.2008056640625 1634.7998046875 573.2008056640625H1527.9990234375Z"/>
`

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
  const allLines: string[] = []
  let current = ''
  for (const word of words) {
    const trial = current ? `${current} ${word}` : word
    if (trial.length > maxCharsPerLine && current) {
      allLines.push(current)
      current = word
    } else {
      current = trial
    }
  }
  if (current) allLines.push(current)

  if (allLines.length <= maxLines) return allLines

  // Title is longer than maxLines — keep the first (maxLines - 1) lines and
  // fit as many of the remaining words as possible on the last line, followed
  // by an ellipsis.
  const result = allLines.slice(0, maxLines - 1)
  const remainingWords = allLines
    .slice(maxLines - 1)
    .join(' ')
    .split(/\s+/)
  const ellipsisBudget = 1 // leave room for the trailing "…"
  let last = ''
  for (const word of remainingWords) {
    const trial = last ? `${last} ${word}` : word
    if (trial.length + ellipsisBudget > maxCharsPerLine && last) break
    last = trial
  }
  result.push(`${last.replace(/[.,;:!?]+$/, '')}…`)
  return result
}

// Geist Sans 400/600 + Geist Mono 500 from Google Fonts. resvg only loads
// static TTFs (not woff2 / variable fonts), so we fetch them on demand and
// cache them in /tmp — on Vercel /tmp persists across invocations within the
// same function instance, so this cost is paid once per cold start.
//
// To refresh the URLs (Google re-versions the CSS API periodically):
//   curl -sA 'Mozilla/4.0' 'https://fonts.googleapis.com/css?family=Geist:400,600|Geist+Mono:500'
const FONT_URLS: Record<string, string> = {
  'geist-400': 'https://fonts.gstatic.com/s/geist/v4/gyBhhwUxId8gMGYQMKR3pzfaWI_RnOMImpnf.ttf',
  'geist-600': 'https://fonts.gstatic.com/s/geist/v4/gyBhhwUxId8gMGYQMKR3pzfaWI_RQuQImpnf.ttf',
  'geistmono-500':
    'https://fonts.gstatic.com/s/geistmono/v4/or3yQ6H-1_WfwkMZI_qYPLs1a-t7PU0AbeEPKK5U5Cw.ttf',
}

const FONT_CACHE_DIR = join(tmpdir(), 'jhb-thumbnail-fonts')
let fontPathsPromise: null | Promise<string[]> = null

async function ensureFonts(): Promise<string[]> {
  if (fontPathsPromise) return fontPathsPromise
  fontPathsPromise = (async () => {
    if (!existsSync(FONT_CACHE_DIR)) mkdirSync(FONT_CACHE_DIR, { recursive: true })
    const paths: string[] = []
    for (const [name, url] of Object.entries(FONT_URLS)) {
      const p = join(FONT_CACHE_DIR, `${name}.ttf`)
      if (!existsSync(p)) {
        const res = await fetch(url, { signal: AbortSignal.timeout(10_000) })
        if (!res.ok) throw new Error(`Font ${name} fetch failed: ${res.status}`)
        writeFileSync(p, Buffer.from(await res.arrayBuffer()))
      }
      paths.push(p)
    }
    return paths
  })().catch((err) => {
    // Allow the next request to retry after a transient fetch failure.
    fontPathsPromise = null
    throw err
  })
  return fontPathsPromise
}

function buildThumbnailSvg({
  eyebrow,
  palette,
  subtitle,
  title,
}: {
  eyebrow: string
  palette: ThemePalette
  subtitle: string
  title: string
}): string {
  const titleLines = wrapText(title, 26, 3)
  const subtitleLines = wrapText(subtitle, 72, 2)

  const titleFontSize = titleLines.length > 2 ? 96 : 116
  const titleLineHeight = Math.round(titleFontSize * 1.05)
  const subtitleFontSize = 44
  const subtitleLineHeight = Math.round(subtitleFontSize * 1.4)
  const eyebrowFontSize = 28

  // Hairline frame inset from the image edges, with corner registration marks
  // at each frame corner — mirrors <SectionFrame> + <CornerMark> on the site.
  const frameX = FRAME_INSET
  const frameY = FRAME_INSET
  const frameW = WIDTH - FRAME_INSET * 2
  const frameH = HEIGHT - FRAME_INSET * 2
  const contentX = frameX + CONTENT_PADDING

  // Eyebrow sits at the top of the content area; logo anchors the bottom; the
  // title/subtitle stack hangs from the eyebrow with generous breathing room.
  const eyebrowBaseline = frameY + CONTENT_PADDING + eyebrowFontSize * 0.85
  const titleFirstBaseline = eyebrowBaseline + eyebrowFontSize * 1.6 + titleFontSize * 0.85
  const titleLastBaseline = titleFirstBaseline + (titleLines.length - 1) * titleLineHeight
  const subtitleFirstBaseline = titleLastBaseline + subtitleFontSize * 0.6 + titleFontSize * 0.4

  const logoSize = 96
  const logoY = frameY + frameH - CONTENT_PADDING - logoSize
  const logoX = contentX
  const logoScale = logoSize / 96

  const titleTspans = titleLines
    .map(
      (line, i) =>
        `<tspan x="${contentX}" dy="${i === 0 ? 0 : titleLineHeight}">${escapeXml(line)}</tspan>`,
    )
    .join('')

  const subtitleTspans = subtitleLines
    .map(
      (line, i) =>
        `<tspan x="${contentX}" dy="${i === 0 ? 0 : subtitleLineHeight}">${escapeXml(line)}</tspan>`,
    )
    .join('')

  const eyebrowGap = Math.round(eyebrowFontSize * 0.55)

  // The `\` thread (design.md §the-`\`-thread): leading backslash always
  // tertiary + mono, label in neutral-subtle / primary-soft mono uppercase.
  const eyebrowSvg = `<text x="${contentX}" y="${eyebrowBaseline}" font-family="Geist Mono" font-weight="500" font-size="${eyebrowFontSize}" letter-spacing="0.12em"><tspan fill="${palette.eyebrowBackslash}">\\</tspan><tspan fill="${palette.eyebrow}" dx="${eyebrowGap}">${escapeXml(eyebrow.toUpperCase())}</tspan></text>`

  const cornerMarkSize = 32
  const cornerMarkStroke = 1.5
  const cornerCoords: [number, number][] = [
    [frameX, frameY],
    [frameX + frameW, frameY],
    [frameX, frameY + frameH],
    [frameX + frameW, frameY + frameH],
  ]
  const cornerMarks = cornerCoords
    .map(
      ([cx, cy]) =>
        `<g stroke="${palette.cornerMark}" stroke-width="${cornerMarkStroke}"><line x1="${cx - cornerMarkSize / 2}" y1="${cy}" x2="${cx + cornerMarkSize / 2}" y2="${cy}"/><line x1="${cx}" y1="${cy - cornerMarkSize / 2}" x2="${cx}" y2="${cy + cornerMarkSize / 2}"/></g>`,
    )
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${palette.background}"/>
  <rect x="${frameX}" y="${frameY}" width="${frameW}" height="${frameH}" fill="none" stroke="${palette.border}" stroke-width="1"/>
  ${cornerMarks}
  ${eyebrowSvg}
  <text font-family="Geist" font-size="${titleFontSize}" font-weight="600" fill="${palette.title}" y="${titleFirstBaseline}" letter-spacing="-0.025em">${titleTspans}</text>
  <text font-family="Geist" font-size="${subtitleFontSize}" font-weight="400" fill="${palette.subtitle}" y="${subtitleFirstBaseline}">${subtitleTspans}</text>
  <g transform="translate(${logoX} ${logoY}) scale(${logoScale})">${LOGO_INNER}</g>
</svg>`
}

/**
 * Generates a branded article thumbnail (1920×1080 16:9 HD) in the JHB
 * corporate design — hairline frame, tertiary corner marks, mono `\ EYEBROW`,
 * Geist title/subtitle, JHB mark anchored bottom-left. Uploads to the `images`
 * collection and optionally sets it as the `image` of an article.
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
  const theme: Theme = body.theme === 'dark' ? 'dark' : 'light'
  const palette = PALETTES[theme]
  const eyebrow =
    typeof body.eyebrow === 'string' && body.eyebrow.trim() ? body.eyebrow.trim() : 'ARTICLE'

  // Resolve the target article before rendering so bad IDs fail fast with 404
  // and don't leave an orphan thumbnail behind. `_status` drives the draft-aware
  // update further down.
  let articleStatus: 'draft' | 'published' | undefined
  if (body.articleId) {
    try {
      const existing = await req.payload.findByID({
        collection: 'articles',
        depth: 0,
        draft: true,
        id: body.articleId,
        req,
        select: { _status: true },
      })
      articleStatus = existing._status ?? 'published'
    } catch (error) {
      req.payload.logger.warn({
        articleId: body.articleId,
        err: error,
        msg: 'Article lookup failed — treating as not found',
      })
      return new Response(`Article ${body.articleId} not found`, { status: 404 })
    }
  }

  const svg = buildThumbnailSvg({ eyebrow, palette, subtitle, title })

  let buffer: Buffer
  try {
    const fontPaths = await ensureFonts()
    const basePng = new Resvg(svg, {
      font: {
        defaultFontFamily: 'Geist',
        fontFiles: fontPaths,
        loadSystemFonts: false,
      },
    })
      .render()
      .asPng()
    const pipeline = sharp(basePng)
    buffer =
      format === 'png'
        ? await pipeline.png({ compressionLevel: 9 }).toBuffer()
        : await pipeline.webp({ quality: 95 }).toBuffer()
  } catch (error) {
    req.payload.logger.error({ err: error, msg: 'Failed to render thumbnail SVG' })
    return new Response('Failed to render thumbnail', { status: 500 })
  }

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60)
  const customName = typeof body.filename === 'string' ? slugify(body.filename) : ''
  const nameStem = customName || slugify(title) || 'article'
  const filename = `${nameStem}.${format}`

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
      // Match the article's current draft/published state (resolved above)
      // so we don't accidentally publish a pending draft.
      await req.payload.update({
        collection: 'articles',
        data: { image: image.id },
        draft: articleStatus === 'draft',
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
