/**
 * Modern Loading System
 * Arquitetura baseada em benchmarks da indústria:
 * - Skeleton Loading Pattern
 * - Progressive Enhancement
 * - Accessibility First
 * - Performance Optimized
 */

"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Wifi, WifiOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { spacing, animations } from '@/lib/design-system'

// ===== TYPES =====
export type LoadingVariant = 'spinner' | 'skeleton' | 'pulse' | 'shimmer' | 'dots'
export type LoadingSize = 'sm' | 'md' | 'lg' | 'xl'
export type SkeletonType = 'text' | 'card' | 'chart' | 'table' | 'avatar' | 'button' | 'custom'

interface BaseLoadingProps {
  className?: string
  'aria-label'?: string
}

// ===== CONFIGURATION =====
const LOADING_CONFIG = {
  defaultDelay: 200, // Delay before showing loading to avoid flashing
  skeletonAnimationDuration: 1.5,
  retryDelay: 1000,
} as const

// ===== ANIMATIONS =====
const loadingAnimations = {
  spinner: {
    animate: { rotate: 360 },
    transition: { duration: 1, repeat: Infinity }
  },
  pulse: {
    animate: { opacity: [0.5, 1, 0.5] },
    transition: { duration: 1.5, repeat: Infinity }
  },
  shimmer: {
    animate: { x: ['-100%', '100%'] },
    transition: { duration: 1.5, repeat: Infinity }
  },
  dots: {
    animate: { scale: [1, 1.2, 1] },
    transition: { duration: 0.6, repeat: Infinity }
  }
}

// ===== SIZE MAPPINGS =====
const sizeMap = {
  sm: { spinner: 'h-4 w-4', text: 'h-3', card: 'h-32' },
  md: { spinner: 'h-6 w-6', text: 'h-4', card: 'h-40' },
  lg: { spinner: 'h-8 w-8', text: 'h-5', card: 'h-48' },
  xl: { spinner: 'h-12 w-12', text: 'h-6', card: 'h-56' }
} as const

// ===== CORE COMPONENTS =====

// Spinner Component
interface SpinnerProps extends BaseLoadingProps {
  size?: LoadingSize
  variant?: 'default' | 'primary' | 'secondary'
}

export const Spinner = React.memo<SpinnerProps>(({ 
  size = 'md', 
  variant = 'default',
  className,
  'aria-label': ariaLabel = 'Carregando...'
}) => {
  const sizeClass = sizeMap[size].spinner
  
  const variantClass = {
    default: 'text-muted-foreground',
    primary: 'text-primary',
    secondary: 'text-secondary-foreground'
  }[variant]

  return (
    <motion.div
      {...loadingAnimations.spinner}
      className={cn('inline-flex', className)}
      role="status"
      aria-label={ariaLabel}
    >
      <Loader2 className={cn(sizeClass, variantClass)} />
    </motion.div>
  )
})

Spinner.displayName = 'Spinner'

// Skeleton Component
interface SkeletonProps extends BaseLoadingProps {
  type?: SkeletonType
  size?: LoadingSize
  lines?: number
  width?: string | number
  height?: string | number
  rounded?: boolean
}

export const Skeleton = React.memo<SkeletonProps>(({
  type = 'text',
  size = 'md',
  lines = 1,
  width,
  height,
  rounded = false,
  className,
  'aria-label': ariaLabel = 'Carregando conteúdo...'
}) => {
  const baseClass = 'bg-muted animate-pulse'
  const roundedClass = rounded ? 'rounded-full' : 'rounded'
  
  const getTypeStyles = () => {
    switch (type) {
      case 'text':
        return {
          height: sizeMap[size].text,
          width: width || '100%'
        }
      case 'card':
        return {
          height: height || sizeMap[size].card,
          width: width || '100%'
        }
      case 'avatar':
        const avatarSize = sizeMap[size].spinner
        return {
          height: avatarSize,
          width: avatarSize,
          borderRadius: '50%'
        }
      case 'button':
        return {
          height: '2.5rem',
          width: width || '6rem'
        }
      default:
        return {
          height: height || sizeMap[size].text,
          width: width || '100%'
        }
    }
  }

  const styles = getTypeStyles()

  if (type === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)} aria-label={ariaLabel}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(baseClass, roundedClass)}
            style={{
              ...styles,
              width: index === lines - 1 ? '75%' : styles.width
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(baseClass, roundedClass, className)}
      style={styles}
      aria-label={ariaLabel}
    />
  )
})

Skeleton.displayName = 'Skeleton'

// Shimmer Effect Component
interface ShimmerProps extends BaseLoadingProps {
  children: React.ReactNode
}

export const Shimmer = React.memo<ShimmerProps>(({ children, className }) => {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      {children}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        {...loadingAnimations.shimmer}
      />
    </div>
  )
})

Shimmer.displayName = 'Shimmer'

// Dots Loading Component
interface DotsProps extends BaseLoadingProps {
  size?: LoadingSize
  count?: number
}

