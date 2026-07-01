// This file contains a minimal node shape to avoid pulling in full Lexical types

import { CollectionSlug } from 'payload'

export type RichTextLexical = {
  root: LexicalNode
  [k: string]: unknown
}

export interface LexicalNode {
  type: string
  format: string
  indent: number
  version: number
  children?: LexicalNode[]
  direction?: 'ltr' | 'rtl'
  tag?: string
  detail?: number
  mode?: string
  style?: string
  text?: string
}

export interface LinkNode extends LexicalNode {
  type: 'link' | 'autolink'
  fields: {
    doc: {
      relationTo: CollectionSlug
      value:
        | {
            // Actual doc data, populated in afterRead hook
            [key: string]: unknown
            id: string
          }
        | string // ID of the doc
    } | null
    linkType: 'custom' | 'internal'
    url: string
  }
}
