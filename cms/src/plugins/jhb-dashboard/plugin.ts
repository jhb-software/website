import { Config } from 'payload'
import { DashboardViewPluginProps } from './components/DashboardView'
import { translations } from './translations'
import { JhbDashboardPluginConfig } from './types'
import { deepMergeSimple } from './utilities/deepMergeSimple'

export const jhbDashboardPlugin =
  (pluginConfig: JhbDashboardPluginConfig) =>
  (incomingConfig: Config): Config => {
    const config = { ...incomingConfig }

    // If the plugin is disabled, return the config without modifying it
    if (pluginConfig.enabled === false) {
      return config
    }

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
      i18n: {
        ...config.i18n,
        translations: deepMergeSimple(translations, config.i18n?.translations ?? {}),
      },
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
