'use client'

import { useRowLabel } from '@payloadcms/ui'

import { useCustomTranslations } from '@/shared/useCustomTranslations'

export default function SectionRowTitle() {
  const { data, rowNumber } = useRowLabel<{ title?: string }>()
  const { t } = useCustomTranslations()

  return (
    <span>
      {t('section')} {rowNumber} - {data?.title?.trim() ? data.title : t('untitled')}
    </span>
  )
}
