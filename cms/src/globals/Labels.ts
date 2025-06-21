import { Article, Project } from '@/payload-types'
import { GlobalConfig, TextField } from 'payload'

const labelField = (name: string, label?: string): TextField => ({
  name,
  type: 'text',
  required: true,
  localized: true,
  label: label,
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
        labelField('show-more'),
        labelField('learn-more'),
        labelField('table-of-contents'),
        labelField('navigate-to-section'),
        labelField('open-menu'),
        labelField('close-menu'),
      ],
    },
    {
      type: 'group',
      name: 'social',
      fields: [
        labelField('visit-facebook'),
        labelField('visit-twitter'),
        labelField('visit-linkedin'),
        labelField('visit-instagram'),
        labelField('visit-youtube'),
        labelField('visit-github'),
      ],
    },
    {
      type: 'group',
      name: 'projects',
      fields: [
        ...(['web-app', 'website', 'app', 'seo', 'cms'] satisfies Project['tags']).map((tag) =>
          labelField(tag),
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
        ).map((tag) => labelField(tag)),
        labelField('written-by'),
        labelField('last-updated-at'),
      ],
    },
    {
      type: 'group',
      name: 'not-found-page',
      label: 'Not found (404) page',
      fields: [
        labelField('title', 'Title'),
        labelField('description', 'Description'),
        labelField('home-page-button', 'Home page button'),
      ],
    },
  ],
}

export default Labels
