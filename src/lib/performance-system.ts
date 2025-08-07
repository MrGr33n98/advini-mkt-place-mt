/**
 * Modern Performance & Optimization System
 * Arquitetura baseada em benchmarks da indústria:
 * - Performance monitoring
 * - Memory management
 * - Bundle optimization
 * - Image optimization
 * - Lazy loading
 * - Caching strategies
 * - Virtual scrolling
 * - Debouncing/Throttling
 */

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

// ===== TYPES =====
export interface PerformanceMetrics {
  // Core Web Vitals
  lcp: number | null // Largest Contentful Paint
  fid: number | null // First Input Delay
  cls: number | null // Cumulative Layout Shift
  fcp: number | null // First Contentful Paint
  ttfb: number | null // Time to First Byte
  
  // Custom metrics
  loadTime: number
  renderTime: number
  memoryUsage: number
  bundleSize: number
  
  // Navigation timing
  navigationStart: number
  domContentLoaded: number
  loadComplete: number
  
  // Resource timing
  resources: ResourceTiming[]
  
  // User interactions
  interactions: InteractionTiming[]
}

export interface ResourceTiming {
  name: string
  type: 'script' | 'stylesheet' | 'image' | 'font' | 'fetch' | 'other'
  size: number
  loadTime: number
  cached: boolean
}

export interface InteractionTiming {
  type: 'click' | 'scroll' | 'input' | 'navigation'
  timestamp: number
  duration: number
  target?: string
}

export interface PerformanceConfig {
  enableMonitoring: boolean
  enableMemoryTracking: boolean
  enableResourceTracking: boolean
  enableInteractionTracking: boolean
  sampleRate: number
  reportingEndpoint?: string
  thresholds: {
    lcp: number
    fid: number
    cls: number
    memoryUsage: number
  }
}

export interface OptimizationOptions {
  enableLazyLoading: boolean
  enableImageOptimization: boolean
  enableVirtualScrolling: boolean
  enableCodeSplitting: boolean
  enablePreloading: boolean
  enableServiceWorker: boolean
  cacheStrategy: 'aggressive' | 'conservative' | 'custom'
}

export interface PerformanceState {
  metrics: PerformanceMetrics
  config: PerformanceConfig
  optimizations: OptimizationOptions
  isMonitoring: boolean
  
  // Actions
  updateMetrics: (metrics: Partial<PerformanceMetrics>) => void
  updateConfig: (config: Partial<PerformanceConfig>) => void
  updateOptimizations: (optimizations: Partial<OptimizationOptions>) => void
  startMonitoring: () => void
  stopMonitoring: () => void
  reportMetrics: () => void
}

// ===== CONSTANTS =====
export const DEFAULT_CONFIG: PerformanceConfig = {
  enableMonitoring: true,
  enableMemoryTracking: true,
  enableResourceTracking: true,
  enableInteractionTracking: true,
  sampleRate: 1.0,
  thresholds: {
    lcp: 2500, // 2.5s
    fid: 100, // 100ms
    cls: 0.1, // 0.1
    memoryUsage: 50 * 1024 * 1024 // 50MB
  }
}

export const DEFAULT_OPTIMIZATIONS: OptimizationOptions = {
  enableLazyLoading: true,
  enableImageOptimization: true,
  enableVirtualScrolling: true,
  enableCodeSplitting: true,
  enablePreloading: true,
  enableServiceWorker: true,
  cacheStrategy: 'aggressive'
}

export const PERFORMANCE_THRESHOLDS = {
  GOOD: {
    LCP: 2500,
    FID: 100,
    CLS: 0.1
  },
  NEEDS_IMPROVEMENT: {
    LCP: 4000,
    FID: 300,
    CLS: 0.25
  }
} as const

// ===== UTILITY FUNCTIONS =====

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    
    const callNow = immediate && !timeout
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    
    if (callNow) func(...args)
  }
}

// Throttle function
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Memory usage calculation
export const getMemoryUsage = (): number => {
  if ('memory' in performance) {
    return (performance as any).memory.usedJSHeapSize
  }
  return 0
}

