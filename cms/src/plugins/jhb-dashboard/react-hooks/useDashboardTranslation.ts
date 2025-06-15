'use client'

import type {
  JhbDashboardTranslationKeys,
  JhbDashboardTranslations,
} from '@/plugins/jhb-dashboard/translations'
import { useTranslation } from '@payloadcms/ui'

/**
 * Custom hook which provides type-safe access to dashboard-specific translations.
 */
export function useDashboardTranslation() {
  return useTranslation<JhbDashboardTranslations, JhbDashboardTranslationKeys>()
}
