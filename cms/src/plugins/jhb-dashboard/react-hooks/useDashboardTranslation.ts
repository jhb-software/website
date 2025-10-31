'use client'

import { useTranslation } from '@payloadcms/ui'

import type {
  JhbDashboardTranslationKeys,
  JhbDashboardTranslations,
} from '@/plugins/jhb-dashboard/translations'

/**
 * Custom hook which provides type-safe access to dashboard-specific translations.
 */
export function useDashboardTranslation() {
  return useTranslation<JhbDashboardTranslations, JhbDashboardTranslationKeys>()
}
