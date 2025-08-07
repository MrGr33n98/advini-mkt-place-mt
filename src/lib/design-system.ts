/**
 * Design System - Tokens e Padrões Consistentes
 * Baseado em benchmarks da indústria (Material Design, Ant Design, Chakra UI)
 */

// ===== SPACING SYSTEM =====
export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '0.75rem',    // 12px
  lg: '1rem',       // 16px
  xl: '1.5rem',     // 24px
  '2xl': '2rem',    // 32px
  '3xl': '3rem',    // 48px
  '4xl': '4rem',    // 64px
} as const

// ===== TYPOGRAPHY SCALE =====
export const typography = {
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },
  weights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeights: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  }
} as const

// ===== COLOR SYSTEM =====
export const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    900: '#1e3a8a',
  },
  semantic: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  neutral: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  }
} as const

// ===== ANIMATION SYSTEM =====
export const animations = {
  durations: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
  },
  easings: {
    easeOut: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0.0, 1, 1)',
    easeInOut: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  }
} as const

// ===== COMPONENT VARIANTS =====
export const componentVariants = {
  button: {
    sizes: {
      sm: {
        height: '2rem',
        padding: '0 0.75rem',
        fontSize: typography.sizes.sm,
      },
      md: {
        height: '2.5rem',
        padding: '0 1rem',
        fontSize: typography.sizes.base,
      },
      lg: {
        height: '3rem',
        padding: '0 1.5rem',
        fontSize: typography.sizes.lg,
      },
    },
    variants: {
      primary: {
        backgroundColor: colors.primary[600],
        color: 'white',
        border: 'none',
      },
      secondary: {
        backgroundColor: 'transparent',
        color: colors.primary[600],
        border: `1px solid ${colors.primary[600]}`,
      },
      ghost: {
        backgroundColor: 'transparent',
        color: colors.neutral[700],
        border: 'none',
      },
    }
  },
  card: {
    variants: {
      elevated: {
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        border: `1px solid ${colors.neutral[200]}`,
      },
      outlined: {
        boxShadow: 'none',
        border: `1px solid ${colors.neutral[200]}`,
      },
      flat: {
        boxShadow: 'none',
        border: 'none',
        backgroundColor: colors.neutral[50],
      },
    }
  }
} as const

// ===== BREAKPOINTS =====
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

// ===== Z-INDEX SCALE =====
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const

// ===== UTILITY FUNCTIONS =====
export const utils = {
  // Função para criar classes CSS consistentes
  createClassName: (...classes: (string | undefined | false)[]) => {
    return classes.filter(Boolean).join(' ')
  },
  
  // Função para aplicar variantes de componente
  applyVariant: <T extends Record<string, any>>(
    variants: T,
    variant: keyof T,
    size?: string
  ) => {
    const baseStyles = variants[variant] || {}
    if (size && variants.sizes?.[size]) {
      return { ...baseStyles, ...variants.sizes[size] }
    }
    return baseStyles
  },
  
  // Função para responsividade
  responsive: (value: string | Record<string, string>) => {
    if (typeof value === 'string') return value
    
    const breakpointKeys = Object.keys(breakpoints)
    return breakpointKeys
      .filter(bp => value[bp])
      .map(bp => `${bp}:${value[bp]}`)
      .join(' ')
  }
}

// ===== COMPONENT COMPOSITION PATTERNS =====
export const patterns = {
  // Stack pattern para layout vertical
  stack: (gap: keyof typeof spacing = 'md') => ({
    display: 'flex',
    flexDirection: 'column' as const,
    gap: spacing[gap],
  }),
  
  // Inline pattern para layout horizontal
  inline: (gap: keyof typeof spacing = 'md') => ({
    display: 'flex',
    alignItems: 'center',
    gap: spacing[gap],
  }),
  
  // Center pattern para centralização
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Grid pattern responsivo
  grid: (columns: number | Record<string, number>) => {
    if (typeof columns === 'number') {
      return {
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: spacing.lg,
      }
    }
    
    // Responsivo
    const breakpointKeys = Object.keys(breakpoints)
    const gridClasses = breakpointKeys
      .filter(bp => columns[bp])
      .map(bp => `${bp}:grid-cols-${columns[bp]}`)
      .join(' ')
    
    return `grid gap-4 ${gridClasses}`
  }
}

export type DesignTokens = {
  spacing: typeof spacing
  typography: typeof typography
  colors: typeof colors
  animations: typeof animations
  breakpoints: typeof breakpoints
  zIndex: typeof zIndex
}