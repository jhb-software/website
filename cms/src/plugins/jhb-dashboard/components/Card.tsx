import React from 'react'

type CardProps = {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({ actions, children, className, icon, title }) => {
  const cardClasses = `card flex flex-col h-full ${className || ''}`.trim()

  return (
    <div className={cardClasses}>
      <div className="flex items-center gap-2.5 pb-6 border-b border-solid border-[var(--theme-border-color)] border-0">
        {icon && icon}
        <h3 className="flex-grow">{title}</h3>
      </div>

      <div className="flex-grow">{children}</div>

      {actions && <div className="flex justify-start mt-auto">{actions}</div>}
    </div>
  )
}
