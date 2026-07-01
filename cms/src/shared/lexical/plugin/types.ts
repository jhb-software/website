import type { SerializedBlockNode } from '@payloadcms/richtext-lexical'
import type {
  convertLexicalToHTMLAsync,
  HTMLConverterAsync,
} from '@payloadcms/richtext-lexical/html-async'

export type LexicalEditorState = Parameters<typeof convertLexicalToHTMLAsync>[0]['data']

export type BlockDiffConverter<T extends { blockType: string } = { blockType: string }> =
  HTMLConverterAsync<SerializedBlockNode<T>>

// Use `any` so per-block converters with specific generics assign without
// casts — mirrors Payload's own internal typing of its `blocks` converter map.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BlockDiffConvertersMap = Record<string, HTMLConverterAsync<SerializedBlockNode<any>>>

export type UploadDoc = {
  alt?: null | string
  filename?: null | string
  id?: number | string
  sizes?: null | Record<string, { url?: null | string } | undefined>
  thumbnailURL?: null | string
  url?: null | string
}

export type PopulateFn = <TData extends object>(args: {
  collectionSlug: string
  id: number | string
}) => Promise<TData | undefined>
