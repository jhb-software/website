import { Field } from 'payload'

import { linksField } from './links'

export function heroSection(): Field {
  return {
    name: 'hero',
    type: 'group',
    interfaceName: 'HeroSection',
    label: {
      de: 'Hero Abschnitt',
      en: 'Hero Section',
    },
    fields: [
      {
        name: 'title',
        type: 'text',
        label: {
          de: 'Titel',
          en: 'Title',
        },
        localized: true,
        required: true,
      },
      {
        name: 'subtitle',
        type: 'textarea',
        label: {
          de: 'Untertitel',
          en: 'Subtitle',
        },
        localized: true,
        required: true,
      },
      linksField({
        name: 'links',
        maxRows: 2,
        relationTo: ['pages'],
      }),
    ],
  }
}
