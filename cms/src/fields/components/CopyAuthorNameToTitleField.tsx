'use client'

import { useField } from '@payloadcms/ui'
import { useEffect } from 'react'

/**
 * Custom field which copies the author name to the title field.
 *
 * This is needed, because the nested author.name field cannot be used as a title field in payload.
 */
export default function CopyAuthorNameToTitleField() {
  const { value: authorName } = useField<string>({ path: 'author.name' })
  const { setValue: setTitle } = useField<string>({ path: 'title' })

  useEffect(() => setTitle(authorName), [authorName, setTitle])

  return <></>
}
