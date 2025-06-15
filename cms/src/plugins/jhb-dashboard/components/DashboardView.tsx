import { TFunction } from '@payloadcms/translations'
import { Gutter } from '@payloadcms/ui'
import Link from 'next/link'
import { AdminViewServerPropsOnly } from 'payload'
import React from 'react'
import { JhbDashboardTranslationKeys } from '../translations'
import { JhbDashboardPluginConfig } from '../types'
import { DeploymentInfoCard } from './cards/deployment-info/DeploymentInfoCard'
import { GlobeIcon } from './icons/globe'

/** Props provided by the plugin config. */
export type DashboardViewPluginProps = {
  title: string
  frontend: JhbDashboardPluginConfig['frontend']
  features: JhbDashboardPluginConfig['features']
}

export type DashboardViewProps = DashboardViewPluginProps & AdminViewServerPropsOnly

export const DashboardView: React.FC<DashboardViewProps> = ({
  i18n,
  title,
  frontend,
  features,
}) => {
  const t = i18n.t as TFunction<JhbDashboardTranslationKeys>

  return (
    <Gutter>
      <div className="mb-8">
        <h1 className="mb-4!">{title}</h1>

        <div className="flex items-center gap-2">
          <GlobeIcon />
          <span>{t('jhb-dashboard:website')}:</span>
          <Link href={frontend.url} target="_blank" rel="noopener noreferrer">
            {frontend.url.replace(/^https?:\/\//, '')}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features?.deploymentInfo === true && <DeploymentInfoCard i18n={i18n} />}
      </div>
    </Gutter>
  )
}
