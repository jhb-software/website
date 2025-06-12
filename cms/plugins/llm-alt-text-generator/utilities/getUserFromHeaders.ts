'use server'

import config from '@payload-config'
import { headers } from 'next/headers'
import { BasePayload, getPayload } from 'payload'

/** Gets the currently authenticated user from the request headers. */
export async function getUserFromHeaders({ payload }: { payload?: BasePayload }) {
  const headersList = await headers()

  if (!payload) {
    payload = await getPayload({ config: config })
  }

  const { user } = await payload.auth({ headers: headersList })

  return user
}
