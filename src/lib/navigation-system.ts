/**
 * Modern Navigation System
 * Arquitetura baseada em benchmarks da indústria:
 * - Type-safe routing
 * - Breadcrumb generation
 * - Permission-based navigation
 * - Analytics integration
 * - SEO optimization
 */

import React, { useCallback, useMemo } from 'react'
import { useRouter, usePathname } from 'next/navigation'

// ===== TYPES =====
export interface RouteConfig {
  path: string
  title: string
  description?: string
  icon?: string
  badge?: string | number
  permissions?: string[]
  roles?: string[]
  isPublic?: boolean
  isExact?: boolean
  children?: RouteConfig[]
  metadata?: {
    keywords?: string[]
    ogImage?: string
    canonical?: string
    noIndex?: boolean
  }
  analytics?: {
    category?: string
    action?: string
    label?: string
  }
}

export interface BreadcrumbItem {
  title: string
  href?: string
  isActive: boolean
  icon?: string
}

export interface NavigationState {
  currentPath: string
  previousPath?: string
  breadcrumbs: BreadcrumbItem[]
  activeRoute?: RouteConfig
  canNavigate: (path: string) => boolean
}

export interface User {
  id: string
  roles: string[]
  permissions: string[]
}

// ===== ROUTE DEFINITIONS =====
export const ROUTES: RouteConfig[] = [
  {
    path: '/',
    title: 'Início',
    description: 'Página inicial do sistema',
    icon: 'Home',
    isPublic: true,
    metadata: {
      keywords: ['início', 'home', 'principal'],
      ogImage: '/images/og-home.jpg'
    },
    analytics: {
      category: 'Navigation',
      action: 'Visit',
      label: 'Home'
    }
  },
  {
    path: '/dashboard',
    title: 'Dashboard',
    description: 'Painel principal do usuário',
    icon: 'LayoutDashboard',
    permissions: ['dashboard.view'],
    children: [
      {
        path: '/dashboard/overview',
        title: 'Visão Geral',
        description: 'Resumo das atividades',
        icon: 'BarChart3',
        permissions: ['dashboard.overview']
      },
      {
        path: '/dashboard/analytics',
        title: 'Analytics',
        description: 'Análises e relatórios',
        icon: 'TrendingUp',
        permissions: ['analytics.view']
      },
      {
        path: '/dashboard/settings',
        title: 'Configurações',
        description: 'Configurações do dashboard',
        icon: 'Settings',
        permissions: ['dashboard.settings']
      }
    ]
  },
  {
    path: '/appointments',
    title: 'Agendamentos',
    description: 'Gerenciar agendamentos',
    icon: 'Calendar',
    permissions: ['appointments.view'],
    children: [
      {
        path: '/appointments/list',
        title: 'Lista',
        description: 'Lista de agendamentos',
        icon: 'List'
      },
      {
        path: '/appointments/calendar',
        title: 'Calendário',
        description: 'Visualização em calendário',
        icon: 'CalendarDays'
      },
      {
        path: '/appointments/new',
        title: 'Novo Agendamento',
        description: 'Criar novo agendamento',
        icon: 'Plus',
        permissions: ['appointments.create']
      }
    ]
  },
  {
    path: '/patients',
    title: 'Pacientes',
    description: 'Gerenciar pacientes',
    icon: 'Users',
    permissions: ['patients.view'],
    children: [
      {
        path: '/patients/list',
        title: 'Lista',
        description: 'Lista de pacientes',
        icon: 'List'
      },
      {
        path: '/patients/new',
        title: 'Novo Paciente',
        description: 'Cadastrar novo paciente',
        icon: 'UserPlus',
        permissions: ['patients.create']
      }
    ]
  },
  {
    path: '/reports',
    title: 'Relatórios',
    description: 'Relatórios e análises',
    icon: 'FileText',
    permissions: ['reports.view'],
    children: [
      {
        path: '/reports/financial',
        title: 'Financeiro',
        description: 'Relatórios financeiros',
        icon: 'DollarSign',
        permissions: ['reports.financial']
      },
      {
        path: '/reports/clinical',
        title: 'Clínico',
        description: 'Relatórios clínicos',
        icon: 'Stethoscope',
        permissions: ['reports.clinical']
      }
    ]
  },
  {
    path: '/admin',
    title: 'Administração',
    description: 'Painel administrativo',
    icon: 'Shield',
    permissions: ['admin.access'],
    roles: ['admin', 'super_admin'],
    children: [
      {
        path: '/admin/dashboard',
        title: 'Dashboard Admin',
        description: 'Painel administrativo principal',
        icon: 'LayoutDashboard',
        permissions: ['admin.dashboard']
      },
      {
        path: '/admin/users',
        title: 'Usuários',
        description: 'Gerenciar usuários',
        icon: 'Users',
        permissions: ['admin.users']
      },
      {
        path: '/admin/lawyers',
        title: 'Advogados',
        description: 'Gerenciar advogados',
        icon: 'Scale',
        permissions: ['admin.lawyers']
      },
      {
        path: '/admin/appointments',
        title: 'Agendamentos',
        description: 'Gerenciar agendamentos',
        icon: 'Calendar',
        permissions: ['admin.appointments']
      },
      {
        path: '/admin/reviews',
        title: 'Avaliações',
        description: 'Moderar avaliações',
        icon: 'Star',
        permissions: ['admin.reviews']
      },
      {
        path: '/admin/settings',
        title: 'Configurações Admin',
        description: 'Configurações administrativas',
        icon: 'Settings',
        permissions: ['admin.settings']
      }
    ]
  },
  {
    path: '/settings',
    title: 'Configurações',
    description: 'Configurações do sistema',
    icon: 'Settings',
    permissions: ['settings.view'],
    children: [
      {
        path: '/settings/profile',
        title: 'Perfil',
        description: 'Configurações do perfil',
        icon: 'User'
      },
      {
        path: '/settings/notifications',
        title: 'Notificações',
        description: 'Configurações de notificações',
        icon: 'Bell'
      },
      {
        path: '/settings/security',
        title: 'Segurança',
        description: 'Configurações de segurança',
        icon: 'Shield'
      },
      {
        path: '/settings/billing',
        title: 'Faturamento',
        description: 'Configurações de faturamento',
        icon: 'CreditCard',
        permissions: ['billing.view']
      }
    ]
  },
  {
    path: '/help',
    title: 'Ajuda',
    description: 'Central de ajuda',
    icon: 'HelpCircle',
    isPublic: true,
    children: [
      {
        path: '/help/docs',
        title: 'Documentação',
        description: 'Documentação do sistema',
        icon: 'Book'
      },
      {
        path: '/help/contact',
        title: 'Contato',
        description: 'Entre em contato',
        icon: 'MessageCircle'
      },
      {
        path: '/help/faq',
        title: 'FAQ',
        description: 'Perguntas frequentes',
        icon: 'MessageSquare'
      }
    ]
  }
]

