import { Config } from 'payload'
import { DashboardViewPluginProps } from './components/DashboardView'
import { JhbDashboardPluginConfig } from './types'

export const jhbDashboardPlugin =
  (pluginConfig: JhbDashboardPluginConfig) =>
  (incomingConfig: Config): Config => {
    const config = { ...incomingConfig }

    config.onInit = async (payload) => {
      if (incomingConfig.onInit) {
        await incomingConfig.onInit(payload)
      }

      const requiredEnvVars = [
        'VERCEL_API_TOKEN',
        'FRONTEND_VERCEL_PROJECT_ID',
        'FRONTEND_VERCEL_TEAM_ID',
      ]

      const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar])
      if (missingEnvVars.length > 0) {
        throw new Error(
          `The following environment variables are required for the jhb-dashboard plugin but not defined: ${missingEnvVars.join(
            ', ',
          )}`,
        )
      }
    }

    return {
      ...config,
      admin: {
        ...config.admin,
        components: {
          ...config.admin?.components,
          views: {
            ...config.admin?.components?.views,
            dashboard: {
              Component: {
                path: '/plugins/jhb-dashboard/components/DashboardView#DashboardView',
                serverProps: {
                  title: pluginConfig.title,
                  frontend: pluginConfig.frontend,
                  features: pluginConfig.features,
                } satisfies DashboardViewPluginProps,
              },
            },
          },
        },
      },
    }
  }
