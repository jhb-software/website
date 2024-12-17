'use client'

import { useCustomTranslations } from '@/shared/useCustomTranslations'
import { useRowLabel } from '@payloadcms/ui'

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
