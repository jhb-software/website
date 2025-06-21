'use server'

import config from '@payload-config'
import { headers } from 'next/headers'
import { getPayload, Payload } from 'payload'

/** Gets the currently authenticated user from the request headers. */
export async function getUserFromHeaders() {
  const headersList = await headers()

  const payload: Payload = await getPayload({ config: config })
  const { user } = await payload.auth({ headers: headersList })

  return user
}
