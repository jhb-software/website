import { FormattedDate } from '@/plugins/jhb-dashboard/components/FormattedDate'
import {
  DeploymentsInfo,
  getFrontendDeploymentsInfo,
} from '@/plugins/jhb-dashboard/server-actions/getFrontendDeploymentsInfo'
import type { JhbDashboardTranslationKeys } from '@/plugins/jhb-dashboard/translations'
import { I18nClient, TFunction } from '@payloadcms/translations'
import { Pill, PillProps } from '@payloadcms/ui/elements/Pill'
import { GetDeploymentsState } from '@vercel/sdk/models/getdeploymentsop.js'
import { Suspense } from 'react'
import { Card } from '../../Card'
import { ClockIcon } from '../../icons/clock'
import { ClockDashedIcon } from '../../icons/clock-dashed'
import InfoIcon from '../../icons/info'
import { SpinnerIcon } from '../../icons/spinner'
import { TriggerFrontendDeploymentButton } from './TriggerDeploymentButton'

export async function DeploymentInfoCard({ i18n }: { i18n: I18nClient }) {
  const t = i18n.t as TFunction<JhbDashboardTranslationKeys>

  return (
    <Card
      title={t('jhb-dashboard:deploymentInfoTitle')}
      icon={<InfoIcon />}
      actions={<TriggerFrontendDeploymentButton />}
    >
      <div className="flex flex-col gap-3">
        <Suspense fallback={<DeploymentInfoSkeleton />}>
          <DeploymentInfo i18n={i18n} />
        </Suspense>

        <p>{t('jhb-dashboard:deploymentInfoDescription')}</p>
      </div>
    </Card>
  )
}

export default async function DeploymentInfo({ i18n }: { i18n: I18nClient }) {
  const { lastReadyDeployment, latestDeployment } = await getFrontendDeploymentsInfo()
  const t = i18n.t as TFunction<JhbDashboardTranslationKeys>

  return (
    <div className="flex flex-col gap-2">
      <DeploymentInfoRow
        icon={<ClockIcon />}
        label={t('jhb-dashboard:deploymentInfoActiveDeployment')}
        deploymentInfo={lastReadyDeployment}
        i18n={i18n}
      />
      {latestDeployment && latestDeployment?.uid !== lastReadyDeployment?.uid && (
        <DeploymentInfoRow
          icon={<ClockDashedIcon />}
          label={t('jhb-dashboard:deploymentInfoLatestDeployment')}
          deploymentInfo={latestDeployment}
          i18n={i18n}
        />
      )}
    </div>
  )
}

function DeploymentInfoSkeleton() {
  return <div className="h-5 bg-[var(--theme-elevation-100)] rounded max-w-90 animate-pulse"></div>
}

function DeploymentInfoRow({
  icon,
  label,
  deploymentInfo,
  i18n,
}: {
  icon: React.ReactNode
  label: string
  deploymentInfo: DeploymentsInfo['latestDeployment'] | DeploymentsInfo['lastReadyDeployment']
  i18n: I18nClient
}) {
  const t = i18n.t as TFunction<JhbDashboardTranslationKeys>

  const deploymentStatusToPillStyle = (status: GetDeploymentsState): PillProps['pillStyle'] => {
    switch (status) {
      case 'BUILDING':
        return 'warning'
      case 'ERROR':
        return 'error'
      case 'INITIALIZING':
        return 'warning'
      case 'READY':
        return 'success'
      case 'QUEUED':
      case 'CANCELED':
      case 'DELETED':
        return 'light-gray'
    }
  }

  return (
    <div className="flex items-center gap-2.5">
      {icon}
      {label}:
      <span className="flex items-center gap-2.5">
        {deploymentInfo && (
          <FormattedDate
            date={'readyAt' in deploymentInfo ? deploymentInfo.readyAt : deploymentInfo.createdAt}
            dateFNSKey={i18n.dateFNSKey}
          />
        )}

        <a
          href={deploymentInfo?.inspectorUrl ?? undefined}
          target="_blank"
          rel="noopener noreferrer"
          title={t('jhb-dashboard:deploymentInfoInspectDeployment')}
        >
          <Pill
            pillStyle={
              deploymentInfo?.status
                ? deploymentStatusToPillStyle(deploymentInfo.status)
                : 'light-gray'
            }
            size="small"
          >
            <div className="flex items-center gap-1">
              {deploymentInfo?.status
                ? t(
                    ('jhb-dashboard:vercelDeploymentStatus' +
                      (deploymentInfo.status.charAt(0).toUpperCase() +
                        deploymentInfo.status.slice(1).toLowerCase())) as GetDeploymentsState,
                  )
                : t('jhb-dashboard:vercelDeploymentStatusUnknown')}
              {deploymentInfo?.status === 'BUILDING' && <SpinnerIcon />}
            </div>
          </Pill>
        </a>
      </span>
    </div>
  )
}
