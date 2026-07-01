import { lexicalEditor } from '@payloadcms/richtext-lexical'

type LexicalEditorArgs = Parameters<typeof lexicalEditor>[0]

type Options = {
  /**
   * Import-map path (e.g. `/shared/lexical/MyDiffComponent#MyDiffComponent`)
   * of the `RichTextFieldDiffServerComponent` produced by
   * `createLexicalBlocksDiffComponent`.
   */
  diffComponentPath: string
}

/**
 * Wraps `lexicalEditor()` and replaces the default `DiffComponent` with a
 * project-provided one, registering it in the generated import map.
 */
export const lexicalEditorWithBlockDiff = (
  args: LexicalEditorArgs | undefined,
  { diffComponentPath }: Options,
) => {
  const base = lexicalEditor(args)
  return async (ctx: Parameters<ReturnType<typeof lexicalEditor>>[0]) => {
    const result = await base(ctx)
    const baseGenerateImportMap = result.generateImportMap
    return {
      ...result,
      DiffComponent: diffComponentPath,
      generateImportMap: (
        importMapArgs: Parameters<NonNullable<typeof baseGenerateImportMap>>[0],
      ) => {
        baseGenerateImportMap?.(importMapArgs)
        importMapArgs.addToImportMap(diffComponentPath)
      },
    }
  }
}
