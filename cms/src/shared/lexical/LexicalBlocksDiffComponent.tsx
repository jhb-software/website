import { createLexicalBlocksDiffComponent } from './plugin'

/**
 * Renders Lexical blocks in the admin version diff view. Every block in the
 * Payload config gets an auto-generated converter derived from its field
 * config — no per-block overrides are needed on this site yet. Add an
 * `overrides` map (see the plugin README) if a block ever needs a bespoke
 * diff layout.
 */
export const LexicalBlocksDiffComponent = createLexicalBlocksDiffComponent()

export default LexicalBlocksDiffComponent