// ===== UTILITY FUNCTIONS =====

// Flatten routes for easier searching
export const flattenRoutes = (routes: RouteConfig[]): RouteConfig[] => {
  const flattened: RouteConfig[] = []
  
  const flatten = (routeList: RouteConfig[]) => {
    routeList.forEach(route => {
      flattened.push(route)
      if (route.children) {
        flatten(route.children)
      }
    })
  }
  
  flatten(routes)
  return flattened
}

// Find route by path
export const findRouteByPath = (path: string, routes: RouteConfig[] = ROUTES): RouteConfig | undefined => {
  const flatRoutes = flattenRoutes(routes)
  return flatRoutes.find(route => {
    if (route.isExact) {
      return route.path === path
    }
    return path.startsWith(route.path)
  })
}

// Generate breadcrumbs from path
export const generateBreadcrumbs = (path: string, routes: RouteConfig[] = ROUTES): BreadcrumbItem[] => {
  const breadcrumbs: BreadcrumbItem[] = []
  const pathSegments = path.split('/').filter(Boolean)
  
  let currentPath = ''
  
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const route = findRouteByPath(currentPath, routes)
    
    if (route) {
      breadcrumbs.push({
        title: route.title,
        href: currentPath,
        isActive: index === pathSegments.length - 1,
        icon: route.icon
      })
    }
  })
  
  // Add home if not present and not on home page
  if (path !== '/' && breadcrumbs.length > 0 && breadcrumbs[0].href !== '/') {
    breadcrumbs.unshift({
      title: 'Início',
      href: '/',
      isActive: false,
      icon: 'Home'
    })
  }
  
  return breadcrumbs
}

// Check if user has permission to access route
export const hasPermission = (
  route: RouteConfig,
  user?: User | null
): boolean => {
  // Public routes are always accessible
  if (route.isPublic) return true
  
  // No user means no access to protected routes
  if (!user) return false
  
  // Check role-based access
  if (route.roles && route.roles.length > 0) {
    const hasRole = route.roles.some(role => user.roles.includes(role))
    if (!hasRole) return false
  }
  
  // Check permission-based access
  if (route.permissions && route.permissions.length > 0) {
    const hasPermission = route.permissions.some(permission => 
      user.permissions.includes(permission)
    )
    if (!hasPermission) return false
  }
  
  return true
}

// Filter routes based on user permissions
export const getAccessibleRoutes = (
  routes: RouteConfig[],
  user?: User | null
): RouteConfig[] => {
  return routes
    .filter(route => hasPermission(route, user))
    .map(route => ({
      ...route,
      children: route.children ? getAccessibleRoutes(route.children, user) : undefined
    }))
}

// ===== NAVIGATION HOOKS =====

