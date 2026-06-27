import type { AstroIntegration } from 'astro'
import { existsSync } from 'fs'
import { readFile, readdir, writeFile } from 'fs/promises'
import { parse } from 'node-html-parser'
import { basename, dirname, join, relative } from 'path'
import TurndownService from 'turndown'
import { fileURLToPath } from 'url'

// Error / system pages to skip
const SKIP_FILES = new Set(['404.html', '500.html'])

function escapeYaml(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
}

/** Recursively collect all .html file paths under `dir`. */
async function findHtmlFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const files: string[] = []
  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await findHtmlFiles(fullPath)))
    } else if (entry.name.endsWith('.html') && !SKIP_FILES.has(entry.name)) {
      files.push(fullPath)
    }
  }
  return files
}

/**
 * Converts every HTML page in a directory to a Markdown file (.md) at the same
 * path, so that the Vercel middleware can serve it when the client sends
 * `Accept: text/markdown`.
 */
export async function convertHtmlToMarkdown(staticDir: string) {
  const td = new TurndownService({
    headingStyle: 'atx',
    hr: '---',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
  })

  // Remove non-content elements that pollute the Markdown output
  td.remove(['script', 'style', 'nav', 'aside', 'header', 'footer'])

  // Card components (services, projects, articles) wrap block-level content
  // (heading + description) in a single <a>. Turndown's default link rule only
  // handles inline content, so it emits a stray "[" before the block and a
  // dangling "](href)" after it. Instead, link the card's first heading and
  // keep the remaining content as normal blocks.
  td.addRule('blockLink', {
    filter: (node) =>
      node.nodeName === 'A' &&
      !!node.getAttribute('href') &&
      // Only block-wrapping anchors — plain inline links fall through to the
      // default rule.
      !!node.querySelector?.('h1, h2, h3, h4, h5, h6, p, div, ul, ol, blockquote'),
    replacement: (content, node) => {
      const href = (node as HTMLElement).getAttribute('href') ?? ''
      const trimmed = content.trim()
      if (!trimmed) return ''

      const headingRe = /^(#{1,6} +)(.+)$/m
      if (headingRe.test(trimmed)) {
        return (
          '\n\n' +
          trimmed.replace(headingRe, (_, hashes, text) => `${hashes}[${text.trim()}](${href})`) +
          '\n\n'
        )
      }

      // No heading inside the card — link the collapsed text as a fallback.
      return `\n\n[${trimmed.replace(/\s+/g, ' ')}](${href})\n\n`
    },
  })

  if (!existsSync(staticDir)) {
    console.warn(`[html-to-markdown] Output directory not found: ${staticDir}`)
    return
  }

  const htmlFiles = await findHtmlFiles(staticDir)
  let count = 0

  for (const htmlPath of htmlFiles) {
    const html = await readFile(htmlPath, 'utf-8')
    const root = parse(html)

    const main = root.querySelector('main')
    if (!main) {
      console.log(`[html-to-markdown] Skipping ${relative(staticDir, htmlPath)} (no <main>)`)
      continue
    }

    // Strip elements that should never appear in the Markdown representation:
    // - `.md-exclude`: explicit opt-out for UI-only affordances (e.g. the
    //   testimonials "show more" button).
    // - `[aria-hidden="true"]`: decorative/duplicate content already hidden
    //   from assistive tech — marquee logo duplicates, schematic SVG visuals,
    //   icons and eyebrow glyphs. The same reasoning applies to Markdown.
    for (const el of main.querySelectorAll('.md-exclude, [aria-hidden="true"]')) {
      el.remove()
    }

    const title = root.querySelector('title')?.text?.trim() ?? ''
    const description =
      root.querySelector('meta[name="description"]')?.getAttribute('content') ?? ''

    const frontmatterParts = ['---']
    if (title) frontmatterParts.push(`title: "${escapeYaml(title)}"`)
    if (description) frontmatterParts.push(`description: "${escapeYaml(description)}"`)
    frontmatterParts.push('---', '', '')

    const content = td.turndown(main.innerHTML)
    const markdown = frontmatterParts.join('\n') + content

    // For index.html files, place the .md file in the parent directory
    // e.g., /de/index.html → /de.md (matching the middleware rewrite path)
    // For non-index files, replace the extension in place
    let mdPath: string
    if (basename(htmlPath) === 'index.html') {
      const parentDir = dirname(htmlPath)
      const parentParentDir = dirname(parentDir)
      const dirName = basename(parentDir)
      mdPath = join(parentParentDir, `${dirName}.md`)
    } else {
      mdPath = htmlPath.replace(/\.html$/, '.md')
    }
    await writeFile(mdPath, markdown, 'utf-8')
    count++
  }

  console.log(`[html-to-markdown] Generated ${count} .md file(s)`)
}

/**
 * Astro integration that converts HTML pages to Markdown after build.
 *
 * Writes .md files to both the Astro output directory (dir) and the Vercel
 * static output directory (.vercel/output/static/) if it exists, since the
 * Vercel adapter copies files before this hook runs and won't include .md
 * files written only to the Astro output dir.
 */
export function htmlToMarkdown(): AstroIntegration {
  return {
    name: 'html-to-markdown',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const astroDir = fileURLToPath(dir)

        // Always process the Astro output directory
        await convertHtmlToMarkdown(astroDir)

        // Also process the Vercel output directory if it exists,
        // since the Vercel adapter may have already copied files there
        const vercelStaticDir = join(process.cwd(), '.vercel', 'output', 'static')
        if (existsSync(vercelStaticDir) && vercelStaticDir !== astroDir) {
          logger.info(`Also generating .md files in Vercel output: ${vercelStaticDir}`)
          await convertHtmlToMarkdown(vercelStaticDir)
        }
      },
    },
  }
}
