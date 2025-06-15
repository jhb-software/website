'use server'

import { getUserFromHeaders } from '@/plugins/jhb-dashboard/utilities/getUserFromHeaders'
import { Vercel } from '@vercel/sdk'
import { revalidateTag } from 'next/cache'

const vercel = new Vercel({ bearerToken: process.env.VERCEL_API_TOKEN! })

/** Triggers a new production deployment of the frontend. */
export async function triggerFrontendDeployment(): Promise<string> {
  const user = await getUserFromHeaders()
  if (!user) {
    throw new Error('No user found. This action is only available to logged in users.')
  }

  const projectDetails = await getProjectDetails()

  const deployment = await vercel.deployments.createDeployment({
    teamId: process.env.FRONTEND_VERCEL_TEAM_ID!,
    requestBody: {
      project: process.env.FRONTEND_VERCEL_PROJECT_ID!,
      name: projectDetails.name,
      target: 'production',
      gitSource: projectDetails.gitSource,
      projectSettings: {
        // IMPORTANT: Override the ignore build step so that a deployment is always triggered, even though there were no git changes
        commandForIgnoringBuildStep: 'exit 1',
      },
      meta: {
        // Override to show the deployment was triggered by the CMS in the Vercel dashboard
        githubCommitAuthorLogin: 'cms-dashboard',
      },
    },
  })

  revalidateTag('frontend-deployments')

  return deployment.id
}

/** Fetches details about the project which are needed to trigger a deployment from the Vercel API. */
async function getProjectDetails(): Promise<{
  gitSource: {
    type: 'github'
    repo: string
    ref: string
    org: string
  }
  name: string
}> {
  // The sdk currently does not support getting a project by id, see https://github.com/vercel/sdk/issues/92
  // therefore, the REST API is used to get the project details.
  const projectResponse = await fetch(
    `https://api.vercel.com/v9/projects/${process.env.FRONTEND_VERCEL_PROJECT_ID!}?teamId=${process.env.FRONTEND_VERCEL_TEAM_ID!}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_API_TOKEN!}`,
      },
    },
  )

  const project = await projectResponse.json()

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
    name: project.name,
    gitSource: {
      type: 'github',
      repo: project.link.repo,
      ref: project.link.productionBranch,
      org: project.link.org,
    },
  }
}
