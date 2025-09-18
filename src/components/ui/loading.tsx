import { cn } from '@/lib/styles'

interface LoadingProps {
  className?: string
  variant?: 'spinner' | 'skeleton' | 'dots'
}

const LoadingSpinner = ({ className }: { className?: string }) => (
  <svg 
    className={cn('animate-spin h-6 w-6', className)} 
    fill="none" 
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
)

const LoadingSkeleton = ({ className }: { className?: string }) => (
  <div className={cn('loading-shimmer rounded', className)} />
)

const LoadingDots = ({ className }: { className?: string }) => (
  <div className={cn('flex space-x-1', className)}>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
        style={{ animationDelay: `${i * 0.2}s` }}
      />
    ))}
  </div>
)

export function Loading({ className, variant = 'spinner' }: LoadingProps) {
  const components = {
    spinner: LoadingSpinner,
    skeleton: LoadingSkeleton,
    dots: LoadingDots,
  }
  
  const Component = components[variant]
  return <Component className={className} />
}

// Skeleton components for specific layouts
export const CardSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="h-64 loading-shimmer rounded-xl" />
    ))}
  </div>
)

export const TextSkeleton = ({ lines = 3 }: { lines?: number }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <div 
        key={i} 
        className={cn(
          'h-4 loading-shimmer rounded',
          i === lines - 1 ? 'w-3/4' : 'w-full'
        )} 
      />
    ))}
  </div>
)