// Bundle size estimation
export const getBundleSize = (): number => {
  const scripts = document.querySelectorAll('script[src]')
  let totalSize = 0
  
  scripts.forEach(script => {
    const src = script.getAttribute('src')
    if (src && !src.startsWith('http')) {
      // Estimate based on script count (rough approximation)
      totalSize += 50000 // 50KB per script
    }
  })
  
  return totalSize
}

// Resource timing analysis
export const getResourceTimings = (): ResourceTiming[] => {
  const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
  
  return entries.map(entry => ({
    name: entry.name,
    type: getResourceType(entry.name),
    size: entry.transferSize || 0,
    loadTime: entry.responseEnd - entry.requestStart,
    cached: entry.transferSize === 0 && entry.decodedBodySize > 0
  }))
}

// Get resource type from URL
const getResourceType = (url: string): ResourceTiming['type'] => {
  if (url.includes('.js')) return 'script'
  if (url.includes('.css')) return 'stylesheet'
  if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return 'image'
  if (url.match(/\.(woff|woff2|ttf|otf)$/)) return 'font'
  if (url.includes('/api/')) return 'fetch'
  return 'other'
}

// Core Web Vitals measurement
export const measureCoreWebVitals = (): Promise<Partial<PerformanceMetrics>> => {
  return new Promise((resolve) => {
    const metrics: Partial<PerformanceMetrics> = {}
    
    // LCP (Largest Contentful Paint)
    if ('PerformanceObserver' in window) {
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1] as any
          metrics.lcp = lastEntry.startTime
          lcpObserver.disconnect()
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      } catch (e) {
        console.warn('LCP measurement not supported')
      }
      
      // FID (First Input Delay)
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            metrics.fid = entry.processingStart - entry.startTime
          })
          fidObserver.disconnect()
        })
        fidObserver.observe({ entryTypes: ['first-input'] })
      } catch (e) {
        console.warn('FID measurement not supported')
      }
      
      // CLS (Cumulative Layout Shift)
      try {
        let clsValue = 0
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          })
          metrics.cls = clsValue
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })
      } catch (e) {
        console.warn('CLS measurement not supported')
      }
    }
    
    // Navigation timing
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigation) {
      metrics.fcp = navigation.responseStart - navigation.requestStart
      metrics.ttfb = navigation.responseStart - navigation.requestStart
      metrics.navigationStart = navigation.startTime
      metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.startTime
      metrics.loadComplete = navigation.loadEventEnd - navigation.startTime
    }
    
    // Additional metrics
    metrics.loadTime = performance.now()
    metrics.memoryUsage = getMemoryUsage()
    metrics.bundleSize = getBundleSize()
    metrics.resources = getResourceTimings()
    
    setTimeout(() => resolve(metrics), 1000) // Wait for measurements
  })
}

// ===== PERFORMANCE STORE =====
export const usePerformanceStore = create<PerformanceState>()(
  immer((set, get) => ({
    metrics: {
      lcp: null,
      fid: null,
      cls: null,
      fcp: null,
      ttfb: null,
      loadTime: 0,
      renderTime: 0,
      memoryUsage: 0,
      bundleSize: 0,
      navigationStart: 0,
      domContentLoaded: 0,
      loadComplete: 0,
      resources: [],
      interactions: []
    },
    config: DEFAULT_CONFIG,
    optimizations: DEFAULT_OPTIMIZATIONS,
    isMonitoring: false,
    
    updateMetrics: (newMetrics) => {
      set(state => {
        Object.assign(state.metrics, newMetrics)
      })
    },
    
    updateConfig: (newConfig) => {
      set(state => {
        Object.assign(state.config, newConfig)
      })
    },
    
    updateOptimizations: (newOptimizations) => {
      set(state => {
        Object.assign(state.optimizations, newOptimizations)
      })
    },
    
    startMonitoring: () => {
      set(state => {
        state.isMonitoring = true
      })
    },
    
    stopMonitoring: () => {
      set(state => {
        state.isMonitoring = false
      })
    },
    
    reportMetrics: () => {
      const { metrics, config } = get()
      if (config.reportingEndpoint) {
        fetch(config.reportingEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(metrics)
        }).catch(console.error)
      }
    }
  }))
)

