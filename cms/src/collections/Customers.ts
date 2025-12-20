import { CollectionConfig } from 'payload'

import { anyone } from '@/shared/access/anyone'
import { authenticated } from '@/shared/access/authenticated'
import { CollectionGroups } from '@/shared/CollectionGroups'
import { isValidURL } from '@/utils/isValidURL'

const Customers: CollectionConfig = {
  slug: 'customers',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'updatedAt', 'status'],
    group: CollectionGroups.ContentCollections,
    useAsTitle: 'name',
  },
  labels: {
    plural: {
      de: 'Kunden',
      en: 'Customers',
    },
    singular: {
      de: 'Kunde',
      en: 'Customer',
    },
  },
  fields: [
    // Sidebar fields:
    {
      name: 'websiteUrl',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
      label: 'Website URL',
      localized: true,
      required: true,
      validate: (value: unknown) =>
        typeof value === 'string' && isValidURL(value) ? true : 'Invalid URL',
    },
    // Body fields:
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: {
        de: 'Kurzbeschreibung',
        en: 'Excerpt',
      },
      localized: true,
      required: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'images',
      required: true,
    },
  ],
}

export default Customers
