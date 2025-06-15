'use client'

import React from 'react'

interface FormattedDateProps {
  date: Date
  dateFNSKey: string
}

/** Client component which renders a date in the clients timezone. */
export const FormattedDate: React.FC<FormattedDateProps> = ({ date, dateFNSKey }) => {
  // similar to the global date format specified in payload.config.ts
  const dateFormat: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }

  return <>{new Date(date).toLocaleString(dateFNSKey, dateFormat)}</>
}
