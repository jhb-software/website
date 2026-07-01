import type { HTMLConvertersAsync } from '@payloadcms/richtext-lexical/html-async'
import type { Block, Field } from 'payload'

import type { BlockDiffConverter, PopulateFn } from './types'

import {
  blockContainer,
  coordinates,
  field as fieldHelper,
  richText,
  styles,
  uploadArray,
} from './helpers'

type Label = false | Record<string, string> | string | undefined

type RenderCtx = {
  blocksMap: Record<string, Block>
  converters: HTMLConvertersAsync
  locale?: string
  populate?: PopulateFn
}

function humanize(input: string): string {
  return input
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase())
    .trim()
}

function resolveLabel(label: Label, fallback: string, locale?: string): string {
  if (label === false) return ''
  if (typeof label === 'string') return label
  if (label && typeof label === 'object') {
    if (locale && typeof label[locale] === 'string') return label[locale]
    const first = Object.values(label).find(
      (candidate): candidate is string => typeof candidate === 'string',
    )
    if (first) return first
  }
  return humanize(fallback)
}

type SelectOption = string | { label: Label; value: string }

function resolveSelectLabel(
  options: SelectOption[] | undefined,
  value: unknown,
  locale?: string,
): null | string {
  if (value == null || value === '') return null
  const selectedValues = Array.isArray(value) ? value : [value]
  return selectedValues
    .map((selected) => {
      const option = options?.find((candidate) =>
        typeof candidate === 'string' ? candidate === selected : candidate.value === selected,
      )
      if (!option) return String(selected)
      if (typeof option === 'string') return option
      return resolveLabel(option.label, String(selected), locale)
    })
    .join(', ')
}

function pickTitle(doc: unknown): string {
  if (doc == null) return ''
  if (typeof doc !== 'object') return String(doc)
  const record = doc as Record<string, unknown>
  return String(
    record.title ??
      record.name ??
      record.slug ??
      record.filename ??
      record.email ??
      record.label ??
      record.id ??
      '(untitled)',
  )
}

async function renderRelationship(args: {
  ctx: RenderCtx
  field: Extract<Field, { type: 'relationship' }>
  label: string
  value: unknown
}): Promise<string> {
  const { ctx, field, label, value } = args
  if (value == null || (Array.isArray(value) && value.length === 0)) {
    return fieldHelper(label, null)
  }

  const polymorphic = Array.isArray(field.relationTo)
  const items = Array.isArray(value) ? value : [value]

  const titles = await Promise.all(
    items.map(async (item) => {
      let docId: unknown = item
      let relTo: string = polymorphic
        ? ((field.relationTo as string[])[0] ?? '')
        : (field.relationTo as string)

      if (
        polymorphic &&
        item &&
        typeof item === 'object' &&
        'relationTo' in item &&
        'value' in item
      ) {
        relTo = (item as { relationTo: string }).relationTo
        docId = (item as { value: unknown }).value
      }

      if (docId && typeof docId === 'object') return pickTitle(docId)
      if (typeof docId === 'string' && ctx.populate) {
        const doc = await ctx.populate({ collectionSlug: relTo, id: docId })
        return doc ? pickTitle(doc) : docId
      }
      return String(docId)
    }),
  )
  return fieldHelper(label, titles.join(', '))
}

async function renderFields(
  fields: Field[],
  values: Record<string, unknown>,
  ctx: RenderCtx,
): Promise<string> {
  const parts = await Promise.all(
    fields.map((fieldConfig) => renderField(fieldConfig, values, ctx)),
  )
  return parts.filter(Boolean).join('\n')
}

