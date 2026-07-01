import type { CollectionSlug, GlobalSlug, PayloadRequest, SelectType, TypedLocale } from 'payload'

import { z } from 'zod'

import type { LexicalNode, RichTextLexical } from '@/shared/lexicalTypes'

import { errorResult, jsonResult, parseTarget } from './contentHelpers'

const nodeInputSchema = z
  .object({
    children: z
      .array(z.record(z.string(), z.any()))
      .optional()
      .describe(
        'Raw Lexical inline children (text nodes, links, etc.) for mixed or formatted content. When present, text is ignored.',
      ),
    fields: z
      .record(z.string(), z.any())
      .optional()
      .describe('Block fields including blockType. Used when type is "block".'),
    items: z
      .array(z.string())
      .optional()
      .describe('List items as plain strings. Used when type is "ul" or "ol".'),
    text: z
      .string()
      .optional()
      .describe('Plain text content. Used for paragraph or heading when no children are provided.'),
    type: z
      .string()
      .describe('"paragraph" | "h1"–"h6" | "ul" | "ol" | "hr" | "block" | any Lexical node type'),
  })
  .describe(
    'Node to write. Use shorthand properties (text, items, fields) for common cases, or pass children for raw Lexical inline nodes.',
  )

type NodeInput = z.infer<typeof nodeInputSchema>

const argsSchema = z.object({
  collection: z
    .string()
    .describe('Collection slug or "globals/<slug>" to target a global (e.g. "globals/footer").'),
  draft: z.boolean().optional().describe('Save as a draft. Defaults to false.'),
  field: z
    .string()
    .describe(
      'RichText field name or dot path. Top-level field, e.g. "content"; or a path into an array/group/tab field, e.g. "infoSections.0.richText". Paths cannot descend into lexical block fields.',
    ),
  id: z
    .union([z.string(), z.number()])
    .optional()
    .describe('Document ID (collections only; omit for globals).'),
  index: z
    .number()
    .int()
    .min(0)
    .optional()
    .describe('0-based index in root.children. Required for insert, replace, delete.'),
  locale: z
    .string()
    .optional()
    .describe('Locale code (e.g. "en", "de"). Defaults to the default locale.'),
  node: nodeInputSchema.optional().describe('Node to write. Required for append, insert, replace.'),
  operation: z
    .enum(['read', 'append', 'insert', 'replace', 'delete'])
    .describe(
      'read: return indexed node summary. append: add node at end. insert: add node before index. replace: swap node at index. delete: remove node at index.',
    ),
})

function makeTextNode(text: string): LexicalNode {
  return {
    detail: 0,
    format: 0,
    mode: 'normal',
    style: '',
    text,
    type: 'text',
    version: 1,
  } as unknown as LexicalNode
}

function toNode(input: NodeInput): LexicalNode {
  const { children, fields, items, text, type } = input
  const inlineChildren = children ? (children as LexicalNode[]) : text ? [makeTextNode(text)] : []

  if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(type)) {
    return {
      children: inlineChildren,
      direction: 'ltr',
      format: '',
      indent: 0,
      tag: type,
      type: 'heading',
      version: 1,
    } as unknown as LexicalNode
  }

  if (type === 'ul' || type === 'ol') {
    return {
      children: (items ?? []).map((item, i) => ({
        children: [makeTextNode(item)],
        direction: 'ltr' as const,
        format: '',
        indent: 0,
        type: 'listitem',
        value: i + 1,
        version: 1,
      })),
      direction: 'ltr',
      format: '',
      indent: 0,
      listType: type === 'ul' ? 'bullet' : 'number',
      start: 1,
      tag: type,
      type: 'list',
      version: 1,
    } as unknown as LexicalNode
  }

  if (type === 'hr' || type === 'horizontalrule') {
    return {
      format: '',
      indent: 0,
      type: 'horizontalrule',
      version: 1,
    } as LexicalNode
  }

  if (type === 'block') {
    return {
      fields: fields ?? {},
      format: '',
      indent: 0,
      type: 'block',
      version: 2,
    } as unknown as LexicalNode
  }

  // paragraph or any other node type
  return {
    children: inlineChildren,
    direction: 'ltr',
    format: '',
    indent: 0,
    textFormat: 0,
    textStyle: '',
    type,
    version: 1,
  } as unknown as LexicalNode
}

function collectText(node: LexicalNode): string {
  const parts: string[] = []
  function walk(n: LexicalNode) {
    if (n.text) parts.push(n.text)
    n.children?.forEach(walk)
  }
  walk(node)
  return parts.join('')
}

function summarizeNode(node: LexicalNode, index: number): Record<string, unknown> {
  const n = node as Record<string, unknown> & LexicalNode
  const preview = (max = 80) => {
    const t = collectText(node)
    return t.length > max ? `${t.slice(0, max)}…` : t
  }

  switch (node.type) {
    case 'heading':
      return { index, preview: preview(), tag: node.tag, type: 'heading' }
    case 'list':
      return {
        index,
        itemCount: node.children?.length ?? 0,
        listType: n.listType,
        type: 'list',
      }
    case 'block':
      return {
        blockType: (n.fields as Record<string, unknown> | undefined)?.blockType ?? 'unknown',
        index,
        type: 'block',
      }
    case 'horizontalrule':
      return { index, type: 'horizontalrule' }
    default:
      return { index, preview: preview(), type: node.type }
  }
}

