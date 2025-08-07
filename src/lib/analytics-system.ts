/**
 * Modern Analytics & Tracking System
 * Arquitetura baseada em benchmarks da indústria:
 * - Privacy-first analytics
 * - GDPR/LGPD compliance
 * - Real-time tracking
 * - Custom events
 * - User journey mapping
 * - A/B testing
 * - Conversion tracking
 * - Performance analytics
 */

import React from 'react'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

// ===== TYPES =====
export interface AnalyticsEvent {
  id: string
  name: string
  category: string
  action: string
  label?: string
  value?: number
  properties: Record<string, any>
  timestamp: number
  sessionId: string
  userId?: string
  deviceInfo: DeviceInfo
  pageInfo: PageInfo
}

export interface DeviceInfo {
  userAgent: string
  platform: string
  language: string
  timezone: string
  screenResolution: string
  viewportSize: string
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

export interface PageInfo {
  url: string
  path: string
  title: string
  referrer: string
  queryParams: Record<string, string>
}

export interface UserSession {
  id: string
  userId?: string
  startTime: number
  endTime?: number
  duration?: number
  pageViews: number
  events: number
  bounced: boolean
  converted: boolean
  source: string
  medium: string
  campaign?: string
}

export interface ConversionGoal {
  id: string
  name: string
  type: 'page_view' | 'event' | 'custom'
  conditions: ConversionCondition[]
  value?: number
  enabled: boolean
}

export interface ConversionCondition {
  type: 'url' | 'event' | 'property'
  operator: 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than'
  value: string | number
}

export interface ABTest {
  id: string
  name: string
  description: string
  status: 'draft' | 'running' | 'paused' | 'completed'
  variants: ABVariant[]
  trafficAllocation: number
  startDate: Date
  endDate?: Date
  conversionGoals: string[]
  results?: ABTestResults
}

export interface ABVariant {
  id: string
  name: string
  description: string
  allocation: number
  changes: Record<string, any>
}

export interface ABTestResults {
  totalParticipants: number
  variantResults: Record<string, {
    participants: number
    conversions: number
    conversionRate: number
    confidence: number
  }>
}

export interface AnalyticsConfig {
  enabled: boolean
  debug: boolean
  anonymizeIp: boolean
  respectDnt: boolean
  cookieConsent: boolean
  sessionTimeout: number
  batchSize: number
  flushInterval: number
  endpoints: {
    events: string
    sessions: string
    conversions: string
  }
  integrations: {
    googleAnalytics?: {
      measurementId: string
      enabled: boolean
    }
    facebookPixel?: {
      pixelId: string
      enabled: boolean
    }
    hotjar?: {
      hjid: string
      enabled: boolean
    }
    mixpanel?: {
      token: string
      enabled: boolean
    }
  }
}

export interface AnalyticsState {
  // Configuration
  config: AnalyticsConfig
  
  // Session management
  currentSession: UserSession | null
  
  // Event queue
  eventQueue: AnalyticsEvent[]
  
  // Conversion goals
  conversionGoals: ConversionGoal[]
  
  // A/B tests
  abTests: ABTest[]
  currentVariants: Record<string, string>
  
  // Privacy
  hasConsent: boolean
  
