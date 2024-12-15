'use client'

import { useCustomTranslations } from '@/shared/useCustomTranslations'
import { useRowLabel } from '@payloadcms/ui'

export default function LinkRowTitle() {
  const { data, rowNumber } = useRowLabel<{ label?: string }>()
  const { t } = useCustomTranslations()

  return (
    <span>
      Link {rowNumber} - {data?.label?.trim() ? data.label : t('unlabelled')}
    </span>
  )
}
