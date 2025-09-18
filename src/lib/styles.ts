import { clsx, type ClassValue } from 'clsx'

// Utility function for conditional classes
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// Common style variants
export const cardVariants = {
  base: 'rounded-xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-sm transition-all duration-200',
  hover: 'hover:shadow-lg hover:-translate-y-0.5',
  elevated: 'shadow-lg bg-white border-gray-200',
  outline: 'bg-transparent border-gray-200',
}

export const buttonVariants = {
  base: 'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 focus:ring-blue-300',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-sm hover:shadow-md transform hover:scale-105 focus:ring-gray-400',
  outline: 'border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 transform hover:scale-105 focus:ring-blue-300',
  ghost: 'text-gray-700 hover:bg-gray-100 transform hover:scale-105 focus:ring-gray-300',
  destructive: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105 focus:ring-red-300',
}

export const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

// Priority color mappings
export const priorityStyles = {
  low: {
    border: 'border-l-green-500',
    bg: 'bg-green-50/50',
    text: 'text-green-700',
  },
  medium: {
    border: 'border-l-yellow-500',
    bg: 'bg-yellow-50/50',
    text: 'text-yellow-700',
  },
  high: {
    border: 'border-l-orange-500',
    bg: 'bg-orange-50/50',
    text: 'text-orange-700',
  },
  urgent: {
    border: 'border-l-red-500',
    bg: 'bg-red-50/50',
    text: 'text-red-700',
  },
}

// Status color mappings
export const statusStyles = {
  todo: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    dot: 'bg-gray-400',
  },
  'in-progress': {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    dot: 'bg-blue-500',
  },
  completed: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    dot: 'bg-green-500',
  },
  archived: {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    dot: 'bg-gray-400',
  },
}

// Common layout classes
export const layoutClasses = {
  container: 'mx-auto px-4 py-8',
  grid: {
    responsive: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    stats: 'grid grid-cols-2 md:grid-cols-4 gap-4',
  },
  flex: {
    between: 'flex items-center justify-between',
    center: 'flex items-center justify-center',
    start: 'flex items-start',
    gap: 'flex items-center gap-3',
  },
  text: {
    title: 'text-3xl font-bold text-gray-900',
    subtitle: 'text-gray-600',
    cardTitle: 'text-lg font-semibold text-gray-900',
    muted: 'text-sm text-gray-500',
  },
}

// Animation classes
export const animations = {
  fadeIn: 'animate-fade-in',
  slideUp: 'animate-slide-up',
  pulse: 'animate-pulse',
  loading: 'animate-pulse opacity-50 pointer-events-none',
}