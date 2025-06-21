'use server'

import { getUserFromHeaders } from '@/plugins/jhb-dashboard/utilities/getUserFromHeaders'
import {
  VercelApiClient,
  VercelDeployment,
} from '@/plugins/jhb-dashboard/utilities/vercelApiClient'

export type DeploymentInfo = {
  id: string
  status: VercelDeployment['status']
}

/**
 * Fetches information about the deployment with the given id.
 * @param {string} id - The id of the deployment to fetch.
 * @returns {Promise<DeploymentInfo>} An object containing the deployment information.
 */
export const getFrontendDeploymentInfo = async (id: string): Promise<DeploymentInfo> => {
  const user = await getUserFromHeaders()
  if (!user) {
    throw new Error('No user found. This action is only available to logged in users.')
  }

  const vercelClient = new VercelApiClient(process.env.VERCEL_API_TOKEN!)

  const deployment = await vercelClient.getDeployment({
    idOrUrl: id,
    teamId: process.env.FRONTEND_VERCEL_TEAM_ID,
  })

  // to improve latency and improve security, only sent the data that is needed
  return {
    id: deployment.id,
    status: deployment.status,
  }
}
