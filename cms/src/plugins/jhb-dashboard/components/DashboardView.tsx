import { Gutter } from '@payloadcms/ui'
import Link from 'next/link'
import { AdminViewServerPropsOnly } from 'payload'
import React from 'react'
import { JhbDashboardPluginConfig } from '../types'

/** Props provided by the plugin config. */
export type DashboardViewPluginProps = {
  title: string
  frontend: JhbDashboardPluginConfig['frontend']
  features: JhbDashboardPluginConfig['features']
}

export type DashboardViewProps = DashboardViewPluginProps & AdminViewServerPropsOnly

export const DashboardView: React.FC<DashboardViewProps> = ({
  title,
  frontend,
}) => {
  return (
    <Gutter>
      <div className="mb-8">
        <h1 className="mb-4!">{title}</h1>

        <div className="flex items-center gap-2">
          <Link href={frontend.url} target="_blank" rel="noopener noreferrer">
            {frontend.url.replace(/^https?:\/\//, '')}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">Test</div>
    </Gutter>
  )
}
