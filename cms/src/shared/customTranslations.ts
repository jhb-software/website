import type { NestedKeysStripped } from '@payloadcms/translations'

export const customTranslations = {
  en: {
    section: 'Section',
    untitled: 'Untitled',
    unlabelled: 'Unlabelled',
  },
  de: {
    section: 'Abschnitt',
    untitled: 'Unbenannt',
    unlabelled: 'Unbeschriftet',
  },
}

export type CustomTranslationsObject = typeof customTranslations.en
export type CustomTranslationsKeys = NestedKeysStripped<CustomTranslationsObject>
