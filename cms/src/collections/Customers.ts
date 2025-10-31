import { anyone } from '@/shared/access/anyone'
import { authenticated } from '@/shared/access/authenticated'
import { CollectionGroups } from '@/shared/CollectionGroups'
import { isValidURL } from '@/utils/isValidURL'
import { CollectionConfig } from 'payload'

const Customers: CollectionConfig = {
  slug: 'customers',
  labels: {
    singular: {
      de: 'Kunde',
      en: 'Customer',
    },
    plural: {
      de: 'Kunden',
      en: 'Customers',
    },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'updatedAt', 'status'],
    group: CollectionGroups.ContentCollections,
  },
  access: {
    read: anyone,
    update: authenticated,
    delete: authenticated,
    create: authenticated,
  },
  fields: [
    // Sidebar fields:
    {
      name: 'websiteUrl',
      label: 'Website URL',
      type: 'text',
      required: true,
      localized: true,
      validate: (value: unknown) =>
        typeof value === 'string' && isValidURL(value) ? true : 'Invalid URL',
      admin: {
        position: 'sidebar',
      },
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
      required: true,
      localized: true,
      label: {
        en: 'Excerpt',
        de: 'Kurzbeschreibung',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}

export default Customers
