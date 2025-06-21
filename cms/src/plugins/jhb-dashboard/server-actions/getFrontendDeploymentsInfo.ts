'use server'

import { getUserFromHeaders } from '@/plugins/jhb-dashboard/utilities/getUserFromHeaders'
import {
  VercelApiClient,
  VercelDeployment,
} from '@/plugins/jhb-dashboard/utilities/vercelApiClient'
import { unstable_cache } from 'next/cache'

export type DeploymentsInfo = {
  lastReadyDeployment:
    | {
        uid: string
        status: 'READY'
        readyAt: Date
        inspectorUrl: string | null
      }
    | undefined

  latestDeployment:
    | {
        uid: string
        status: VercelDeployment['status']
        createdAt: Date
        inspectorUrl: string | null
      }
    | undefined
}

/**
 * Fetches the latest deployment information from Vercel.
 * @returns {Promise<DeploymentsInfo>} An object containing the latest deployment information.
 */
export async function getFrontendDeploymentsInfo(): Promise<DeploymentsInfo> {
  const user = await getUserFromHeaders()
  if (!user) {
    throw new Error('No user found. This action is only available to logged in users.')
  }

  return getFrontendDeploymentsInfoCached()
}

const getFrontendDeploymentsInfoCached = unstable_cache(
  async () => {
    const vercelClient = new VercelApiClient(process.env.VERCEL_API_TOKEN!)

    const deploymentsResponse = await vercelClient.getDeployments({
      projectId: process.env.FRONTEND_VERCEL_PROJECT_ID!,
      teamId: process.env.FRONTEND_VERCEL_TEAM_ID!,
      target: 'production', // exclude preview deployments
      limit: 10,
    })

    const lastReadyDeployment = deploymentsResponse.deployments.find(
      (deployment) => deployment.state === 'READY',
    )
    const latestDeployment = deploymentsResponse.deployments.at(0)

    const deploymentsInfo: DeploymentsInfo = {
      lastReadyDeployment: lastReadyDeployment
        ? {
            uid: lastReadyDeployment.uid,
            readyAt: new Date(
              typeof lastReadyDeployment.ready === 'number'
                ? lastReadyDeployment.ready
                : lastReadyDeployment.created,
            ),
            status: 'READY',
            inspectorUrl: lastReadyDeployment.inspectorUrl,
          }
        : undefined,
      latestDeployment:
        latestDeployment && latestDeployment.state
          ? {
              uid: latestDeployment.uid,
              status: latestDeployment.state,
              createdAt: new Date(latestDeployment.created),
              inspectorUrl: latestDeployment.inspectorUrl,
            }
          : undefined,
    }

    return deploymentsInfo
  },
  undefined,
  {
    tags: ['frontend-deployments'],
    revalidate: 60,
  },
)
