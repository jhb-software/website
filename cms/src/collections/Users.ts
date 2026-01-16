import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/shared/access/field/isAdmin'
import { isAdmin as isAdminAccess } from '@/shared/access/isAdmin'
import { isSelfOrAdmin } from '@/shared/access/isSelfOrAdmin'
import { CollectionGroups } from '@/shared/CollectionGroups'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    create: isAdminAccess,
    delete: isAdminAccess,
    read: isSelfOrAdmin,
    update: isSelfOrAdmin,
  },
  admin: {
    defaultColumns: ['email', 'firstName', 'lastName', 'roles'],
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
    {
      name: 'roles',
      // Save this field to JWT so we can use from `req.user`
      saveToJWT: true,
      type: 'select',
      hasMany: true,
      defaultValue: ['editor'],
      required: true,
      access: {
        create: isAdmin,
        update: isAdmin,
      },
      options: [
        // Editors can read, create, update and delete content
        {
          label: 'Editor',
          value: 'editor',
        },
        // Admins add or delete users
        {
          label: 'Admin',
          value: 'admin',
        },
        // Developers can see additional debug information
        {
          label: 'Developer',
          value: 'developer',
        },
      ],
    },
  ],
}
