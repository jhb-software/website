/** The MCP tool result shape expected by `@payloadcms/plugin-mcp`. */
export type ToolResult = { content: { type: 'text'; text: string }[] }

/** Wrap a value as an MCP text result containing JSON. */
export const jsonResult = (data: unknown): ToolResult => ({
  content: [{ text: JSON.stringify(data), type: 'text' as const }],
})

/** Wrap an error as an MCP text result. */
export const errorResult = (message: string, err?: unknown): ToolResult =>
  jsonResult({
    error: message,
    ...(err ? { details: err instanceof Error ? err.message : String(err) } : {}),
  })

const GLOBAL_PREFIX = 'globals/'

/** A collection slug, or a global addressed as `globals/<slug>`. */
export const parseTarget = (
  target: string,
): { type: 'collection'; slug: string } | { type: 'global'; slug: string } =>
  target.startsWith(GLOBAL_PREFIX)
    ? { slug: target.slice(GLOBAL_PREFIX.length), type: 'global' }
    : { slug: target, type: 'collection' }
