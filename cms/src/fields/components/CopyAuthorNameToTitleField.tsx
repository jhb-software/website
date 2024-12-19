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
  const { setValue: setTitle, value: title } = useField<string>({ path: 'title' })

  useEffect(() => {
    // Only set the title if it is not already set to prevent the creation of unnecessary draft versions.
    if (title !== authorName) {
      setTitle(authorName)
    }
  }, [authorName, setTitle, title])

  return <></>
}
