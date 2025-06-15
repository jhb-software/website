import React from 'react'

type CardProps = {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({ title, icon, children, actions, className }) => {
  const cardClasses = `card flex flex-col h-full ${className || ''}`.trim()

  return (
    <div className={cardClasses}>
      <div className="card-header flex items-center gap-2 pb-6 border-b border-solid border-[var(--theme-border-color)] border-0">
        {icon && <div className="text-xl text-[var(--theme-text)]">{icon}</div>}
        <h3 className="text-lg font-medium text-[var(--theme-text)] flex-grow">{title}</h3>
      </div>

      <div className="flex-grow">{children}</div>

      {actions && <div className="flex justify-start mt-auto">{actions}</div>}
    </div>
  )
}