  // Actions
  updateConfig: (config: Partial<AnalyticsConfig>) => void
  setConsent: (hasConsent: boolean) => void
  startSession: (userId?: string) => void
  endSession: () => void
  trackEvent: (event: Omit<AnalyticsEvent, 'id' | 'timestamp' | 'sessionId' | 'deviceInfo' | 'pageInfo'>) => void
  trackPageView: (path: string, title?: string) => void
  trackConversion: (goalId: string, value?: number) => void
  addConversionGoal: (goal: ConversionGoal) => void
  removeConversionGoal: (goalId: string) => void
  addABTest: (test: ABTest) => void
  assignVariant: (testId: string, variantId: string) => void
  flushEvents: () => void
}

// ===== CONSTANTS =====
export const DEFAULT_CONFIG: AnalyticsConfig = {
  enabled: true,
  debug: process.env.NODE_ENV === 'development',
  anonymizeIp: true,
  respectDnt: true,
  cookieConsent: false,
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  batchSize: 10,
  flushInterval: 5000, // 5 seconds
  endpoints: {
    events: '/api/analytics/events',
    sessions: '/api/analytics/sessions',
    conversions: '/api/analytics/conversions'
  },
  integrations: {}
}

export const EVENT_CATEGORIES = {
  PAGE: 'page',
  USER: 'user',
  ENGAGEMENT: 'engagement',
  CONVERSION: 'conversion',
  ERROR: 'error',
  PERFORMANCE: 'performance',
  FEATURE: 'feature'
} as const

export const EVENT_ACTIONS = {
  VIEW: 'view',
  CLICK: 'click',
  SUBMIT: 'submit',
  DOWNLOAD: 'download',
  SHARE: 'share',
  SEARCH: 'search',
  FILTER: 'filter',
  SORT: 'sort',
  LOGIN: 'login',
  LOGOUT: 'logout',
  REGISTER: 'register',
  PURCHASE: 'purchase',
  ADD_TO_CART: 'add_to_cart',
  REMOVE_FROM_CART: 'remove_from_cart',
  CHECKOUT: 'checkout',
  ERROR: 'error',
  LOAD: 'load'
} as const

// ===== UTILITY FUNCTIONS =====

// Generate unique ID
const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

// Get device information
const getDeviceInfo = (): DeviceInfo => {
  const userAgent = navigator.userAgent
  const platform = navigator.platform
  const language = navigator.language
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const screenResolution = `${screen.width}x${screen.height}`
  const viewportSize = `${window.innerWidth}x${window.innerHeight}`
  
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  const isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(userAgent)
  const isDesktop = !isMobile && !isTablet
  
  return {
    userAgent,
    platform,
    language,
    timezone,
    screenResolution,
    viewportSize,
    isMobile,
    isTablet,
    isDesktop
  }
}

// Get page information
const getPageInfo = (): PageInfo => {
  const url = window.location.href
  const path = window.location.pathname
  const title = document.title
  const referrer = document.referrer
  const queryParams = Object.fromEntries(new URLSearchParams(window.location.search))
  
  return {
    url,
    path,
    title,
    referrer,
    queryParams
  }
}

// Check Do Not Track
const isDntEnabled = (): boolean => {
  return navigator.doNotTrack === '1' || 
         (window as any).doNotTrack === '1' || 
         (navigator as any).msDoNotTrack === '1'
}

// Get UTM parameters
const getUtmParams = (): Record<string, string> => {
  const params = new URLSearchParams(window.location.search)
  const utmParams: Record<string, string> = {}
  
  for (const [key, value] of params) {
    if (key.startsWith('utm_')) {
      utmParams[key] = value
    }
  }
  
  return utmParams
}

// Hash function for A/B testing
const hashString = (str: string): number => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

// ===== ANALYTICS STORE =====
export const useAnalyticsStore = create<AnalyticsState>()(
  immer((set, get) => ({
    config: DEFAULT_CONFIG,
    currentSession: null,
    eventQueue: [],
    conversionGoals: [],
    abTests: [],
    currentVariants: {},
    hasConsent: false,
    
    updateConfig: (newConfig) => {
      set(state => {
        Object.assign(state.config, newConfig)
      })
    },
    
    setConsent: (hasConsent) => {
      set(state => {
        state.hasConsent = hasConsent
        state.config.cookieConsent = hasConsent
      })
    },
    
    startSession: (userId) => {
      const utmParams = getUtmParams()
      const session: UserSession = {
        id: generateId(),
        userId,
        startTime: Date.now(),
        pageViews: 0,
        events: 0,
        bounced: true,
        converted: false,
        source: utmParams.utm_source || 'direct',
        medium: utmParams.utm_medium || 'none',
        campaign: utmParams.utm_campaign
      }
      
      set(state => {
        state.currentSession = session
      })
    },
    
    endSession: () => {
      set(state => {
        if (state.currentSession) {
          state.currentSession.endTime = Date.now()
          state.currentSession.duration = state.currentSession.endTime - state.currentSession.startTime
        }
      })
    },
    
    trackEvent: (eventData) => {
      const { config, currentSession, hasConsent } = get()
      
      if (!config.enabled || (config.respectDnt && isDntEnabled()) || (!hasConsent && config.cookieConsent)) {
        return
      }
      
      if (!currentSession) {
        get().startSession()
      }
      
      const event: AnalyticsEvent = {
        ...eventData,
        id: generateId(),
        timestamp: Date.now(),
        sessionId: currentSession?.id || '',
        deviceInfo: getDeviceInfo(),
        pageInfo: getPageInfo()
      }
      
      set(state => {
        state.eventQueue.push(event)
        if (state.currentSession) {
          state.currentSession.events++
          if (state.currentSession.events > 1) {
            state.currentSession.bounced = false
          }
        }
      })
      
      // Check for conversions would be handled by trackConversion method
      
      // Auto-flush if batch size reached
      if (get().eventQueue.length >= config.batchSize) {
        get().flushEvents()
      }
    },
    
    trackPageView: (path, title) => {
      get().trackEvent({
        name: 'page_view',
        category: EVENT_CATEGORIES.PAGE,
        action: EVENT_ACTIONS.VIEW,
        label: path,
        properties: {
          path,
          title: title || document.title
        }
      })
      
      set(state => {
        if (state.currentSession) {
          state.currentSession.pageViews++
        }
      })
    },
    
    trackConversion: (goalId, value) => {
      const goal = get().conversionGoals.find(g => g.id === goalId)
      if (!goal || !goal.enabled) return
      
      get().trackEvent({
        name: 'conversion',
        category: EVENT_CATEGORIES.CONVERSION,
        action: 'convert',
        label: goal.name,
        value: value || goal.value,
        properties: {
          goalId,
          goalName: goal.name
        }
      })
      
      set(state => {
        if (state.currentSession) {
          state.currentSession.converted = true
        }
      })
    },
    
    addConversionGoal: (goal) => {
      set(state => {
        state.conversionGoals.push(goal)
      })
    },
    
    removeConversionGoal: (goalId) => {
      set(state => {
        state.conversionGoals = state.conversionGoals.filter(g => g.id !== goalId)
      })
    },
    
    addABTest: (test) => {
      set(state => {
        state.abTests.push(test)
      })
    },
    
    assignVariant: (testId, variantId) => {
      set(state => {
        state.currentVariants[testId] = variantId
      })
    },
    
    flushEvents: async () => {
      const { eventQueue, config } = get()
      if (eventQueue.length === 0) return
      
      const events = [...eventQueue]
      set(state => {
        state.eventQueue = []
      })
      
      try {
        await fetch(config.endpoints.events, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ events })
        })
        
        if (config.debug) {
          console.log('Analytics events sent:', events)
        }
      } catch (error) {
        console.error('Failed to send analytics events:', error)
        
        // Re-queue events on failure
        set(state => {
          state.eventQueue.unshift(...events)
        })
      }
    },
    
    // Helper method to check conversions
    checkConversions: (event: AnalyticsEvent) => {
      const { conversionGoals } = get()
      
      conversionGoals.forEach(goal => {
        if (!goal.enabled) return
        
        const isConverted = goal.conditions.every(condition => {
          switch (condition.type) {
            case 'url':
              return checkCondition(event.pageInfo.url, condition.operator, condition.value)
            case 'event':
              return event.name === condition.value
            case 'property':
              const propertyValue = event.properties[condition.value as string]
              return propertyValue !== undefined
            default:
              return false
          }
        })
        
        if (isConverted) {
          get().trackConversion(goal.id, goal.value)
        }
      })
    }
  }))
)

