'use client'
import { useDashboardTranslation } from '@/plugins/jhb-dashboard/react-hooks/useDashboardTranslation'
import { getFrontendDeploymentInfo } from '@/plugins/jhb-dashboard/server-actions/getFrontendDeploymentInfo'
import { triggerFrontendDeployment } from '@/plugins/jhb-dashboard/server-actions/triggerFrontendDeployment'
import { VercelDeployment } from '@/plugins/jhb-dashboard/utilities/vercelApiClient'
import { Button, toast } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import React, { useTransition } from 'react'
import { RefreshIcon } from '../../icons/refresh'
import { SpinnerIcon } from '../../icons/spinner'

export const TriggerFrontendDeploymentButton: React.FC = () => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { t } = useDashboardTranslation()

  const handleClick = () => {
    startTransition(async () => {
      try {
        const deploymentId = await triggerFrontendDeployment()
        toast.success(t('jhb-dashboard:deploymentInfoDeploymentTriggeredSuccessfully'))

        // refresh the page so that the deployment info card re-fetches the latest deployment info
        router.refresh()

        startPolling(deploymentId)
      } catch (error) {
        toast.error(t('jhb-dashboard:deploymentInfoDeploymentTriggeredFailed'))
        console.error('Failed to trigger website rebuild', error)
      }
    })
  }

  const startPolling = (deploymentId: string) => {
    const pollInterval = 5000 // 5 seconds

    let lastStatus: VercelDeployment['status']

    const interval = setInterval(() => {
      getFrontendDeploymentInfo(deploymentId).then((deployment) => {
        if (deployment.status !== lastStatus) {
          lastStatus = deployment.status

          // refresh the page so that the deployment info card re-fetches the latest deployment info
          router.refresh()
        }

        if (deployment.status === 'READY') {
          clearInterval(interval)
          toast.success(t('jhb-dashboard:deploymentInfoDeploymentCompletedSuccessfully'))
        } else if (deployment.status === 'ERROR' || deployment.status === 'CANCELED') {
          clearInterval(interval)
          toast.error(t('jhb-dashboard:deploymentInfoDeploymentTriggeredFailed'))
        }
      })
    }, pollInterval)
  }

  return (
    <div>
      <Button type="button" buttonStyle="pill" onClick={handleClick} className="my-0!">
        <span className="flex items-center gap-4">
          {t('jhb-dashboard:deploymentInfoTriggerRebuild')}
          {isPending ? <SpinnerIcon /> : <RefreshIcon />}
        </span>
      </Button>
    </div>
  )
}
