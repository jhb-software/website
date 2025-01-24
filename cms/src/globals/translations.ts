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
      fields: [localizationField('show-more'), localizationField('learn-more')],
    },
  ],
}

export default Translations
