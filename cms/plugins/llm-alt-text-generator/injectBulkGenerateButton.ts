import { CollectionConfig } from 'payload'

export function injectBulkGenerateButton(collectionConfig: CollectionConfig) {
  return {
    ...collectionConfig,
    admin: {
      ...collectionConfig.admin,
      components: {
        ...(collectionConfig.admin?.components ?? {}),
        // TODO: use beforeAction once available: https://github.com/payloadcms/payload/pull/10930
        beforeListTable: [
          ...(collectionConfig.admin?.components?.beforeListTable ?? []),
          '../plugins/llm-alt-text-generator/components/BulkUpdateAltTextsButton',
        ],
      },
    },
  }
}
