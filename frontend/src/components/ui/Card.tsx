import type React from "react"

interface CardProps {
  children: React.ReactNode
  className?: string
  title?: string
  actions?: React.ReactNode
}

const Card: React.FC<CardProps> = ({ children, className = "", title, actions }) => {
  return (
    <div className={`rounded-lg shadow-md overflow-hidden ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-900">
          {title && <h3 className="text-lg font-medium  text-[#ffb86b]">{title}</h3>}
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  )
}

export default Card
