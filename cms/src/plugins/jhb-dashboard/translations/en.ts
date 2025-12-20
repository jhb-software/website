import { GenericTranslationsObject } from './index.js'

export const en: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'jhb-dashboard': {
    // General
    website: 'Website',

    // Deployment Info Feature
    deploymentInfoActiveDeployment: 'Active Deployment',
    deploymentInfoDeploymentCompletedSuccessfully: 'New deployment completed successfully',
    deploymentInfoDeploymentTriggeredFailed: 'Failed to trigger new deployment',
    deploymentInfoDeploymentTriggeredSuccessfully: 'New deployment triggered successfully',
    deploymentInfoDescription:
      'Since the website is static for performance reasons, a new deployment must be created when content changes in the CMS, rebuilding the website with the latest published content from the CMS. The build process usually takes 1-2 minutes.',
    deploymentInfoInspectDeployment: 'Inspect Deployment',
    deploymentInfoLatestDeployment: 'Latest Deployment',
    deploymentInfoTitle: 'Website Deployments',
    deploymentInfoTriggerRebuild: 'Trigger New Deployment',

    // Vercel Deployment Status
    vercelDeploymentStatusBuilding: 'Building',
    vercelDeploymentStatusCanceled: 'Canceled',
    vercelDeploymentStatusDeleted: 'Deleted',
    vercelDeploymentStatusError: 'Error',
    vercelDeploymentStatusFailed: 'Failed',
    vercelDeploymentStatusInitializing: 'Initializing',
    vercelDeploymentStatusQueued: 'Queued',
    vercelDeploymentStatusReady: 'Ready',
    vercelDeploymentStatusUnknown: 'Unknown Status',
  },
}
