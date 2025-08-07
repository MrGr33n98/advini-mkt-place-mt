'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { useResizeOptimization } from '@/hooks/use-performance'

// Breakpoints customizados
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

type Breakpoint = keyof typeof breakpoints

// Hook para detecção de breakpoint atual
export function useBreakpoint() {
  const { width } = useResizeOptimization()
  
  const currentBreakpoint = useMemo((): Breakpoint => {
    if (width >= breakpoints['2xl']) return '2xl'
    if (width >= breakpoints.xl) return 'xl'
    if (width >= breakpoints.lg) return 'lg'
    if (width >= breakpoints.md) return 'md'
    if (width >= breakpoints.sm) return 'sm'
    return 'xs'
  }, [width])

  const isMobile = currentBreakpoint === 'xs' || currentBreakpoint === 'sm'
  const isTablet = currentBreakpoint === 'md'
  const isDesktop = currentBreakpoint === 'lg' || currentBreakpoint === 'xl' || currentBreakpoint === '2xl'

  return {
    currentBreakpoint,
    width,
    isMobile,
    isTablet,
    isDesktop,
    isAtLeast: (breakpoint: Breakpoint) => width >= breakpoints[breakpoint],
    isBelow: (breakpoint: Breakpoint) => width < breakpoints[breakpoint]
  }
}

// Componente para renderização condicional baseada em breakpoint
interface ResponsiveProps {
  children: React.ReactNode
  show?: Breakpoint[]
  hide?: Breakpoint[]
  className?: string
}

export function Responsive({ children, show, hide, className }: ResponsiveProps) {
  const { currentBreakpoint } = useBreakpoint()

  const shouldShow = useMemo(() => {
    if (show && !show.includes(currentBreakpoint)) return false
    if (hide && hide.includes(currentBreakpoint)) return false
    return true
  }, [currentBreakpoint, show, hide])

  if (!shouldShow) return null

  return <div className={className}>{children}</div>
}

// Grid responsivo adaptativo
interface ResponsiveGridProps {
  children: React.ReactNode
  cols?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
    '2xl'?: number
  }
  gap?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
    '2xl'?: number
  }
  className?: string
}

export function ResponsiveGrid({ children, cols, gap, className }: ResponsiveGridProps) {
  const { currentBreakpoint } = useBreakpoint()

  const gridCols = useMemo(() => {
    if (!cols) return 'grid-cols-1'
    
    const colsForBreakpoint = cols[currentBreakpoint] || 
                             cols.lg || 
                             cols.md || 
                             cols.sm || 
                             cols.xs || 
                             1

    return `grid-cols-${colsForBreakpoint}`
  }, [cols, currentBreakpoint])

  const gridGap = useMemo(() => {
    if (!gap) return 'gap-4'
    
    const gapForBreakpoint = gap[currentBreakpoint] || 
                            gap.lg || 
                            gap.md || 
                            gap.sm || 
                            gap.xs || 
                            4

    return `gap-${gapForBreakpoint}`
  }, [gap, currentBreakpoint])

  return (
    <div className={cn('grid', gridCols, gridGap, className)}>
      {children}
    </div>
  )
}

// Container responsivo com padding adaptativo
interface ResponsiveContainerProps {
  children: React.ReactNode
  maxWidth?: Breakpoint
  padding?: {
    xs?: string
    sm?: string
    md?: string
    lg?: string
    xl?: string
    '2xl'?: string
  }
  className?: string
}

export function ResponsiveContainer({ 
  children, 
  maxWidth = '2xl', 
  padding,
  className 
}: ResponsiveContainerProps) {
  const { currentBreakpoint } = useBreakpoint()

  const containerPadding = useMemo(() => {
    if (!padding) return 'px-4 sm:px-6 lg:px-8'
    
    const paddingForBreakpoint = padding[currentBreakpoint] || 
                                padding.lg || 
                                padding.md || 
                                padding.sm || 
                                padding.xs || 
                                'px-4'

    return paddingForBreakpoint
  }, [padding, currentBreakpoint])

  const maxWidthClass = `max-w-screen-${maxWidth}`

  return (
    <div className={cn('mx-auto w-full', maxWidthClass, containerPadding, className)}>
      {children}
    </div>
  )
}

// Texto responsivo com tamanhos adaptativos
interface ResponsiveTextProps {
  children: React.ReactNode
  size?: {
    xs?: string
    sm?: string
    md?: string
    lg?: string
    xl?: string
    '2xl'?: string
  }
  weight?: {
    xs?: string
    sm?: string
    md?: string
    lg?: string
    xl?: string
    '2xl'?: string
  }
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div'
}

export function ResponsiveText({ 
  children, 
  size, 
  weight,
  className,
  as: Component = 'div'
}: ResponsiveTextProps) {
  const { currentBreakpoint } = useBreakpoint()

  const textSize = useMemo(() => {
    if (!size) return 'text-base'
    
    const sizeForBreakpoint = size[currentBreakpoint] || 
                             size.lg || 
                             size.md || 
                             size.sm || 
                             size.xs || 
                             'text-base'

    return sizeForBreakpoint
  }, [size, currentBreakpoint])

  const textWeight = useMemo(() => {
    if (!weight) return ''
    
    const weightForBreakpoint = weight[currentBreakpoint] || 
                               weight.lg || 
                               weight.md || 
                               weight.sm || 
                               weight.xs || 
                               ''

    return weightForBreakpoint
  }, [weight, currentBreakpoint])

  return (
    <Component className={cn(textSize, textWeight, className)}>
      {children}
    </Component>
  )
}