// Helper function to check conditions
const checkCondition = (value: any, operator: string, expected: any): boolean => {
  switch (operator) {
    case 'equals':
      return value === expected
    case 'contains':
      return String(value).includes(String(expected))
    case 'starts_with':
      return String(value).startsWith(String(expected))
    case 'ends_with':
      return String(value).endsWith(String(expected))
    case 'greater_than':
      return Number(value) > Number(expected)
    case 'less_than':
      return Number(value) < Number(expected)
    default:
      return false
  }
}

// ===== ANALYTICS CLASS =====
export class AnalyticsManager {
  private store = useAnalyticsStore.getState()
  private flushInterval: NodeJS.Timeout | null = null
  
  constructor() {
    this.setupAutoFlush()
    this.setupPageTracking()
    this.setupErrorTracking()
    this.setupPerformanceTracking()
  }
  
  // Setup automatic event flushing
  private setupAutoFlush(): void {
    this.flushInterval = setInterval(() => {
      this.store.flushEvents()
    }, this.store.config.flushInterval)
  }
  
  // Setup automatic page tracking
  private setupPageTracking(): void {
    // Track initial page view
    this.store.trackPageView(window.location.pathname, document.title)
    
    // Track navigation changes (for SPAs)
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState
    
    history.pushState = function(...args) {
      originalPushState.apply(history, args)
      setTimeout(() => {
        useAnalyticsStore.getState().trackPageView(window.location.pathname, document.title)
      }, 0)
    }
    
    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args)
      setTimeout(() => {
        useAnalyticsStore.getState().trackPageView(window.location.pathname, document.title)
      }, 0)
    }
    
    window.addEventListener('popstate', () => {
      this.store.trackPageView(window.location.pathname, document.title)
    })
  }
  
  // Setup error tracking
  private setupErrorTracking(): void {
    window.addEventListener('error', (event) => {
      this.store.trackEvent({
        name: 'javascript_error',
        category: EVENT_CATEGORIES.ERROR,
        action: EVENT_ACTIONS.ERROR,
        label: event.error?.message || 'Unknown error',
        properties: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack
        }
      })
    })
    
    window.addEventListener('unhandledrejection', (event) => {
      this.store.trackEvent({
        name: 'unhandled_promise_rejection',
        category: EVENT_CATEGORIES.ERROR,
        action: EVENT_ACTIONS.ERROR,
        label: event.reason?.message || 'Unhandled promise rejection',
        properties: {
          reason: event.reason
        }
      })
    })
  }
  
  // Setup performance tracking
  private setupPerformanceTracking(): void {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        
        if (navigation) {
          this.store.trackEvent({
            name: 'page_load_performance',
            category: EVENT_CATEGORIES.PERFORMANCE,
            action: EVENT_ACTIONS.LOAD,
            properties: {
              loadTime: navigation.loadEventEnd - navigation.fetchStart,
              domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
              firstByte: navigation.responseStart - navigation.fetchStart
            }
          })
        }
      }, 1000)
    })
  }
  
  // A/B testing methods
  getVariant(testId: string, userId?: string): string | null {
    const test = this.store.abTests.find(t => t.id === testId && t.status === 'running')
    if (!test) return null
    
    // Check if user already has a variant assigned
    const currentVariant = this.store.currentVariants[testId]
    if (currentVariant) return currentVariant
    
    // Assign variant based on hash
    const hashInput = `${testId}:${userId || this.store.currentSession?.id || 'anonymous'}`
    const hash = hashString(hashInput)
    const bucket = hash % 100
    
    let cumulativeAllocation = 0
    for (const variant of test.variants) {
      cumulativeAllocation += variant.allocation
      if (bucket < cumulativeAllocation) {
        this.store.assignVariant(testId, variant.id)
        
        // Track variant assignment
        this.store.trackEvent({
          name: 'ab_test_assignment',
          category: EVENT_CATEGORIES.FEATURE,
          action: 'assign',
          label: `${test.name}:${variant.name}`,
          properties: {
            testId,
            testName: test.name,
            variantId: variant.id,
            variantName: variant.name
          }
        })
        
        return variant.id
      }
    }
    
    return null
  }
  
  // Integration methods
  initializeGoogleAnalytics(measurementId: string): void {
    if (typeof window === 'undefined') return
    
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    document.head.appendChild(script)
    
    ;(window as any).dataLayer = (window as any).dataLayer || []
    function gtag(...args: any[]) {
      ;(window as any).dataLayer.push(args)
    }
    
    gtag('js', new Date())
    gtag('config', measurementId, {
      anonymize_ip: this.store.config.anonymizeIp
    })
    
    ;(window as any).gtag = gtag
  }
  
  initializeFacebookPixel(pixelId: string): void {
    if (typeof window === 'undefined') return
    
    ;(window as any).fbq = function() {
      if ((window as any).fbq.callMethod) {
        ;(window as any).fbq.callMethod.apply((window as any).fbq, arguments)
      } else {
        ;(window as any).fbq.queue.push(arguments)
      }
    }
    
    if (!(window as any)._fbq) (window as any)._fbq = (window as any).fbq
    ;(window as any).fbq.push = (window as any).fbq
    ;(window as any).fbq.loaded = true
    ;(window as any).fbq.version = '2.0'
    ;(window as any).fbq.queue = []
    
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://connect.facebook.net/en_US/fbevents.js'
    document.head.appendChild(script)
    
    ;(window as any).fbq('init', pixelId)
    ;(window as any).fbq('track', 'PageView')
  }
  
  destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
      this.flushInterval = null
    }
  }
}

// ===== HOOKS =====

// Main analytics hook
export const useAnalytics = () => {
  const store = useAnalyticsStore()
  
  return {
    ...store,
    track: store.trackEvent,
    page: store.trackPageView,
    conversion: store.trackConversion
  }
}

// A/B testing hook
export const useABTest = (testId: string) => {
  const { abTests, currentVariants } = useAnalyticsStore()
  const [variant, setVariant] = React.useState<string | null>(null)
  
  React.useEffect(() => {
    const manager = analyticsManager
    const assignedVariant = manager.getVariant(testId)
    setVariant(assignedVariant)
  }, [testId])
  
  const test = abTests.find(t => t.id === testId)
  const variantData = test?.variants.find(v => v.id === variant)
  
  return {
    variant,
    variantData,
    test,
    isInTest: variant !== null
  }
}

// Conversion tracking hook
export const useConversionTracking = (goalId: string) => {
  const { trackConversion } = useAnalyticsStore()
  
  const convert = React.useCallback((value?: number) => {
    trackConversion(goalId, value)
  }, [goalId, trackConversion])
  
  return { convert }
}

// ===== DEFAULT INSTANCE =====
export const analyticsManager = new AnalyticsManager()

// ===== EXPORTS =====
// All exports are already declared above with export keyword