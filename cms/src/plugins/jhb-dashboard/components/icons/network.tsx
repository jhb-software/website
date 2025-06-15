import React from 'react'

export const NetworkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
    className={`h-6 w-6 ${props.className || ''}`}
  >
    <circle cx="12" cy="5" r="3" />
    <circle cx="5" cy="12" r="3" />
    <circle cx="19" cy="12" r="3" />
    <circle cx="12" cy="19" r="3" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="8.5" y1="8.5" x2="5" y2="12" />
    <line x1="15.5" y1="8.5" x2="19" y2="12" />
    <line x1="8.5" y1="15.5" x2="5" y2="12" />
    <line x1="15.5" y1="15.5" x2="19" y2="12" />
  </svg>
)
