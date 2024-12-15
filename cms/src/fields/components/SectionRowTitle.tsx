'use client'

import { useCustomTranslations } from '@/shared/useCustomTranslations'
import { useRowLabel } from '@payloadcms/ui'

export default function SectionRowTitle() {
  const { data, rowNumber } = useRowLabel<{ title?: string }>()
  const { t } = useCustomTranslations()

  return (
    <span>
      {t('section')} {rowNumber} - {data?.title?.trim() ? data.title : t('untitled')}
    </span>
  )
}
