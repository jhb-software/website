import { traverseRichTextBlock } from './traverseRichTextBlock'

export const traverseRichText = ({
  onText,
  root,
  siblingData,
}: {
  onText: (siblingData: Record<string, unknown>, key: string) => void
  root: Record<string, unknown>
  siblingData?: Record<string, unknown>
}) => {
  siblingData = siblingData ?? root

  if (siblingData.text) {
    onText(siblingData, 'text')
  }

  if (siblingData.type === 'block') {
    traverseRichTextBlock({
      onText,
      root,
      siblingData,
    })
  } else if (Array.isArray(siblingData?.children)) {
    for (const child of siblingData.children) {
      traverseRichText({
        onText,
        root,
        siblingData: child,
      })
    }
  }
}
