# Lexical Block Diff

Generic utilities for rendering custom Payload Lexical blocks in the admin
**version diff view** via HTML converters, instead of showing only the block
name/slug.

## Get started

Every block in `req.payload.config.blocks` gets a converter auto-generated
from its field config. You only write converters for blocks that need a
bespoke layout.

### 1. Instantiate the diff component

`cms/src/shared/lexical/LexicalBlocksDiffComponent.tsx`

```tsx
import { createLexicalBlocksDiffComponent } from './plugin'

export const LexicalBlocksDiffComponent = createLexicalBlocksDiffComponent()

export const DIFF_COMPONENT_PATH =
  '/shared/lexical/LexicalBlocksDiffComponent#LexicalBlocksDiffComponent'
```

The component must live in the project so Payload's import map can resolve
it by static path — see the TODO below.

### 2. Wire the editor wrapper

Use it for every `lexicalEditor(...)` call that should render blocks in the
diff view — both the root editor in `payload.config.ts` and any nested rich
text fields inside blocks that define their own editor:

```ts
import { DIFF_COMPONENT_PATH } from './shared/lexical/LexicalBlocksDiffComponent'
import { lexicalEditorWithBlockDiff } from './shared/lexical/plugin'

editor: lexicalEditorWithBlockDiff(
  { features: ({ defaultFeatures }) => [...defaultFeatures, BlocksFeature({ blocks: [...] })] },
  { diffComponentPath: DIFF_COMPONENT_PATH },
)
```

### 3. Regenerate the import map

```bash
pnpm --filter cms generate:importmap
```

### 4. (Optional) Override specific blocks

When the auto layout isn't good enough — e.g. a block with side-by-side
columns or a custom visual grouping — supply an `override`:

```tsx
// blockDiffConverters.ts
import type { TwoColumnBlock } from '../../payload-types'
import {
  type BlockDiffConverter,
  blockContainer,
  defineBlockConverters,
  richText,
  styles,
} from './plugin'

const TwoColumnOverride: BlockDiffConverter<TwoColumnBlock> = async (args) => {
  const [left, right] = await Promise.all([
    richText(args, args.node.fields.left),
    richText(args, args.node.fields.right),
  ])
  return blockContainer(
    'Two-Column',
    `<div style="${styles.columns}"><div style="${styles.column}">${left}</div><div style="${styles.column}">${right}</div></div>`,
  )
}

export const blockOverrides = defineBlockConverters({
  twoColumn: TwoColumnOverride,
})
```

```tsx
// LexicalBlocksDiffComponent.tsx
import { blockOverrides } from './blockDiffConverters'
import { createLexicalBlocksDiffComponent } from './plugin'

export const LexicalBlocksDiffComponent = createLexicalBlocksDiffComponent({
  overrides: blockOverrides,
})
```

## Auto-walker field support

| Payload field type                                    | Rendered as                                                      |
| ----------------------------------------------------- | ---------------------------------------------------------------- |
| `text`, `textarea`, `email`, `number`, `code`, `date` | `field(label, value)` with italic `(empty)` fallback.            |
| `checkbox`                                            | `Yes` / `No`.                                                    |
| `select`, `radio`                                     | Option label (localized), joined by `, ` if `hasMany`.           |
| `point`                                               | `lat, lng` formatted to 5 decimal places.                        |
| `upload`                                              | Payload-native `upload-diff` markup with thumbnail + filename.   |
| `relationship`                                        | `title` / `name` / `slug` / `id` of the populated doc.           |
| `richText`                                            | Recursively converted HTML (nested blocks resolve via same map). |
| `array`                                               | Numbered list, each row rendered recursively.                    |
| `group`                                               | Indented block with a left border.                               |
| `blocks`                                              | Each item rendered via its top-level block config.               |
| `row`, `collapsible`, `tabs`                          | Structural — children flattened into parent.                     |
| `ui`, `join`, `admin.hidden`, `admin.disabled`        | Skipped.                                                         |
| `json`                                                | `JSON.stringify(value)`.                                         |

Field labels use the block/field's configured `label`, resolved for the
current admin locale. Missing labels fall back to a humanised field name.

## API reference

### Helpers

| Helper                                         | Purpose                                                                           |
| ---------------------------------------------- | --------------------------------------------------------------------------------- |
| `blockContainer(blockType, content)`           | Outer frame with the block label.                                                 |
| `field(label, value)`                          | `Label: value` row, with italic `(empty)` fallback.                               |
| `coordinates(label, [lng, lat])`               | Formats a Payload `point` field.                                                  |
| `createUploadArrayHelper({ mediaCollection })` | Returns an `uploadArray(label, items, populate)` that renders thumbnails.         |
| `richText(args, data)`                         | Recursively converts nested Lexical rich text, forwarding outer `converters`.     |
| `styles`                                       | Inline-style string map (uses Payload admin CSS vars like `--theme-elevation-*`). |
| `defineBlockConverters(map)`                   | Identity helper that widens per-block types to `BlockDiffConvertersMap`.          |

### Types

- `BlockDiffConverter<B>` — typed converter for a specific block. Use this on
  per-block converter declarations.
- `BlockDiffConvertersMap` — map passed to `createLexicalBlocksDiffComponent`.
- `UploadDoc`, `PopulateFn`, `LexicalEditorState` — structural helpers.

### Nested blocks

Block converters receive `args.converters` — forward it so nested blocks
inside nested rich text resolve via the same map. The `richText` helper does
this automatically:

```ts
const Converter: BlockDiffConverter<TwoColumn> = async (args) => {
  const left = await richText(args, args.node.fields.left)
  const right = await richText(args, args.node.fields.right)
  // ...
}
```

## What's in here

| File                                   | Purpose                                                                                            |
| -------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `createLexicalBlocksDiffComponent.tsx` | Factory returning a `RichTextFieldDiffServerComponent` that merges auto + project overrides.       |
| `autoBlockConverter.ts`                | Walks a Payload `Block`'s field config and renders each field with the matching helper.            |
| `lexicalEditorWithBlockDiff.ts`        | Wraps `lexicalEditor()`, overrides `DiffComponent`, registers it in the generated import map.      |
| `helpers.ts`                           | HTML rendering (`field`, `coordinates`, `uploadArray`, `richText`, ...) + `defineBlockConverters`. |
| `types.ts`                             | `BlockDiffConverter`, `BlockDiffConvertersMap`, `LexicalEditorState`, `UploadDoc`, `PopulateFn`.   |
