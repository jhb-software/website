export type JhbDashboardPluginConfig = {
  /**
   * Whether the plugin is enabled.
   */
  enabled: boolean
  /**
   * The title of the dashboard.
   */
  title: string
  /**
   * Information about the frontend which are necessary for the plugin to work.
   */
  frontend: {
    url: string
  }
  /**
   * Features to enable/disable. For every enabled feature, a card will be displayed on the dashboard.
   */
  features: {
    deploymentInfo: boolean
  }
}
