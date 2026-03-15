import { existsSync } from 'fs'
import { readFile, readdir, writeFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { join, relative } from 'path'
import { parse } from 'node-html-parser'
import TurndownService from 'turndown'
import type { AstroIntegration } from 'astro'

// Error / system pages to skip
const SKIP_FILES = new Set(['404.html', '500.html'])

function escapeYaml(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
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

const td = new TurndownService({
  headingStyle: 'atx',
  hr: '---',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
})

// Remove non-content elements that pollute the Markdown output
td.remove(['script', 'style', 'nav', 'aside', 'header', 'footer'])

/**
 * Astro integration that converts every built HTML page to a Markdown file
 * (.md) at the same path, so that the edge middleware can serve it when the
 * client sends `Accept: text/markdown`.
 *
 * Runs in the `astro:build:done` hook, after all static HTML files have been
 * written to the output directory.
 */
export function htmlToMarkdown(): AstroIntegration {
  return {
    name: 'html-to-markdown',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const staticDir = fileURLToPath(dir)

        if (!existsSync(staticDir)) {
          logger.warn(`Output directory not found: ${staticDir}`)
          return
        }

        const htmlFiles = await findHtmlFiles(staticDir)
        let count = 0

        for (const htmlPath of htmlFiles) {
          const html = await readFile(htmlPath, 'utf-8')
          const root = parse(html)

          const main = root.querySelector('main')
          if (!main) {
            logger.info(`Skipping ${relative(staticDir, htmlPath)} (no <main> element)`)
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
          await writeFile(mdPath, markdown, 'utf-8')
          count++
        }

        logger.info(`Generated ${count} .md file(s)`)
      },
    },
  }
}
