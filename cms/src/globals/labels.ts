import { Article, Project } from '@/payload-types'
import { GlobalConfig, TextField } from 'payload'

const localizationField = (name: string): TextField => ({
  name,
  type: 'text',
  required: true,
  localized: true,
})

/** Global document that contains labels that should be changable via the CMS. (e.g. aria labels or global button labels) */
const Labels: GlobalConfig = {
  slug: 'labels',
  // ensure payload wont convert the slug to be singular
  dbName: 'labels',
  typescript: {
    interface: 'Labels',
  },
  label: {
    de: 'Beschriftungen',
    en: 'Labels',
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
        localizationField('open-menu'),
        localizationField('close-menu'),
      ],
    },
    {
      type: 'group',
      name: 'social',
      fields: [
        localizationField('visit-facebook'),
        localizationField('visit-twitter'),
        localizationField('visit-linkedin'),
        localizationField('visit-instagram'),
        localizationField('visit-youtube'),
        localizationField('visit-github'),
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

export default Labels