// ===== PERFORMANCE MONITOR CLASS =====
export class PerformanceMonitor {
  private store = usePerformanceStore.getState()
  private observers: PerformanceObserver[] = []
  private intervalId: NodeJS.Timeout | null = null
  
  constructor() {
    this.setupObservers()
  }
  
  // Setup performance observers
  private setupObservers(): void {
    if (!('PerformanceObserver' in window)) return
    
    // Resource timing observer
    try {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries() as PerformanceResourceTiming[]
        const resources = entries.map(entry => ({
          name: entry.name,
          type: getResourceType(entry.name),
          size: entry.transferSize || 0,
          loadTime: entry.responseEnd - entry.requestStart,
          cached: entry.transferSize === 0 && entry.decodedBodySize > 0
        }))
        
        this.store.updateMetrics({ resources })
      })
      resourceObserver.observe({ entryTypes: ['resource'] })
      this.observers.push(resourceObserver)
    } catch (e) {
      console.warn('Resource timing observer not supported')
    }
    
    // Navigation timing observer
    try {
      const navigationObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries() as PerformanceNavigationTiming[]
        const entry = entries[0]
        if (entry) {
          this.store.updateMetrics({
            navigationStart: entry.startTime,
            domContentLoaded: entry.domContentLoadedEventEnd - entry.startTime,
            loadComplete: entry.loadEventEnd - entry.startTime,
            ttfb: entry.responseStart - entry.requestStart
          })
        }
      })
      navigationObserver.observe({ entryTypes: ['navigation'] })
      this.observers.push(navigationObserver)
    } catch (e) {
      console.warn('Navigation timing observer not supported')
    }
  }
  
  // Start monitoring
  start(): void {
    this.store.startMonitoring()
    
    // Initial measurement
    this.measureInitialMetrics()
    
    // Periodic monitoring
    this.intervalId = setInterval(() => {
      this.updatePeriodicMetrics()
    }, 5000) // Every 5 seconds
    
    // Setup interaction tracking
    this.setupInteractionTracking()
  }
  
  // Stop monitoring
  stop(): void {
    this.store.stopMonitoring()
    
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
  
  // Measure initial metrics
  private async measureInitialMetrics(): Promise<void> {
    const metrics = await measureCoreWebVitals()
    this.store.updateMetrics(metrics)
  }
  
  // Update periodic metrics
  private updatePeriodicMetrics(): void {
    const memoryUsage = getMemoryUsage()
    this.store.updateMetrics({ memoryUsage })
  }
  
  // Setup interaction tracking
  private setupInteractionTracking(): void {
    const trackInteraction = (type: InteractionTiming['type']) => 
      throttle((event: Event) => {
        const interaction: InteractionTiming = {
          type,
          timestamp: performance.now(),
          duration: 0,
          target: (event.target as Element)?.tagName?.toLowerCase()
        }
        
        const currentInteractions = this.store.metrics.interactions
        this.store.updateMetrics({
          interactions: [...currentInteractions, interaction]
        })
      }, 100)
    
    document.addEventListener('click', trackInteraction('click'))
    document.addEventListener('scroll', trackInteraction('scroll'))
    document.addEventListener('input', trackInteraction('input'))
  }
}

// ===== OPTIMIZATION UTILITIES =====

// Lazy loading utility
export const createLazyLoader = (threshold = 0.1) => {
  if (!('IntersectionObserver' in window)) {
    return {
      observe: () => {},
      unobserve: () => {},
      disconnect: () => {}
    }
  }
  
  return new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target as HTMLElement
        const src = element.dataset.src
        const srcset = element.dataset.srcset
        
        if (src && element instanceof HTMLImageElement) {
          element.src = src
          element.removeAttribute('data-src')
        }
        
        if (srcset && element instanceof HTMLImageElement) {
          element.srcset = srcset
          element.removeAttribute('data-srcset')
        }
        
        element.classList.remove('lazy')
        element.classList.add('loaded')
      }
    })
  }, { threshold })
}

