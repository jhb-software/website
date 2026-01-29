import type { HeadingNode, LexicalNode, TextNode } from '@jhb.software/astro-payload-richtext-lexical'
import type { TocItem } from '@/components/TableOfContents.astro'
import slugifyId from './slugifyId'

export function extractHeadings(nodes: LexicalNode[]): TocItem[] {
  const headings: TocItem[] = []

  function traverseNodes(nodeList: LexicalNode[]) {
    for (const node of nodeList) {
      if (node.type === 'heading' && ['h2', 'h3'].includes((node as HeadingNode).tag)) {
        const headingNode = node as HeadingNode
        const textContent = extractTextFromNodes(headingNode.children || [])

        if (textContent) {
          headings.push({
            id: slugifyId(textContent),
            text: textContent,
            level: headingNode.tag === 'h2' ? 2 : 3,
          })
        }
      }

      // Traverse children if they exist
      if ('children' in node && node.children) {
        traverseNodes(node.children)
      }
    }
  }

  function extractTextFromNodes(nodes: LexicalNode[]): string {
    let text = ''

    for (const node of nodes) {
      if (node.type === 'text') {
        text += (node as TextNode).text
      } else if ('children' in node && node.children) {
        text += extractTextFromNodes(node.children)
      }
    }

    return text.trim()
  }

  traverseNodes(nodes)
  return headings
}
