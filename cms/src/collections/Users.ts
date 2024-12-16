import { authenticated } from '@/shared/access/authenticated'
import { CollectionGroups } from '@/shared/CollectionGroups'
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: {
      de: 'Benutzer',
      en: 'User',
    },
    plural: {
      de: 'Benutzer',
      en: 'Users',
    },
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'lastName', 'role'],
    listSearchableFields: ['email', 'firstName', 'lastName'],
    group: CollectionGroups.SystemCollections,
  },
  auth: true,
  access: {
    read: authenticated,
    update: authenticated,
    delete: authenticated,
    create: authenticated,
  },
  fields: [
    // Email field is added by default
    {
      name: 'firstName',
      required: true,
      type: 'text',
      label: {
        de: 'Vorname',
        en: 'First Name',
      },
    },
    {
      name: 'lastName',
      required: true,
      type: 'text',
      label: {
        de: 'Nachname',
        en: 'Last Name',
      },
    },
  ],
}
