import { HTMLAttributes, forwardRef } from 'react'
import { cn, statusStyles, priorityStyles } from '@/lib/styles'
import type { Task } from '@/lib/stately'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'status' | 'priority'
  status?: Task['status']
  priority?: Task['priority']
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', status, priority, children, ...props }, ref) => {
    const getVariantClasses = () => {
      if (variant === 'status' && status) {
        return cn(
          'px-2 py-1 rounded-full text-xs font-medium',
          statusStyles[status as keyof typeof statusStyles].bg,
          statusStyles[status as keyof typeof statusStyles].text
        )
      }
      
      if (variant === 'priority' && priority) {
        const priorityStyle = priorityStyles[priority as keyof typeof priorityStyles]
        return cn(
          'px-2 py-1 rounded-full text-xs font-medium',
          priorityStyle?.text || 'text-gray-700',
          priorityStyle?.bg || 'bg-gray-100'
        )
      }
      
      return 'px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full'
    }

    return (
      <span
        ref={ref}
        className={cn(getVariantClasses(), className)}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export { Badge }