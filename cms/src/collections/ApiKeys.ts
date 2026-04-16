import { CollectionConfig } from 'payload'

import { isAdmin } from '@/shared/access/isAdmin'
import { isSelfOrAdmin } from '@/shared/access/isSelfOrAdmin'
import { CollectionGroups } from '@/shared/CollectionGroups'

const ApiKeys: CollectionConfig = {
  slug: 'api-keys',
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: isSelfOrAdmin,
    update: isAdmin,
  },
  admin: {
    group: CollectionGroups.SystemCollections,
    useAsTitle: 'type',
  },
  auth: {
    disableLocalStrategy: true,
    useAPIKey: true,
  },
  labels: {
    plural: 'API Keys',
    singular: 'API Key',
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Website', value: 'website' },
        { label: 'Agent', value: 'agent' },
      ],
      required: true,
    },
  ],
}

export default ApiKeys
