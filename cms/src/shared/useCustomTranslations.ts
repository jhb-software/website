import { useTranslation } from '@payloadcms/ui'
import { CustomTranslationsObject, CustomTranslationsKeys } from './customTranslations'

export const useCustomTranslations = () =>
  useTranslation<CustomTranslationsObject, CustomTranslationsKeys>()
