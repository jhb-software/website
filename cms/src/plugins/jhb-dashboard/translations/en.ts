import { GenericTranslationsObject } from './index.js'

export const en: GenericTranslationsObject = {
  $schema: './translation-schema.json',
  'jhb-dashboard': {
    // General
    website: 'Website',

    // Deployment Info Feature
    deploymentInfoTitle: 'Website Deployments',
    deploymentInfoDescription:
      'Since the website is static for performance reasons, a new deployment must be created when content changes in the CMS, rebuilding the website with the latest published content from the CMS. The build process usually takes 1-2 minutes.',
    deploymentInfoActiveDeployment: 'Active Deployment',
    deploymentInfoLatestDeployment: 'Latest Deployment',
    deploymentInfoTriggerRebuild: 'Trigger New Deployment',
    deploymentInfoInspectDeployment: 'Inspect Deployment',
    deploymentInfoDeploymentTriggeredSuccessfully: 'New deployment triggered successfully',
    deploymentInfoDeploymentTriggeredFailed: 'Failed to trigger new deployment',
    deploymentInfoDeploymentCompletedSuccessfully: 'New deployment completed successfully',

    // Vercel Deployment Status
    vercelDeploymentStatusBuilding: 'Building',
    vercelDeploymentStatusReady: 'Ready',
    vercelDeploymentStatusError: 'Error',
    vercelDeploymentStatusQueued: 'Queued',
    vercelDeploymentStatusInitializing: 'Initializing',
    vercelDeploymentStatusCanceled: 'Canceled',
    vercelDeploymentStatusDeleted: 'Deleted',
    vercelDeploymentStatusFailed: 'Failed',
    vercelDeploymentStatusUnknown: 'Unknown Status',
  },
}
