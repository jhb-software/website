'use client'

import { LivePreviewWindow, useDocumentInfo, useLivePreviewContext } from '@payloadcms/ui'
import React from 'react'

/**
 * Custom Live Preview component that implements lazy loading.
 *
 * Based on the Payload example at:
 * https://github.com/payloadcms/payload/tree/main/test/live-preview/components/CustomLivePreview.tsx
 *
 * This conditionally renders the LivePreviewWindow to prevent
 * the iframe from loading in the background.
 */
const LazyLoadingLivePreview: React.FC = () => {
  const { collectionSlug, globalSlug } = useDocumentInfo()
  const { isLivePreviewing } = useLivePreviewContext()

  // Only render the LivePreviewWindow when Live Preview is actually open
  // This prevents the iframe from loading the website unnecessarily in the background
  if (!isLivePreviewing) {
    return null
  }

  return <LivePreviewWindow collectionSlug={collectionSlug} globalSlug={globalSlug} />
}

export default LazyLoadingLivePreview
