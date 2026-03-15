import type {
  HeadingNode,
  LexicalNode,
  TextNode,
} from '@jhb.software/astro-payload-richtext-lexical'

// Lexical text format bitmask values (from @lexical/lexical)
const FORMAT_BOLD = 1
const FORMAT_ITALIC = 2
const FORMAT_STRIKETHROUGH = 4
const FORMAT_CODE = 16

function getChildren(node: LexicalNode): LexicalNode[] {
  return ('children' in node && Array.isArray(node.children)
    ? node.children
    : []) as LexicalNode[]
}

function convertChildren(nodes: LexicalNode[]): string {
  return nodes.map((n) => convertNode(n)).join('')
}

function convertNode(node: LexicalNode): string {
  switch (node.type) {
    case 'text': {
      const textNode = node as TextNode
      let text = textNode.text
      const format = textNode.format ?? 0
      if (format & FORMAT_CODE) text = `\`${text}\``
      if (format & FORMAT_BOLD) text = `**${text}**`
      if (format & FORMAT_ITALIC) text = `_${text}_`
      if (format & FORMAT_STRIKETHROUGH) text = `~~${text}~~`
      return text
    }

    case 'paragraph': {
      const content = convertChildren(getChildren(node))
      return content ? `${content}\n\n` : ''
    }

    case 'heading': {
      const headingNode = node as HeadingNode
      const level = parseInt(headingNode.tag.substring(1))
      const prefix = '#'.repeat(level)
      const content = convertChildren(getChildren(node))
      return `${prefix} ${content}\n\n`
    }

    case 'list': {
      const listNode = node as unknown as {
        listType: 'bullet' | 'number' | 'check'
        children: LexicalNode[]
      }
      const isOrdered = listNode.listType === 'number'
      const items = getChildren(node)
        .map((item, i) => {
          const itemContent = convertChildren(getChildren(item))
          return isOrdered ? `${i + 1}. ${itemContent}` : `- ${itemContent}`
        })
        .join('\n')
      return `${items}\n\n`
    }

    case 'listitem': {
      return convertChildren(getChildren(node))
    }

    case 'quote': {
      const content = convertChildren(getChildren(node)).trim()
      const prefixed = content
        .split('\n')
        .map((line) => (line ? `> ${line}` : '>'))
        .join('\n')
      return `${prefixed}\n\n`
    }

    case 'link':
    case 'autolink': {
      const linkNode = node as unknown as { fields?: { url?: string }; url?: string }
      const url = linkNode.fields?.url ?? linkNode.url ?? ''
      const text = convertChildren(getChildren(node))
      return `[${text}](${url})`
    }

    case 'horizontalrule': {
      return `---\n\n`
    }

    case 'linebreak': {
      return '\n'
    }

    case 'upload': {
      const uploadNode = node as unknown as {
        value?: { url?: string; alt?: string } | null
      }
      const value = uploadNode.value
      if (value && typeof value === 'object' && value.url) {
        const alt = value.alt ?? ''
        return `![${alt}](${value.url})\n\n`
      }
      return ''
    }

    case 'block': {
      const blockNode = node as unknown as {
        fields?: { blockType?: string; language?: string; code?: string }
      }
      if (blockNode.fields?.blockType === 'code') {
        const lang = blockNode.fields.language ?? ''
        const code = blockNode.fields.code ?? ''
        return `\`\`\`${lang}\n${code}\n\`\`\`\n\n`
      }
      return ''
    }

    default: {
      const children = getChildren(node)
      if (children.length > 0) {
        return convertChildren(children)
      }
      return ''
    }
  }
}

/** Converts an array of Lexical rich-text nodes to a Markdown string. */
export function lexicalToMarkdown(nodes: LexicalNode[]): string {
  return convertChildren(nodes).replace(/\n{3,}/g, '\n\n').trim()
}
