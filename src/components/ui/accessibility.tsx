'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'

// Hook para gerenciar foco
export function useFocusManagement() {
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null)

  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [])

  const restoreFocus = useCallback(() => {
    if (focusedElement) {
      focusedElement.focus()
      setFocusedElement(null)
    }
  }, [focusedElement])

  const saveFocus = useCallback(() => {
    setFocusedElement(document.activeElement as HTMLElement)
  }, [])

  return { trapFocus, restoreFocus, saveFocus }
}

// Componente para anúncios de leitores de tela
interface ScreenReaderAnnouncementProps {
  message: string
  priority?: 'polite' | 'assertive'
  onAnnounce?: () => void
}

export function ScreenReaderAnnouncement({ 
  message, 
  priority = 'polite',
  onAnnounce 
}: ScreenReaderAnnouncementProps) {
  useEffect(() => {
    if (message) {
      onAnnounce?.()
    }
  }, [message, onAnnounce])

  return (
    <div
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  )
}

// Hook para navegação por teclado
export function useKeyboardNavigation(
  items: HTMLElement[],
  options: {
    loop?: boolean
    orientation?: 'horizontal' | 'vertical'
    onSelect?: (index: number) => void
  } = {}
) {
  const { loop = true, orientation = 'vertical', onSelect } = options
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const isVertical = orientation === 'vertical'
    const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight'
    const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft'

    switch (e.key) {
      case nextKey:
        e.preventDefault()
        setCurrentIndex(prev => {
          const next = prev + 1
          if (next >= items.length) {
            return loop ? 0 : prev
          }
          return next
        })
        break
      case prevKey:
        e.preventDefault()
        setCurrentIndex(prev => {
          const next = prev - 1
          if (next < 0) {
            return loop ? items.length - 1 : prev
          }
          return next
        })
        break
      case 'Home':
        e.preventDefault()
        setCurrentIndex(0)
        break
      case 'End':
        e.preventDefault()
        setCurrentIndex(items.length - 1)
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        onSelect?.(currentIndex)
        break
    }
  }, [items.length, loop, orientation, onSelect, currentIndex])

  useEffect(() => {
    if (items[currentIndex]) {
      items[currentIndex].focus()
    }
  }, [currentIndex, items])

  return { currentIndex, handleKeyDown }
}

// Componente Skip Link
interface SkipLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export function SkipLink({ href, children, className }: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4",
        "bg-primary text-primary-foreground px-4 py-2 rounded-md",
        "z-50 font-medium transition-all",
        className
      )}
    >
      {children}
    </a>
  )
}

// Componente para indicador de foco visível
interface FocusIndicatorProps {
  children: React.ReactNode
  className?: string
}

export function FocusIndicator({ children, className }: FocusIndicatorProps) {
  return (
    <div
      className={cn(
        "focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2",
        "focus-within:ring-offset-background rounded-md",
        className
      )}
    >
      {children}
    </div>
  )
}

// Hook para detecção de modo de alto contraste
export function useHighContrast() {
  const [isHighContrast, setIsHighContrast] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)')
    setIsHighContrast(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return isHighContrast
}

// Hook para detecção de movimento reduzido
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

// Componente para texto alternativo dinâmico
interface DynamicAltTextProps {
  src: string
  alt: string
  fallbackAlt?: string
  className?: string
}

export function AccessibleImage({ 
  src, 
  alt, 
  fallbackAlt = "Imagem não disponível",
  className 
}: DynamicAltTextProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <img
      src={src}
      alt={imageError ? fallbackAlt : alt}
      className={className}
      onError={() => setImageError(true)}
      onLoad={() => setImageError(false)}
    />
  )
}

// Componente para landmarks ARIA
interface LandmarkProps {
  role: 'main' | 'navigation' | 'banner' | 'contentinfo' | 'complementary' | 'region'
  label?: string
  children: React.ReactNode
  className?: string
}

export function Landmark({ role, label, children, className }: LandmarkProps) {
  return (
    <div
      role={role}
      aria-label={label}
      className={className}
    >
      {children}
    </div>
  )
}

// Hook para gerenciar estado de loading acessível
export function useAccessibleLoading(isLoading: boolean, loadingText = "Carregando...") {
  const [announcement, setAnnouncement] = useState("")

  useEffect(() => {
    if (isLoading) {
      setAnnouncement(loadingText)
    } else {
      setAnnouncement("Conteúdo carregado")
    }
  }, [isLoading, loadingText])

  return announcement
}

// Componente para botões acessíveis
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  loading?: boolean
  loadingText?: string
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function AccessibleButton({ 
  children, 
  loading = false, 
  loadingText = "Carregando...",
  variant = 'primary',
  className,
  disabled,
  ...props 
}: AccessibleButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      {...props}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-describedby={loading ? `${props.id}-loading` : undefined}
      className={cn(
        "relative focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "transition-all duration-200",
        {
          'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
          'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
          'hover:bg-accent hover:text-accent-foreground': variant === 'ghost'
        },
        className
      )}
    >
      {loading && (
        <span id={`${props.id}-loading`} className="sr-only">
          {loadingText}
        </span>
      )}
      <span aria-hidden={loading}>
        {children}
      </span>
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
        </span>
      )}
    </button>
  )
}

// Provider para configurações de acessibilidade
interface AccessibilityContextType {
  highContrast: boolean
  reducedMotion: boolean
  fontSize: 'small' | 'medium' | 'large'
  setFontSize: (size: 'small' | 'medium' | 'large') => void
}

const AccessibilityContext = React.createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const highContrast = useHighContrast()
  const reducedMotion = useReducedMotion()
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium')

  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', fontSize)
    document.documentElement.setAttribute('data-high-contrast', highContrast.toString())
    document.documentElement.setAttribute('data-reduced-motion', reducedMotion.toString())
  }, [fontSize, highContrast, reducedMotion])

  return (
    <AccessibilityContext.Provider value={{
      highContrast,
      reducedMotion,
      fontSize,
      setFontSize
    }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = React.useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider')
  }
  return context
}