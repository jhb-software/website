import type { Block, RichTextFieldDiffServerComponent } from 'payload'

import { getPayloadPopulateFn } from '@payloadcms/richtext-lexical'
import {
  convertLexicalToHTMLAsync,
  type HTMLConvertersFunctionAsync,
} from '@payloadcms/richtext-lexical/html-async'
import { FieldDiffContainer, getHTMLDiffComponents } from '@payloadcms/ui/rsc'

import type { BlockDiffConvertersMap, LexicalEditorState } from './types'

import { createAutoBlockConverter } from './autoBlockConverter'

export type CreateLexicalBlocksDiffComponentOptions = {
  /**
   * Per-block-slug converters that take precedence over the auto-generated
   * ones. Use this when a block needs bespoke layout (e.g. side-by-side
   * columns, custom grouping) that the auto-walker can't produce.
   */
  overrides?: BlockDiffConvertersMap
}

/**
 * Returns a `RichTextFieldDiffServerComponent` that renders Lexical blocks
 * in the version diff view. Every block in `req.payload.config.blocks` gets
 * an auto-generated converter derived from its field config, unless the
 * consumer supplies an `override` for that slug.
 */
export const createLexicalBlocksDiffComponent = (
  options: CreateLexicalBlocksDiffComponentOptions = {},
): RichTextFieldDiffServerComponent => {
  const { overrides = {} } = options

  const DiffComponent: RichTextFieldDiffServerComponent = async (args) => {
    const {
      comparisonValue: valueFrom,
      field,
      i18n,
      locale,
      nestingLevel,
      req,
      versionValue: valueTo,
    } = args

    const payloadPopulateFn = await getPayloadPopulateFn({
      currentDepth: 0,
      depth: 1,
      req,
    })

    const allBlocks = (req.payload.config.blocks ?? []) as Block[]
    const blocksMap: Record<string, Block> = Object.fromEntries(
      allBlocks.map((block) => [block.slug, block]),
    )
    const localeCode = typeof locale === 'string' ? locale : undefined

    const autoConverters: BlockDiffConvertersMap = {}
    for (const block of allBlocks) {
      autoConverters[block.slug] = createAutoBlockConverter(block, blocksMap, {
        locale: localeCode,
      })
    }
    const blocks = { ...autoConverters, ...overrides }

    const converters: HTMLConvertersFunctionAsync = ({ defaultConverters }) => ({
      ...defaultConverters,
      blocks: {
        ...defaultConverters.blocks,
        ...blocks,
      },
    })

    const fromHTML = await convertLexicalToHTMLAsync({
      converters,
      data: valueFrom as LexicalEditorState,
      populate: payloadPopulateFn,
    })

    const toHTML = await convertLexicalToHTMLAsync({
      converters,
      data: valueTo as LexicalEditorState,
      populate: payloadPopulateFn,
    })

    const { From, To } = getHTMLDiffComponents({
      fromHTML: fromHTML?.length ? fromHTML : '<p></p>',
      toHTML: toHTML?.length ? toHTML : '<p></p>',
    })

    return (
      <FieldDiffContainer
        className="lexical-diff"
        From={From}
        i18n={i18n}
        label={{
          label: field.label,
          locale,
        }}
        nestingLevel={nestingLevel}
        To={To}
      />
    )
  }

  return DiffComponent
}
