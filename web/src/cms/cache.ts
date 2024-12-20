interface BuildCache {
  /** Map storing global blocks with composite key of `${locale}-${title}` */
  readonly globalBlocks: Map<string, any>
}

/** Global build cache which stores frequently used CMS resources when building the website */
export let buildCache: BuildCache = {
  globalBlocks: new Map(),
}
