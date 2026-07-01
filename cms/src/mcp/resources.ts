import { readdir, readFile } from 'fs/promises'
import { join } from 'path'

// Markdown resources (e.g. the writing style guide) live as plain `.md` files in
// `cms/resources/` so they stay versioned and browsable in Git. They are read at
// runtime and exposed through the `getResources` MCP tool.
//
// `process.cwd()` is the cms project root both locally and in the Vercel serverless
// function. The files are not statically reachable (we scan the directory at runtime),
// so they are force-included into the function bundle via `outputFileTracingIncludes`
// in `next.config.ts` — keep that entry in sync with this directory.
const RESOURCES_DIR = join(process.cwd(), 'resources')

// Only simple, lowercase-kebab slugs are valid. Enforced before building a file path
// to prevent path traversal, since the slug originates from an MCP tool argument.
const SLUG_PATTERN = /^[a-z0-9-]+$/

export type ResourceMeta = {
  slug: string
  title: string
  description: string
}

export type Resource = ResourceMeta & {
  content: string
}

/**
 * Minimal YAML front matter parser. Handles the simple `key: value` scalars we use
 * (`title`, `description`) — not nested structures. Returns the parsed key/value map
 * and the markdown body with the front matter block stripped.
 */
function parseFrontMatter(raw: string): { data: Record<string, string>; body: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw)
  if (!match) return { body: raw, data: {} }

  const data: Record<string, string> = {}
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(':')
    if (separator === -1) continue
    const key = line.slice(0, separator).trim()
    if (!key) continue
    // Strip surrounding single/double quotes from the value.
    const value = line
      .slice(separator + 1)
      .trim()
      .replace(/^['"]|['"]$/g, '')
    data[key] = value
  }

  return { body: raw.slice(match[0].length), data }
}

function toMeta(slug: string, data: Record<string, string>): ResourceMeta {
  return {
    description: data.description ?? '',
    slug,
    title: data.title ?? slug,
  }
}

/** Lists all available resources with their front matter metadata. */
export async function listResources(): Promise<ResourceMeta[]> {
  let entries: string[]
  try {
    entries = await readdir(RESOURCES_DIR)
  } catch {
    return []
  }

  const slugs = entries.filter((name) => name.endsWith('.md')).map((name) => name.slice(0, -3))

  const resources = await Promise.all(
    slugs.map(async (slug) => {
      const raw = await readFile(join(RESOURCES_DIR, `${slug}.md`), 'utf-8')
      return toMeta(slug, parseFrontMatter(raw).data)
    }),
  )

  return resources.sort((a, b) => a.slug.localeCompare(b.slug))
}

/**
 * Reads a single resource by slug, returning its metadata and markdown body (front
 * matter stripped). Returns `null` for an invalid or unknown slug.
 */
export async function readResource(slug: string): Promise<Resource | null> {
  if (!SLUG_PATTERN.test(slug)) return null

  let raw: string
  try {
    raw = await readFile(join(RESOURCES_DIR, `${slug}.md`), 'utf-8')
  } catch {
    return null
  }

  const { body, data } = parseFrontMatter(raw)
  return { ...toMeta(slug, data), content: body.trim() }
}
