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
    {
      name: 'role',
      required: true,
      type: 'select',
      options: [
        {
          value: 'admin',
          label: {
            de: 'Administrator',
            en: 'Admin',
          },
        },
        {
          value: 'editor',
          label: {
            de: 'Bearbeiter',
            en: 'Editor',
          },
        },
      ],
      defaultValue: 'editor',
      // Save this field to JWT so it can be used from `req.user`
      saveToJWT: true,
      label: {
        de: 'Rolle',
        en: 'Role',
      },
    },
  ],
}
