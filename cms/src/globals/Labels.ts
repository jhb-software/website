import { GlobalConfig, TextField } from 'payload'

import { Project } from '@/payload-types'
import { anyone } from '@/shared/access/anyone'
import { authenticated } from '@/shared/access/authenticated'

const labelField = (name: string, label?: string): TextField => ({
  name,
  type: 'text',
  label: label,
  localized: true,
  required: true,
})

/** Global document that contains labels that should be changable via the CMS. (e.g. aria labels or global button labels) */
const Labels: GlobalConfig = {
  slug: 'labels',
  typescript: {
    interface: 'Labels',
  },
  access: {
    read: anyone,
    update: authenticated,
  },
  dbName: 'labels', // ensure payload wont convert the slug to be singular
  label: {
    de: 'Beschriftungen',
    en: 'Labels',
  },
  fields: [
    {
      name: 'global',
      type: 'group',
      fields: [
        labelField('show-more'),
        labelField('learn-more'),
        labelField('table-of-contents'),
        labelField('navigate-to-section'),
        labelField('open-menu'),
        labelField('close-menu'),
        labelField('since'),
      ],
    },
    {
      name: 'social',
      type: 'group',
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
      name: 'projects',
      type: 'group',
      fields: [
        ...(['web-app', 'website', 'app', 'seo', 'cms'] satisfies Project['tags']).map((tag) =>
          labelField(tag),
        ),
      ],
    },
    {
      name: 'articles',
      type: 'group',
      fields: [labelField('written-by'), labelField('last-updated-at')],
    },
    {
      name: 'not-found-page',
      type: 'group',
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
