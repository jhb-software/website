'use client'

import { useRowLabel } from '@payloadcms/ui'

import { useCustomTranslations } from '@/shared/useCustomTranslations'

export default function LinkRowTitle() {
  const { data, rowNumber } = useRowLabel<{
    link: { label: string }
  }>()
  const { t } = useCustomTranslations()

  return (
    <span>
      Link {(rowNumber ?? 0) + 1} - {data?.link?.label?.trim() ? data.link.label : t('unlabelled')}
    </span>
  )
}