// Espaçamento responsivo
interface ResponsiveSpacingProps {
  children: React.ReactNode
  margin?: {
    xs?: string
    sm?: string
    md?: string
    lg?: string
    xl?: string
    '2xl'?: string
  }
  padding?: {
    xs?: string
    sm?: string
    md?: string
    lg?: string
    xl?: string
    '2xl'?: string
  }
  className?: string
}

export function ResponsiveSpacing({ 
  children, 
  margin, 
  padding,
  className 
}: ResponsiveSpacingProps) {
  const { currentBreakpoint } = useBreakpoint()

  const marginClass = useMemo(() => {
    if (!margin) return ''
    
    const marginForBreakpoint = margin[currentBreakpoint] || 
                               margin.lg || 
                               margin.md || 
                               margin.sm || 
                               margin.xs || 
                               ''

    return marginForBreakpoint
  }, [margin, currentBreakpoint])

  const paddingClass = useMemo(() => {
    if (!padding) return ''
    
    const paddingForBreakpoint = padding[currentBreakpoint] || 
                                padding.lg || 
                                padding.md || 
                                padding.sm || 
                                padding.xs || 
                                ''

    return paddingForBreakpoint
  }, [padding, currentBreakpoint])

  return (
    <div className={cn(marginClass, paddingClass, className)}>
      {children}
    </div>
  )
}

// Layout de stack responsivo
interface ResponsiveStackProps {
  children: React.ReactNode
  direction?: {
    xs?: 'row' | 'col'
    sm?: 'row' | 'col'
    md?: 'row' | 'col'
    lg?: 'row' | 'col'
    xl?: 'row' | 'col'
    '2xl'?: 'row' | 'col'
  }
  align?: {
    xs?: string
    sm?: string
    md?: string
    lg?: string
    xl?: string
    '2xl'?: string
  }
  justify?: {
    xs?: string
    sm?: string
    md?: string
    lg?: string
    xl?: string
    '2xl'?: string
  }
  gap?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
    '2xl'?: number
  }
  className?: string
}

export function ResponsiveStack({ 
  children, 
  direction, 
  align, 
  justify,
  gap,
  className 
}: ResponsiveStackProps) {
  const { currentBreakpoint } = useBreakpoint()

  const flexDirection = useMemo(() => {
    if (!direction) return 'flex-col'
    
    const directionForBreakpoint = direction[currentBreakpoint] || 
                                  direction.lg || 
                                  direction.md || 
                                  direction.sm || 
                                  direction.xs || 
                                  'col'

    return `flex-${directionForBreakpoint}`
  }, [direction, currentBreakpoint])

  const alignItems = useMemo(() => {
    if (!align) return ''
    
    const alignForBreakpoint = align[currentBreakpoint] || 
                              align.lg || 
                              align.md || 
                              align.sm || 
                              align.xs || 
                              ''

    return alignForBreakpoint
  }, [align, currentBreakpoint])

  const justifyContent = useMemo(() => {
    if (!justify) return ''
    
    const justifyForBreakpoint = justify[currentBreakpoint] || 
                                justify.lg || 
                                justify.md || 
                                justify.sm || 
                                justify.xs || 
                                ''

    return justifyForBreakpoint
  }, [justify, currentBreakpoint])

  const gapClass = useMemo(() => {
    if (!gap) return 'gap-4'
    
    const gapForBreakpoint = gap[currentBreakpoint] || 
                            gap.lg || 
                            gap.md || 
                            gap.sm || 
                            gap.xs || 
                            4

    return `gap-${gapForBreakpoint}`
  }, [gap, currentBreakpoint])

  return (
    <div className={cn(
      'flex', 
      flexDirection, 
      alignItems, 
      justifyContent, 
      gapClass, 
      className
    )}>
      {children}
    </div>
  )
}

// Hook para orientação do dispositivo
export function useDeviceOrientation() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait')

  useEffect(() => {
    const updateOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape')
    }

    updateOrientation()
    window.addEventListener('resize', updateOrientation)
    window.addEventListener('orientationchange', updateOrientation)

    return () => {
      window.removeEventListener('resize', updateOrientation)
      window.removeEventListener('orientationchange', updateOrientation)
    }
  }, [])

  return orientation
}

// Componente para imagens responsivas
interface ResponsiveImageProps {
  src: string
  alt: string
  sizes?: {
    xs?: string
    sm?: string
    md?: string
    lg?: string
    xl?: string
    '2xl'?: string
  }
  className?: string
  priority?: boolean
}

export function ResponsiveImage({ 
  src, 
  alt, 
  sizes,
  className,
  priority = false
}: ResponsiveImageProps) {
  const { currentBreakpoint } = useBreakpoint()

  const imageSize = useMemo(() => {
    if (!sizes) return 'w-full h-auto'
    
    const sizeForBreakpoint = sizes[currentBreakpoint] || 
                             sizes.lg || 
                             sizes.md || 
                             sizes.sm || 
                             sizes.xs || 
                             'w-full h-auto'

    return sizeForBreakpoint
  }, [sizes, currentBreakpoint])

  return (
    <img
      src={src}
      alt={alt}
      className={cn(imageSize, 'object-cover', className)}
      loading={priority ? 'eager' : 'lazy'}
    />
  )
}