async function renderField(
  fieldConfig: Field,
  values: Record<string, unknown>,
  ctx: RenderCtx,
): Promise<string> {
  if ('admin' in fieldConfig) {
    const adminConfig = fieldConfig.admin as { disabled?: boolean; hidden?: boolean } | undefined
    if (adminConfig?.hidden || adminConfig?.disabled) return ''
  }

  if (fieldConfig.type === 'row' || fieldConfig.type === 'collapsible') {
    return renderFields(fieldConfig.fields, values, ctx)
  }
  if (fieldConfig.type === 'tabs') {
    const parts: string[] = []
    for (const tab of fieldConfig.tabs) {
      const tabValues =
        'name' in tab && tab.name ? ((values?.[tab.name] as Record<string, unknown>) ?? {}) : values
      parts.push(await renderFields(tab.fields, tabValues, ctx))
    }
    return parts.join('\n')
  }
  if (fieldConfig.type === 'ui' || fieldConfig.type === 'join') return ''

  if (!('name' in fieldConfig) || !fieldConfig.name) return ''
  const label = resolveLabel(fieldConfig.label as Label, fieldConfig.name, ctx.locale)
  const value = values?.[fieldConfig.name]

  switch (fieldConfig.type) {
    case 'array': {
      if (!Array.isArray(value) || value.length === 0) {
        return fieldHelper(label, null)
      }
      const items = await Promise.all(
        value.map(async (row, i) => {
          const rowHtml = await renderFields(
            fieldConfig.fields,
            (row ?? {}) as Record<string, unknown>,
            ctx,
          )
          return `<div style="${styles.arrayItem}"><span style="${styles.arrayIndex}">${i + 1}.</span><div style="display: inline-block; vertical-align: top;">${rowHtml}</div></div>`
        }),
      )
      return `<div style="${styles.field}"><span style="${styles.label}">${label}:</span><div style="margin-top: 4px;">${items.join('')}</div></div>`
    }
    case 'blocks': {
      if (!Array.isArray(value) || value.length === 0) {
        return fieldHelper(label, null)
      }
      const items = await Promise.all(
        (value as Array<Record<string, unknown>>).map(async (item) => {
          const slug = item?.blockType as string | undefined
          if (!slug) return ''
          const blockConfig = ctx.blocksMap[slug]
          if (!blockConfig) return ''
          const blockLabel = resolveLabel(blockConfig.labels?.singular as Label, slug, ctx.locale)
          const inner = await renderFields(blockConfig.fields, item, ctx)
          return blockContainer(blockLabel, inner)
        }),
      )
      return `<div style="${styles.field}"><span style="${styles.label}">${label}:</span><div style="margin-top: 4px;">${items.join('')}</div></div>`
    }
    case 'checkbox':
      return fieldHelper(label, value === true ? 'Yes' : value === false ? 'No' : null)
    case 'code':
    case 'date':
    case 'email':
    case 'number':
    case 'text':
    case 'textarea':
      return fieldHelper(label, value as boolean | number | string | null | undefined)
    case 'group':
      return `<div style="${styles.field}"><span style="${styles.label}">${label}:</span><div style="margin-top: 4px; padding-left: 12px; border-left: 2px solid var(--theme-elevation-150);">${await renderFields(fieldConfig.fields, (value ?? {}) as Record<string, unknown>, ctx)}</div></div>`
    case 'json':
      return fieldHelper(label, value != null ? JSON.stringify(value) : null)
    case 'point':
      return coordinates(label, value as [number, number] | null | undefined)
    case 'radio':
    case 'select':
      return fieldHelper(
        label,
        resolveSelectLabel(fieldConfig.options as SelectOption[] | undefined, value, ctx.locale),
      )
    case 'relationship':
      return renderRelationship({ ctx, field: fieldConfig, label, value })
    case 'richText': {
      const content = await richText(ctx, value as Parameters<typeof richText>[1])
      return `<div style="${styles.field}"><span style="${styles.label}">${label}:</span><div style="margin-top: 4px;">${content}</div></div>`
    }
    case 'upload': {
      const relationTo = Array.isArray(fieldConfig.relationTo)
        ? fieldConfig.relationTo[0]!
        : fieldConfig.relationTo
      return uploadArray({
        items: value as Parameters<typeof uploadArray>[0]['items'],
        label,
        mediaCollection: relationTo,
        populate: ctx.populate,
      })
    }
    default:
      return ''
  }
}

/**
 * Builds a {@link BlockDiffConverter} that walks the block's Payload field
 * config and renders each field with a suitable helper. Any top-level block
 * in `blocksMap` is recursively resolvable when a `blocks` sub-field is
 * encountered.
 */
export const createAutoBlockConverter = (
  blockConfig: Block,
  blocksMap: Record<string, Block>,
  { locale }: { locale?: string } = {},
): BlockDiffConverter => {
  return async (args) => {
    const ctx: RenderCtx = {
      blocksMap,
      converters: args.converters,
      locale,
      populate: args.populate,
    }
    const label = resolveLabel(blockConfig.labels?.singular as Label, blockConfig.slug, locale)
    const content = await renderFields(
      blockConfig.fields,
      args.node.fields as unknown as Record<string, unknown>,
      ctx,
    )
    return blockContainer(label, content)
  }
}
