import crypto from 'crypto'

import type { MCPAccessSettings } from '@payloadcms/plugin-mcp'
import { type PayloadRequest, type TypedUser, UnauthorizedError } from 'payload'

/**
 * Replicates the MCP plugin's default API-key authentication and additionally
 * sets req.user so that custom MCP tool handlers can call payload.find() with
 * overrideAccess: false and still pass collection access control checks.
 */
export async function mcpOverrideAuth(
  req: PayloadRequest,
  getDefaultMcpAccessSettings: () => Promise<MCPAccessSettings>,
): Promise<MCPAccessSettings> {
  const mcpAccessSettings = await getDefaultMcpAccessSettings()

  const apiKey = req.headers.get('Authorization')?.replace('Bearer ', '').trim()
  if (!apiKey) throw new UnauthorizedError()

  const hash = crypto.createHmac('sha256', req.payload.secret).update(apiKey).digest('hex')

  const { docs } = await req.payload.find({
    collection: 'payload-mcp-api-keys',
    depth: 1,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    req,
    where: { apiKeyIndex: { equals: hash } },
  })

  const user = docs[0]?.user as TypedUser | undefined
  if (!user) throw new UnauthorizedError()

  user.collection = 'users'
  ;(user as TypedUser & { _strategy?: string })._strategy = 'mcp-api-key'

  req.user = user

  return mcpAccessSettings
}