export const Dots = React.memo<DotsProps>(({ 
  size = 'md', 
  count = 3, 
  className,
  'aria-label': ariaLabel = 'Carregando...'
}) => {
  const dotSize = {
    sm: 'h-1 w-1',
    md: 'h-2 w-2',
    lg: 'h-3 w-3',
    xl: 'h-4 w-4'
  }[size]

  return (
    <div 
      className={cn('flex items-center space-x-1', className)}
      role="status"
      aria-label={ariaLabel}
    >
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          className={cn('bg-current rounded-full', dotSize)}
          {...loadingAnimations.dots}
          style={{
            animationDelay: `${index * 0.2}s`
          }}
        />
      ))}
    </div>
  )
})

Dots.displayName = 'Dots'

// ===== COMPOSITE COMPONENTS =====

// Loading Card Skeleton
interface LoadingCardProps extends BaseLoadingProps {
  showHeader?: boolean
  showFooter?: boolean
  lines?: number
}

export const LoadingCard = React.memo<LoadingCardProps>(({
  showHeader = true,
  showFooter = false,
  lines = 3,
  className
}) => {
  return (
    <Card className={cn('animate-pulse', className)}>
      {showHeader && (
        <CardHeader className="space-y-2">
          <Skeleton type="text" width="60%" />
          <Skeleton type="text" width="40%" size="sm" />
        </CardHeader>
      )}
      <CardContent className="space-y-3">
        <Skeleton type="text" lines={lines} />
        {showFooter && (
          <div className="flex justify-between items-center pt-4">
            <Skeleton type="button" width="5rem" />
            <Skeleton type="text" width="4rem" size="sm" />
          </div>
        )}
      </CardContent>
    </Card>
  )
})

LoadingCard.displayName = 'LoadingCard'

// Loading Table Skeleton
interface LoadingTableProps extends BaseLoadingProps {
  rows?: number
  columns?: number
}

export const LoadingTable = React.memo<LoadingTableProps>(({
  rows = 5,
  columns = 4,
  className
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={`header-${index}`} type="text" width="80%" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div 
          key={`row-${rowIndex}`}
          className="grid gap-4" 
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton 
              key={`cell-${rowIndex}-${colIndex}`} 
              type="text" 
              width={colIndex === 0 ? '90%' : '70%'} 
            />
          ))}
        </div>
      ))}
    </div>
  )
})

LoadingTable.displayName = 'LoadingTable'

// ===== HIGHER-ORDER COMPONENTS =====

// Loading Wrapper with Delay
interface LoadingWrapperProps {
  isLoading: boolean
  children: React.ReactNode
  fallback?: React.ReactNode
  delay?: number
  className?: string
}

export const LoadingWrapper = React.memo<LoadingWrapperProps>(({
  isLoading,
  children,
  fallback = <Spinner />,
  delay = LOADING_CONFIG.defaultDelay,
  className
}) => {
  const [showLoading, setShowLoading] = React.useState(false)

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout

    if (isLoading) {
      timeoutId = setTimeout(() => {
        setShowLoading(true)
      }, delay)
    } else {
      setShowLoading(false)
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [isLoading, delay])

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {isLoading && showLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {fallback}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

LoadingWrapper.displayName = 'LoadingWrapper'

// Error Boundary with Retry
interface LoadingErrorProps {
  error?: Error | null
  onRetry?: () => void
  className?: string
}

export const LoadingError = React.memo<LoadingErrorProps>(({
  error,
  onRetry,
  className
}) => {
  const [isRetrying, setIsRetrying] = React.useState(false)

  const handleRetry = async () => {
    if (!onRetry) return
    
    setIsRetrying(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, LOADING_CONFIG.retryDelay))
      onRetry()
    } finally {
      setIsRetrying(false)
    }
  }

  return (
    <Card className={cn('border-destructive/20', className)}>
      <CardContent className="p-6 text-center">
        <WifiOff className="h-8 w-8 mx-auto mb-4 text-destructive" />
        <h3 className="font-semibold mb-2">Erro ao carregar</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {error?.message || 'Algo deu errado. Tente novamente.'}
        </p>
        {onRetry && (
          <Button 
            onClick={handleRetry} 
            disabled={isRetrying}
            variant="outline"
            size="sm"
          >
            {isRetrying ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Tentando novamente...
              </>
            ) : (
              <>
                <Wifi className="h-4 w-4 mr-2" />
                Tentar novamente
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
})

LoadingError.displayName = 'LoadingError'

// ===== HOOKS =====

// Loading state hook with automatic error handling
interface UseLoadingOptions {
  delay?: number
  retryCount?: number
}

export const useLoading = (options: UseLoadingOptions = {}) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)
  const [retryCount, setRetryCount] = React.useState(0)
  
  const { delay = LOADING_CONFIG.defaultDelay, retryCount: maxRetries = 3 } = options

  const startLoading = React.useCallback(() => {
    setIsLoading(true)
    setError(null)
  }, [])

  const stopLoading = React.useCallback(() => {
    setIsLoading(false)
  }, [])

  const setLoadingError = React.useCallback((error: Error) => {
    setError(error)
    setIsLoading(false)
  }, [])

  const retry = React.useCallback(() => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1)
      setError(null)
      setIsLoading(true)
    }
  }, [retryCount, maxRetries])

  const reset = React.useCallback(() => {
    setIsLoading(false)
    setError(null)
    setRetryCount(0)
  }, [])

  return {
    isLoading,
    error,
    retryCount,
    canRetry: retryCount < maxRetries,
    startLoading,
    stopLoading,
    setLoadingError,
    retry,
    reset
  }
}