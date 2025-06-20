import { Article, Project } from '@/payload-types'
import { GlobalConfig, TextField } from 'payload'

const localizationField = (name: string): TextField => ({
  name,
  type: 'text',
  required: true,
  localized: true,
})

const Translations: GlobalConfig = {
  slug: 'translations',
  // ensure payload wont convert the slug to be singular
  dbName: 'translations',
  typescript: {
    interface: 'Translations',
  },
  label: {
    de: 'Übersetzungen',
    en: 'Translations',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'group',
      name: 'global',
      fields: [
        localizationField('show-more'),
        localizationField('learn-more'),
        localizationField('table-of-contents'),
        localizationField('navigate-to-section'),
      ],
    },
    {
      type: 'group',
      name: 'projects',
      fields: [
        ...(['web-app', 'website', 'app', 'seo', 'cms'] satisfies Project['tags']).map((tag) =>
          localizationField(tag),
        ),
      ],
    },
    {
      type: 'group',
      name: 'articles',
      fields: [
        ...(
          [
            'payload-cms',
            'next-js',
            'seo',
            'web-development',
            'app-development',
          ] satisfies Article['tags']
        ).map((tag) => localizationField(tag)),
        localizationField('written-by'),
        localizationField('last-updated-at'),
      ],
    },
  ],
}

export default Translations
