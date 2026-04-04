import type { CollectionBeforeChangeHook } from 'payload'

/**
 * Ensures that MCP API key requests can only create or update documents as drafts,
 * not as published versions.
 */
export const restrictMcpToDraft: CollectionBeforeChangeHook = ({ data, req }) => {
  if (req.user?.collection === 'payload-mcp-api-keys') {
    return { ...data, _status: 'draft' }
  }
  return data
}
