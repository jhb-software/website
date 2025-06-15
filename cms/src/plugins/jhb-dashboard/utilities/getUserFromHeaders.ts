'use server'

import { getPayload } from 'payload'
import { headers } from 'next/headers'
import { Payload } from 'payload'
import config from '@payload-config'

/** Gets the currently authenticated user from the request headers. */
export async function getUserFromHeaders() {
  const headersList = await headers()

  const payload: Payload = await getPayload({ config: config })
  const { user } = await payload.auth({ headers: headersList })

  return user
}
