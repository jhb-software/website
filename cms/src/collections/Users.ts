import type { CollectionConfig } from 'payload'

import { authenticated } from '@/shared/access/authenticated'
import { CollectionGroups } from '@/shared/CollectionGroups'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['email', 'firstName', 'lastName', 'role'],
    group: CollectionGroups.SystemCollections,
    listSearchableFields: ['email', 'firstName', 'lastName'],
    useAsTitle: 'email',
  },
  auth: true,
  labels: {
    plural: {
      de: 'Benutzer',
      en: 'Users',
    },
    singular: {
      de: 'Benutzer',
      en: 'User',
    },
  },
  fields: [
    // Email field is added by default
    {
      name: 'firstName',
      type: 'text',
      label: {
        de: 'Vorname',
        en: 'First Name',
      },
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      label: {
        de: 'Nachname',
        en: 'Last Name',
      },
      required: true,
    },
  ],
}
