import type { SelectType } from 'payload'

import { buildCache } from '../../cache'
import type { PayloadSDK } from '../sdk'
import type {
  GlobalSlug,
  PayloadGeneratedTypes,
  PopulateType,
  SelectFromGlobalSlug,
  TransformGlobalWithSelect,
  TypedLocale,
} from '../types'

export type FindGlobalOptions<
  T extends PayloadGeneratedTypes,
  TSlug extends GlobalSlug<T>,
  TSelect extends SelectType,
> = {
  depth?: number
  draft?: boolean
  fallbackLocale?: false | TypedLocale<T>
  locale?: 'all' | TypedLocale<T>
  populate?: PopulateType<T>
  select?: TSelect
  slug: TSlug
}

export async function findGlobal<
  T extends PayloadGeneratedTypes,
  TSlug extends GlobalSlug<T>,
  TSelect extends SelectFromGlobalSlug<T, TSlug>,
>(
  sdk: PayloadSDK<T>,
  options: FindGlobalOptions<T, TSlug, TSelect>,
  init?: RequestInit,
): Promise<TransformGlobalWithSelect<T, TSlug, TSelect>> {
  const cacheKey = `${options.locale}-${options.slug}`
  const block = buildCache.globalBlocks.get(cacheKey)

  if (block) {
    return block
  }

  const response = await sdk.request({
    args: options,
    init,
    method: 'GET',
    path: `/globals/${options.slug}`,
  })
  const json = response.json()

  buildCache.globalBlocks.set(cacheKey, json)

  return json
}
