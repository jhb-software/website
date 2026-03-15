/**
 * Post-build script: converts every HTML page in the Vercel static output to a
 * Markdown file (.md) at the same path so that edge middleware can serve it
 * when the client sends `Accept: text/markdown`.
 *
 * Run automatically as part of `pnpm build`:
 *   astro build && node scripts/html-to-markdown.mjs
 */

import { existsSync, readFileSync, writeFileSync } from 'fs'
import { readdir } from 'fs/promises'
import { join, relative, resolve } from 'path'
import { fileURLToPath } from 'url'
import { parse } from 'node-html-parser'
import TurndownService from 'turndown'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const STATIC_DIR = resolve(__dirname, '../.vercel/output/static')

// Error / system pages to skip
const SKIP_FILES = new Set(['404.html', '500.html'])

function escapeYaml(str) {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

/** Recursively collect all .html file paths under `dir`. */
async function findHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
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

const td = new TurndownService({
  headingStyle: 'atx',
  hr: '---',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
})

// Remove non-content elements that pollute the Markdown output
td.remove(['script', 'style', 'nav', 'aside', 'header', 'footer'])

async function main() {
  if (!existsSync(STATIC_DIR)) {
    console.error(`Static output directory not found: ${STATIC_DIR}`)
    process.exit(1)
  }

  const htmlFiles = await findHtmlFiles(STATIC_DIR)
  let count = 0

  for (const htmlPath of htmlFiles) {
    const html = readFileSync(htmlPath, 'utf-8')
    const root = parse(html)

    const main = root.querySelector('main')
    if (!main) {
      const rel = relative(STATIC_DIR, htmlPath)
      console.log(`Skipping ${rel} (no <main> element)`)
      continue
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

    const mdPath = htmlPath.replace(/\.html$/, '.md')
    writeFileSync(mdPath, markdown, 'utf-8')
    count++
  }

  console.log(`Generated ${count} .md file(s) in ${relative(process.cwd(), STATIC_DIR)}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
