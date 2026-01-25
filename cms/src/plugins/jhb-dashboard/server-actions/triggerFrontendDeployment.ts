'use server'

import { revalidateTag } from 'next/cache'

import { getUserFromHeaders } from '@/plugins/jhb-dashboard/utilities/getUserFromHeaders'
import { VercelApiClient } from '@/plugins/jhb-dashboard/utilities/vercelApiClient'

/** Triggers a new production deployment of the frontend. */
export async function triggerFrontendDeployment(): Promise<string> {
  const user = await getUserFromHeaders()
  if (!user) {
    throw new Error('No user found. This action is only available to logged in users.')
  }

  const vercelClient = new VercelApiClient(process.env.VERCEL_API_TOKEN!)
  const projectDetails = await getProjectDetails(vercelClient)

  const deployment = await vercelClient.createDeployment({
    requestBody: {
      gitSource: projectDetails.gitSource,
      meta: {
        // Override to show the deployment was triggered by the CMS in the Vercel dashboard
        githubCommitAuthorLogin: 'cms-dashboard',
      },
      name: projectDetails.name,
      project: process.env.FRONTEND_VERCEL_PROJECT_ID!,
      projectSettings: {
        // IMPORTANT: Override the ignore build step so that a deployment is always triggered, even though there were no git changes
        commandForIgnoringBuildStep: 'exit 1',
      },
      target: 'production',
    },
    teamId: process.env.FRONTEND_VERCEL_TEAM_ID!,
  })

  revalidateTag('frontend-deployments', 'max')

  return deployment.id
}

/** Fetches details about the project which are needed to trigger a deployment from the Vercel API. */
async function getProjectDetails(vercelClient: VercelApiClient): Promise<{
  gitSource: {
    type: 'github'
    repo: string
    ref: string
    org: string
  }
  name: string
}> {
  const project = await vercelClient.getProject({
    projectId: process.env.FRONTEND_VERCEL_PROJECT_ID!,
    teamId: process.env.FRONTEND_VERCEL_TEAM_ID!,
  })

  if (!project) {
    throw new Error('Project not found')
  }

  if (!project.link || project.link.type !== 'github') {
    throw new Error('Project link not found')
  }

  if (!project.link?.productionBranch || !project.link?.repo || !project.link?.org) {
    throw new Error('Project link is missing required fields')
  }

  return {
    gitSource: {
      org: project.link.org,
      ref: project.link.productionBranch,
      repo: project.link.repo,
      type: 'github',
    },
    name: project.name,
  }
}