// Image optimization utility
export const optimizeImage = (
  src: string,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'avif' | 'jpeg' | 'png'
  } = {}
): string => {
  const { width, height, quality = 80, format = 'webp' } = options
  
  // If using a CDN like Cloudinary or ImageKit
  if (src.includes('cloudinary.com')) {
    let transformations = [`q_${quality}`, `f_${format}`]
    if (width) transformations.push(`w_${width}`)
    if (height) transformations.push(`h_${height}`)
    
    return src.replace('/upload/', `/upload/${transformations.join(',')}/`)
  }
  
  // For Next.js Image optimization
  if (process.env.NODE_ENV === 'production') {
    const params = new URLSearchParams()
    params.set('url', src)
    params.set('q', quality.toString())
    if (width) params.set('w', width.toString())
    if (height) params.set('h', height.toString())
    
    return `/_next/image?${params.toString()}`
  }
  
  return src
}

// Virtual scrolling utility
export const createVirtualScroller = <T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan = 5
) => {
  const [scrollTop, setScrollTop] = React.useState(0)
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )
  
  const visibleItems = items.slice(startIndex, endIndex + 1)
  const totalHeight = items.length * itemHeight
  const offsetY = startIndex * itemHeight
  
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop)
  }
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    startIndex,
    endIndex
  }
}

// Code splitting utility
export const createAsyncComponent = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback: React.ComponentType = () => <div>Loading...</div>
) => {
  return React.lazy(importFunc)
}

// Preloading utility
export const preloadResource = (
  href: string,
  as: 'script' | 'style' | 'image' | 'font' | 'fetch' = 'fetch',
  crossorigin?: 'anonymous' | 'use-credentials'
): void => {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = href
  link.as = as
  if (crossorigin) link.crossOrigin = crossorigin
  
  document.head.appendChild(link)
}

// ===== HOOKS =====

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  const store = usePerformanceStore()
  const monitorRef = React.useRef<PerformanceMonitor | null>(null)
  
  React.useEffect(() => {
    if (store.config.enableMonitoring && !monitorRef.current) {
      monitorRef.current = new PerformanceMonitor()
      monitorRef.current.start()
    }
    
    return () => {
      if (monitorRef.current) {
        monitorRef.current.stop()
        monitorRef.current = null
      }
    }
  }, [store.config.enableMonitoring])
  
  return {
    metrics: store.metrics,
    config: store.config,
    isMonitoring: store.isMonitoring,
    updateConfig: store.updateConfig,
    reportMetrics: store.reportMetrics
  }
}

// Lazy loading hook
export const useLazyLoading = (threshold = 0.1) => {
  const observerRef = React.useRef<IntersectionObserver | null>(null)
  
  React.useEffect(() => {
    observerRef.current = createLazyLoader(threshold)
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [threshold])
  
  const observe = React.useCallback((element: Element) => {
    if (observerRef.current) {
      observerRef.current.observe(element)
    }
  }, [])
  
  const unobserve = React.useCallback((element: Element) => {
    if (observerRef.current) {
      observerRef.current.unobserve(element)
    }
  }, [])
  
  return { observe, unobserve }
}

// Virtual scrolling hook
export const useVirtualScrolling = <T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan = 5
) => {
  return createVirtualScroller(items, itemHeight, containerHeight, overscan)
}

// Debounced value hook
export const useDebouncedValue = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)
  
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  
  return debouncedValue
}

// Throttled callback hook
export const useThrottledCallback = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const throttledCallback = React.useMemo(
    () => throttle(callback, delay),
    [callback, delay]
  )
  
  return throttledCallback as T
}

// ===== DEFAULT INSTANCE =====
export const performanceMonitor = new PerformanceMonitor()

// ===== EXPORTS =====
export {
  PerformanceMonitor,
  usePerformanceMonitor,
  useLazyLoading,
  useVirtualScrolling,
  useDebouncedValue,
  useThrottledCallback,
  debounce,
  throttle,
  optimizeImage,
  preloadResource,
  createAsyncComponent,
  measureCoreWebVitals,
  PERFORMANCE_THRESHOLDS
}

// React import
import React from 'react'