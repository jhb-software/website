import { CollectionConfig } from 'payload'

export const lazyLoadingLivePreviewComponent: CollectionConfig['admin'] = {
  components: {
    views: {
      edit: {
        livePreview: {
          Component: '@/components/LazyLoadingLivePreview.tsx',
        },
      },
    },
  },
}
