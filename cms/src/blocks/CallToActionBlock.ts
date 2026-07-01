import { Block } from 'payload'

import { isValidURL } from '@/utils/isValidURL'

/**
 * Generic "heading + text + link buttons" section block. Use it for any promo
 * that points the visitor somewhere (podcast, newsletter, external profiles,
 * "book a call", …) — the links array and per-link icon/style keep it reusable
 * instead of hard-coding a single use case.
 */
export const CallToActionBlock: Block = {
  slug: 'call-to-action',
  interfaceName: 'CallToActionBlock',
  labels: {
    plural: {
      de: 'Call-to-Action Blöcke',
      en: 'Call-to-Action Blocks',
    },
    singular: {
      de: 'Call-to-Action Block',
      en: 'Call-to-Action Block',
    },
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
    },
    {
      name: 'description',
      type: 'textarea',
      label: {
        de: 'Beschreibung',
        en: 'Description',
      },
      localized: true,
    },
    {
      name: 'links',
      type: 'array',
      label: {
        de: 'Links',
        en: 'Links',
      },
      labels: {
        plural: {
          de: 'Links',
          en: 'Links',
        },
        singular: {
          de: 'Link',
          en: 'Link',
        },
      },
      minRows: 1,
      required: true,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'label',
              type: 'text',
              admin: {
                width: '50%',
              },
              label: {
                de: 'Beschriftung',
                en: 'Label',
              },
              localized: true,
              required: true,
            },
            {
              name: 'url',
              type: 'text',
              admin: {
                width: '50%',
              },
              label: 'URL',
              required: true,
              validate: (value: unknown, { required }: { required?: boolean }) => {
                if (typeof value !== 'string' || value.length === 0) {
                  return required ? 'URL is required' : true
                }
                return isValidURL(value) ? true : 'Invalid URL'
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'icon',
              type: 'select',
              admin: {
                width: '50%',
              },
              label: {
                de: 'Icon',
                en: 'Icon',
              },
              options: [
                { label: 'Website / Globe', value: 'globe' },
                { label: 'Spotify', value: 'spotify' },
                { label: 'YouTube', value: 'youtube' },
                { label: 'Apple Podcasts', value: 'apple-podcasts' },
                { label: 'GitHub', value: 'github' },
                { label: 'LinkedIn', value: 'linkedin' },
                { label: 'Instagram', value: 'instagram' },
                { label: 'Facebook', value: 'facebook' },
                { label: 'WhatsApp', value: 'whatsapp' },
                { label: 'X', value: 'x' },
                { label: 'Arrow', value: 'arrow-right' },
              ],
            },
            {
              name: 'style',
              type: 'select',
              admin: {
                width: '50%',
              },
              defaultValue: 'light',
              label: {
                de: 'Stil',
                en: 'Style',
              },
              options: [
                { label: { de: 'Primär', en: 'Primary' }, value: 'primary' },
                { label: { de: 'Sekundär', en: 'Secondary' }, value: 'light' },
                { label: { de: 'Textlink', en: 'Text link' }, value: 'text' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
