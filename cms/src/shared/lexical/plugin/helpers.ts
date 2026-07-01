import {
  convertLexicalToHTMLAsync,
  type HTMLConvertersAsync,
} from '@payloadcms/richtext-lexical/html-async'

import type { BlockDiffConvertersMap, LexicalEditorState, PopulateFn, UploadDoc } from './types'

export const styles = {
  arrayIndex: `
    color: var(--theme-elevation-400);
    font-size: 11px;
    margin-right: 8px;
  `,
  arrayItem: `
    background: var(--theme-elevation-100);
    border-radius: 4px;
    padding: 8px 10px;
    margin: 4px 0;
    font-size: 12px;
  `,
  column: `
    background: var(--theme-elevation-100);
    border-radius: 4px;
    padding: 10px;
  `,
  columnLabel: `
    font-size: 11px;
    font-weight: 500;
    color: var(--theme-elevation-500);
    margin-bottom: 8px;
    text-transform: uppercase;
  `,
  columns: `
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  `,
  container: `
    background: var(--theme-elevation-50);
    border-radius: 8px;
    padding: 12px;
    margin: 8px 0;
    font-family: system-ui, -apple-system, sans-serif;
  `,
  empty: `
    color: var(--theme-elevation-400);
    font-style: italic;
  `,
  field: `
    margin-bottom: 8px;
    font-size: 13px;
    line-height: 1.4;
  `,
  header: `
    font-size: 13px;
    font-weight: 600;
    color: var(--theme-elevation-800);
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--theme-elevation-150);
  `,
  label: `
    color: var(--theme-elevation-500);
    font-weight: 500;
  `,
  uploadList: `
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 4px;
  `,
  value: `
    color: var(--theme-elevation-800);
  `,
}

export function blockContainer(blockType: string, content: string): string {
  return `
    <div style="${styles.container}" data-enable-match="true">
      <div style="${styles.header}">Block: ${blockType}</div>
      <div>${content}</div>
    </div>
  `
}

export function field(label: string, value: boolean | null | number | string | undefined): string {
  const displayValue =
    value === null || value === undefined || value === ''
      ? `<span style="${styles.empty}">(empty)</span>`
      : `<span style="${styles.value}">${String(value)}</span>`

  return `<div style="${styles.field}"><span style="${styles.label}">${label}:</span> ${displayValue}</div>`
}

export function coordinates(label: string, value: [number, number] | null | undefined): string {
  if (!value || value.length !== 2) {
    return field(label, null)
  }
  const [lng, lat] = value
  return field(label, `${lat.toFixed(5)}, ${lng.toFixed(5)}`)
}

/**
 * Converts a nested Lexical rich-text value to HTML, reusing the outer
 * converters so inner blocks resolve too. Returns an italic `(empty)` marker
 * when the value is empty/null.
 */
export async function richText(
  args: { converters: HTMLConvertersAsync; populate?: PopulateFn },
  data: LexicalEditorState | null | undefined,
): Promise<string> {
  if (!data) {
    return `<span style="${styles.empty}">(empty)</span>`
  }
  return convertLexicalToHTMLAsync({
    converters: args.converters,
    data,
    populate: args.populate,
  })
}

/**
 * Identity helper that preserves per-converter generic types while producing a
 * `BlockDiffConvertersMap`, so consumers don't need per-entry type casts.
 */
export const defineBlockConverters = <M extends BlockDiffConvertersMap>(map: M): M => map

/**
 * Renders an array of uploads with thumbnails, matching Payload's built-in
 * `upload-diff` markup so the admin's CSS styles it identically.
 */
export async function uploadArray<T extends UploadDoc>({
  items,
  label,
  mediaCollection,
  populate,
}: {
  items: (string | T)[] | null | undefined
  label: string
  mediaCollection: string
  populate?: PopulateFn
}): Promise<string> {
  const list = Array.isArray(items) ? items : items ? [items] : []
  if (list.length === 0) {
    return `<div style="${styles.field}"><span style="${styles.label}">${label}:</span> <span style="${styles.empty}">(none)</span></div>`
  }

  const resolvedItems = await Promise.all(
    list.map(async (item) => {
      if (typeof item === 'string' && populate) {
        const doc = await populate<T>({ collectionSlug: mediaCollection, id: item })
        return doc || item
      }
      return item
    }),
  )

  const itemsHtml = resolvedItems
    .map((item) => {
      if (typeof item === 'string') {
        return `<div class="upload-diff" data-enable-match="true" data-id="${item}" data-relation-to="${mediaCollection}"><div class="upload-diff__card"><div class="upload-diff__info" data-enable-match="false"><strong>${item}</strong></div></div></div>`
      }

      const filename = item.filename || item.alt || '(unnamed)'
      const altText = item.alt || filename
      const thumbnailSrc =
        item.sizes?.xs?.url || item.sizes?.sm?.url || item.thumbnailURL || item.url
      const id = item.id ?? ''

      const thumbnailHtml = thumbnailSrc
        ? `<div class="upload-diff__thumbnail"><img alt="${altText}" src="${thumbnailSrc}" /></div>`
        : ''

      return `<div class="upload-diff" data-enable-match="true" data-id="${id}" data-relation-to="${mediaCollection}"><div class="upload-diff__card">${thumbnailHtml}<div class="upload-diff__info" data-enable-match="false"><strong>${filename}</strong></div></div></div>`
    })
    .join('')

  return `
    <div style="${styles.field}">
      <span style="${styles.label}">${label}:</span>
      <div style="${styles.uploadList}">${itemsHtml}</div>
    </div>
  `
}

/**
 * Sugar over {@link uploadArray} that binds `mediaCollection` once so the
 * project's explicit converters can use positional args.
 */
export function createUploadArrayHelper({ mediaCollection }: { mediaCollection: string }) {
  return async <T extends UploadDoc>(
    label: string,
    items: (string | T)[] | null | undefined,
    populate?: PopulateFn,
  ): Promise<string> => uploadArray({ items, label, mediaCollection, populate })
}