export const updateRichTextTool = {
  annotations: {
    destructiveHint: false,
    idempotentHint: false,
    readOnlyHint: false,
    title: 'Update rich text',
  },
  description:
    'Read or surgically update a single richText field without rewriting the whole document. The field can be a top-level field ("content") or a dot path into an array/group/tab field ("infoSections.0.richText"). Use read to get an index-annotated node summary, then append / insert / replace / delete to modify individual nodes by index. Returns an updated node summary after each mutation. Access is enforced per request by Payload access control.',
  handler: async (args: Record<string, unknown>, req: PayloadRequest) => {
    try {
      const { collection, draft, field, id, index, locale, node, operation } =
        argsSchema.parse(args)
      const target = parseTarget(collection)
      const draftFlag = draft ?? false
      const localeTyped = locale as TypedLocale | undefined
      // `field` may be a dot path into a nested field, e.g. "infoSections.0.richText".
      // Fetch and write back the top-level field so the nested array/group stays intact.
      const fieldPath = field.split('.')
      const topField = fieldPath[0]
      const selectField = { [topField]: true } as unknown as SelectType

      // --- Fetch the document (only the target field) ---
      let doc: Record<string, unknown>

      if (target.type === 'global') {
        doc = (await req.payload.findGlobal({
          depth: 0,
          draft: draftFlag,
          locale: localeTyped,
          overrideAccess: false,
          req,
          select: selectField,
          slug: target.slug as GlobalSlug,
        })) as unknown as Record<string, unknown>
      } else {
        if (id === undefined) return errorResult('id is required for collection documents.')
        const found = await req.payload.findByID({
          collection: target.slug as CollectionSlug,
          depth: 0,
          disableErrors: true,
          draft: draftFlag,
          id,
          locale: localeTyped,
          overrideAccess: false,
          req,
          select: selectField,
        })
        if (!found) return errorResult(`No ${target.slug} document with id "${id}".`)
        doc = found as unknown as Record<string, unknown>
      }

      // --- Resolve the (possibly nested) richText field ---
      let container: Record<string, unknown> = doc
      for (let i = 0; i < fieldPath.length - 1; i++) {
        const segment = fieldPath[i]
        const next = container[segment]
        if (next === null || typeof next !== 'object') {
          return errorResult(
            `Field path "${field}" could not be resolved: segment "${segment}" is missing or not an object/array.`,
          )
        }
        container = next as Record<string, unknown>
      }
      const leafField = fieldPath[fieldPath.length - 1]

      // --- Extract children ---
      const richText = container[leafField] as RichTextLexical | null | undefined
      if (!richText?.root || !Array.isArray(richText.root.children)) {
        return errorResult(
          `Field "${field}" was not found or is not a richText field. Use getEntitySchema to verify field names.`,
        )
      }
      const children = richText.root.children as LexicalNode[]

      // --- Read ---
      if (operation === 'read') {
        return jsonResult({
          count: children.length,
          nodes: children.map(summarizeNode),
        })
      }

      // --- Validate mutation args ---
      if ((operation === 'append' || operation === 'insert' || operation === 'replace') && !node) {
        return errorResult(`node is required for ${operation}.`)
      }
      if (
        (operation === 'insert' || operation === 'replace' || operation === 'delete') &&
        index === undefined
      ) {
        return errorResult(`index is required for ${operation}.`)
      }

      // --- Apply mutation ---
      let newChildren: LexicalNode[]

      if (operation === 'append') {
        newChildren = [...children, toNode(node!)]
      } else if (operation === 'insert') {
        if (index! > children.length)
          return errorResult(`index ${index} is out of range (0–${children.length}).`)
        newChildren = [...children.slice(0, index), toNode(node!), ...children.slice(index)]
      } else if (operation === 'replace') {
        if (index! >= children.length)
          return errorResult(`index ${index} is out of range (0–${children.length - 1}).`)
        newChildren = [...children.slice(0, index), toNode(node!), ...children.slice(index! + 1)]
      } else {
        // delete
        if (index! >= children.length)
          return errorResult(`index ${index} is out of range (0–${children.length - 1}).`)
        newChildren = [...children.slice(0, index), ...children.slice(index! + 1)]
      }

      const updatedRichText: RichTextLexical = {
        ...richText,
        root: { ...richText.root, children: newChildren },
      }

      // Write the mutated richText back into its container. For a nested path this
      // mutates the fetched top-level field in place, which is then sent as a whole.
      container[leafField] = updatedRichText

      // The `restrictMcpToDraft` beforeChange hook already forces MCP API-key writes to
      // drafts, so this isn't strictly required — but injecting it keeps the intent
      // explicit. Harmlessly stripped on collections without drafts enabled.
      const writeData: Record<string, unknown> = { [topField]: doc[topField] }
      if (draftFlag) writeData._status = 'draft'

      // --- Write back ---
      if (target.type === 'global') {
        await req.payload.updateGlobal({
          data: writeData,
          depth: 0,
          draft: draftFlag,
          locale: localeTyped,
          overrideAccess: false,
          req,
          slug: target.slug as GlobalSlug,
        })
      } else {
        await req.payload.update({
          collection: target.slug as CollectionSlug,
          data: writeData,
          depth: 0,
          draft: draftFlag,
          id: id!,
          locale: localeTyped,
          overrideAccess: false,
          req,
        })
      }

      return jsonResult({
        count: newChildren.length,
        nodes: newChildren.map(summarizeNode),
      })
    } catch (err) {
      return errorResult('Failed to update rich text', err)
    }
  },
  name: 'updateRichText',
  parameters: argsSchema.shape,
}
