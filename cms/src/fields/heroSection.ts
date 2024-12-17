import { Field } from 'payload'
import { linksField } from './links'

export function heroSection(): Field {
  return {
    name: 'hero',
    type: 'group',
    label: {
      de: 'Hero Abschnitt',
      en: 'Hero Section',
    },
    interfaceName: 'HeroSection',
    fields: [
      {
        name: 'title',
        type: 'text',
        required: true,
        localized: true,
        label: {
          de: 'Titel',
          en: 'Title',
        },
      },
      {
        name: 'subtitle',
        type: 'textarea',
        localized: true,
        required: true,
        label: {
          de: 'Untertitel',
          en: 'Subtitle',
        },
      },
      linksField({
        name: 'links',
        relationTo: ['pages'],
        maxRows: 2,
      }),
    ],
  }
}