// Main navigation hook
export const useNavigation = (user?: User | null) => {
  const router = useRouter()
  const pathname = usePathname()
  
  // Get accessible routes
  const accessibleRoutes = useMemo(() => 
    getAccessibleRoutes(ROUTES, user), 
    [user]
  )
  
  // Get current route
  const activeRoute = useMemo(() => 
    findRouteByPath(pathname, accessibleRoutes), 
    [pathname, accessibleRoutes]
  )
  
  // Generate breadcrumbs
  const breadcrumbs = useMemo(() => 
    generateBreadcrumbs(pathname, accessibleRoutes), 
    [pathname, accessibleRoutes]
  )
  
  // Check if user can navigate to a path
  const canNavigate = useCallback((path: string) => {
    const route = findRouteByPath(path, ROUTES)
    return route ? hasPermission(route, user) : false
  }, [user])
  
  // Navigate with permission check
  const navigateTo = useCallback((path: string, options?: { replace?: boolean }) => {
    if (!canNavigate(path)) {
      console.warn(`Navigation to ${path} denied - insufficient permissions`)
      return false
    }
    
    // Track navigation analytics
    const route = findRouteByPath(path, ROUTES)
    if (route?.analytics) {
      // Here you would integrate with your analytics service
      console.log('Analytics:', route.analytics)
    }
    
    if (options?.replace) {
      router.replace(path)
    } else {
      router.push(path)
    }
    
    return true
  }, [router, canNavigate])
  
  // Go back with fallback
  const goBack = useCallback((fallbackPath = '/dashboard') => {
    if (window.history.length > 1) {
      router.back()
    } else {
      navigateTo(fallbackPath)
    }
  }, [router, navigateTo])
  
  // Navigate to parent route
  const goToParent = useCallback(() => {
    const pathSegments = pathname.split('/').filter(Boolean)
    if (pathSegments.length > 1) {
      pathSegments.pop()
      const parentPath = '/' + pathSegments.join('/')
      navigateTo(parentPath)
    }
  }, [pathname, navigateTo])
  
  return {
    // State
    currentPath: pathname,
    activeRoute,
    breadcrumbs,
    accessibleRoutes,
    
    // Actions
    navigateTo,
    goBack,
    goToParent,
    canNavigate,
    
    // Utilities
    isActive: (path: string) => pathname === path,
    isActiveParent: (path: string) => pathname.startsWith(path) && pathname !== path,
    getRouteTitle: (path: string) => findRouteByPath(path, accessibleRoutes)?.title,
    getRouteDescription: (path: string) => findRouteByPath(path, accessibleRoutes)?.description
  }
}

// Breadcrumb hook
export const useBreadcrumbs = () => {
  const pathname = usePathname()
  
  return useMemo(() => 
    generateBreadcrumbs(pathname), 
    [pathname]
  )
}

// Route metadata hook for SEO
export const useRouteMetadata = () => {
  const pathname = usePathname()
  
  const route = useMemo(() => 
    findRouteByPath(pathname), 
    [pathname]
  )
  
  return {
    title: route?.title,
    description: route?.description,
    keywords: route?.metadata?.keywords,
    ogImage: route?.metadata?.ogImage,
    canonical: route?.metadata?.canonical,
    noIndex: route?.metadata?.noIndex
  }
}

// ===== NAVIGATION GUARDS =====

// Route guard component
export const RouteGuard: React.FC<{
  children: React.ReactNode
  requiredPermissions?: string[]
  requiredRoles?: string[]
  fallbackPath?: string
  user?: User | null
}> = ({
  children,
  requiredPermissions = [],
  requiredRoles = [],
  fallbackPath = '/login',
  user
}) => {
  const { navigateTo } = useNavigation(user)
  const pathname = usePathname()
  
  React.useEffect(() => {
    // Check if user is authenticated for protected routes
    if (!user && requiredPermissions.length > 0) {
      navigateTo(fallbackPath)
      return
    }
    
    // Check role requirements
    if (requiredRoles.length > 0 && user) {
      const hasRequiredRole = requiredRoles.some(role => user.roles.includes(role))
      if (!hasRequiredRole) {
        navigateTo('/unauthorized')
        return
      }
    }
    
    // Check permission requirements
    if (requiredPermissions.length > 0 && user) {
      const hasRequiredPermission = requiredPermissions.some(permission => 
        user.permissions.includes(permission)
      )
      if (!hasRequiredPermission) {
        navigateTo('/unauthorized')
        return
      }
    }
  }, [user, pathname, requiredPermissions, requiredRoles, navigateTo, fallbackPath])
  
  // Show loading or unauthorized state
  if (!user && requiredPermissions.length > 0) {
    return null // or loading component
  }
  
  return React.createElement(React.Fragment, null, children)
}

// ===== EXPORTS =====
export {
  ROUTES,
  flattenRoutes,
  findRouteByPath,
  generateBreadcrumbs,
  hasPermission,
  getAccessibleRoutes,
  useNavigation,
  useBreadcrumbs,
  useRouteMetadata,
  RouteGuard
}