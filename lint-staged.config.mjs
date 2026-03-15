export default {
  'cms/src/**/*.{ts,tsx,js,jsx,json}': (files) =>
    `pnpm -C cms exec prettier --write ${files.map((f) => `"${f}"`).join(' ')}`,
  'web/src/**/*.{ts,tsx,astro,js,jsx,json,mjs}': (files) =>
    `pnpm -C web exec prettier --write ${files.map((f) => `"${f}"`).join(' ')}`,
}
