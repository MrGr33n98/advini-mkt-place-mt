/**
 * Modern Logging & Monitoring System
 * Arquitetura baseada em benchmarks da indústria:
 * - Structured logging
 * - Multiple log levels
 * - Context-aware logging
 * - Performance monitoring
 * - Error tracking
 * - Real-time alerts
 * - Log aggregation
 * - Metrics collection
 */

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

// ===== TYPES =====
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal'

export interface LogEntry {
  id: string
  timestamp: number
  level: LogLevel
  message: string
  context: LogContext
  metadata: Record<string, any>
  tags: string[]
  source: string
  userId?: string
  sessionId?: string
  requestId?: string
  stack?: string
  fingerprint?: string
}

export interface LogContext {
  component?: string
  action?: string
  feature?: string
  environment: string
  version: string
  userAgent?: string
  url?: string
  method?: string
  statusCode?: number
  duration?: number
  memoryUsage?: number
  cpuUsage?: number
}

export interface LoggerConfig {
  level: LogLevel
  enabled: boolean
  console: boolean
  remote: boolean
  storage: boolean
  maxEntries: number
  batchSize: number
  flushInterval: number
  endpoints: {
    logs: string
    errors: string
    metrics: string
  }
  filters: LogFilter[]
  formatters: LogFormatter[]
  transports: LogTransport[]
}

export interface LogFilter {
  name: string
  enabled: boolean
  condition: (entry: LogEntry) => boolean
}

export interface LogFormatter {
  name: string
  format: (entry: LogEntry) => string
}

export interface LogTransport {
  name: string
  enabled: boolean
  send: (entries: LogEntry[]) => Promise<void>
}

export interface Metric {
  name: string
  value: number
  type: 'counter' | 'gauge' | 'histogram' | 'timer'
  tags: Record<string, string>
  timestamp: number
}

export interface Alert {
  id: string
  name: string
  description: string
  condition: AlertCondition
  actions: AlertAction[]
  enabled: boolean
  cooldown: number
  lastTriggered?: number
}

export interface AlertCondition {
  metric: string
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte'
  threshold: number
  timeWindow: number
  aggregation: 'sum' | 'avg' | 'min' | 'max' | 'count'
}

export interface AlertAction {
  type: 'email' | 'webhook' | 'console'
  config: Record<string, any>
}

export interface LoggingState {
  // Configuration
  config: LoggerConfig
  
  // Log entries
  entries: LogEntry[]
  
  // Metrics
  metrics: Metric[]
  
  // Alerts
  alerts: Alert[]
  
  // Performance data
  performance: {
    apiCalls: Record<string, number[]>
    pageLoads: number[]
    errors: Record<string, number>
    memory: number[]
    cpu: number[]
  }
  
  // Actions
  updateConfig: (config: Partial<LoggerConfig>) => void
  log: (level: LogLevel, message: string, context?: Partial<LogContext>, metadata?: Record<string, any>) => void
  debug: (message: string, context?: Partial<LogContext>, metadata?: Record<string, any>) => void
  info: (message: string, context?: Partial<LogContext>, metadata?: Record<string, any>) => void
  warn: (message: string, context?: Partial<LogContext>, metadata?: Record<string, any>) => void
  error: (message: string, error?: Error, context?: Partial<LogContext>, metadata?: Record<string, any>) => void
  fatal: (message: string, error?: Error, context?: Partial<LogContext>, metadata?: Record<string, any>) => void
  metric: (name: string, value: number, type: Metric['type'], tags?: Record<string, string>) => void
  timer: (name: string, tags?: Record<string, string>) => () => void
  addAlert: (alert: Alert) => void
  removeAlert: (id: string) => void
  flush: () => Promise<void>
  clear: () => void
  export: () => string
}

// ===== CONSTANTS =====
export const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4
}

export const DEFAULT_CONFIG: LoggerConfig = {
  level: 'info',
  enabled: true,
  console: true,
  remote: false,
  storage: true,
  maxEntries: 1000,
  batchSize: 10,
  flushInterval: 5000,
  endpoints: {
    logs: '/api/logs',
    errors: '/api/errors',
    metrics: '/api/metrics'
  },
  filters: [],
  formatters: [],
  transports: []
}

export const COMMON_TAGS = {
  COMPONENT: 'component',
  ACTION: 'action',
  FEATURE: 'feature',
  USER: 'user',
  SESSION: 'session',
  REQUEST: 'request',
  ERROR: 'error',
  PERFORMANCE: 'performance'
} as const

// ===== UTILITY FUNCTIONS =====

// Generate unique ID
const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

// Get current context
const getCurrentContext = (): LogContext => {
  return {
    environment: process.env.NODE_ENV || 'development',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
    memoryUsage: typeof performance !== 'undefined' && performance.memory ? 
      performance.memory.usedJSHeapSize : undefined
  }
}

// Format log entry for console
const formatForConsole = (entry: LogEntry): string => {
  const timestamp = new Date(entry.timestamp).toISOString()
  const level = entry.level.toUpperCase().padEnd(5)
  const context = entry.context.component ? `[${entry.context.component}]` : ''
  
  return `${timestamp} ${level} ${context} ${entry.message}`
}

// Check if log level should be logged
const shouldLog = (level: LogLevel, configLevel: LogLevel): boolean => {
  return LOG_LEVELS[level] >= LOG_LEVELS[configLevel]
}

// Generate error fingerprint
const generateFingerprint = (error: Error): string => {
  const key = `${error.name}:${error.message}:${error.stack?.split('\n')[1] || ''}`
  return btoa(key).substr(0, 16)
}

// Get performance metrics
const getPerformanceMetrics = () => {
  if (typeof performance === 'undefined') return {}
  
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  const memory = (performance as any).memory
  
  return {
    loadTime: navigation ? navigation.loadEventEnd - navigation.navigationStart : undefined,
    domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.navigationStart : undefined,
    firstByte: navigation ? navigation.responseStart - navigation.navigationStart : undefined,
    memoryUsed: memory ? memory.usedJSHeapSize : undefined,
    memoryTotal: memory ? memory.totalJSHeapSize : undefined,
    memoryLimit: memory ? memory.jsHeapSizeLimit : undefined
  }
}

// ===== LOGGING STORE =====
export const useLoggingStore = create<LoggingState>()(
  immer((set, get) => ({
    config: DEFAULT_CONFIG,
    entries: [],
    metrics: [],
    alerts: [],
    performance: {
      apiCalls: {},
      pageLoads: [],
      errors: {},
      memory: [],
      cpu: []
    },
    
    updateConfig: (newConfig) => {
      set(state => {
        Object.assign(state.config, newConfig)
      })
    },
    
    log: (level, message, context = {}, metadata = {}) => {
      const { config } = get()
      
      if (!config.enabled || !shouldLog(level, config.level)) {
        return
      }
      
      const entry: LogEntry = {
        id: generateId(),
        timestamp: Date.now(),
        level,
        message,
        context: { ...getCurrentContext(), ...context },
        metadata,
        tags: [],
        source: 'client',
        userId: context.userId,
        sessionId: context.sessionId,
        requestId: context.requestId
      }
      
      // Apply filters
      const shouldInclude = config.filters.length === 0 || 
        config.filters.some(filter => filter.enabled && filter.condition(entry))
      
      if (!shouldInclude) return
      
      // Add to store
      set(state => {
        state.entries.push(entry)
        
        // Limit entries
        if (state.entries.length > config.maxEntries) {
          state.entries = state.entries.slice(-config.maxEntries)
        }
      })
      
      // Console output
      if (config.console) {
        const formatted = formatForConsole(entry)
        
        switch (level) {
          case 'debug':
            console.debug(formatted, metadata)
            break
          case 'info':
            console.info(formatted, metadata)
            break
          case 'warn':
            console.warn(formatted, metadata)
            break
          case 'error':
          case 'fatal':
            console.error(formatted, metadata)
            break
        }
      }
      
      // Check alerts
      get().checkAlerts(entry)
      
      // Auto-flush if batch size reached
      if (get().entries.length >= config.batchSize) {
        get().flush()
      }
    },
    
    debug: (message, context, metadata) => {
      get().log('debug', message, context, metadata)
    },
    
    info: (message, context, metadata) => {
      get().log('info', message, context, metadata)
    },
    
    warn: (message, context, metadata) => {
      get().log('warn', message, context, metadata)
    },
    
    error: (message, error, context, metadata) => {
      const errorMetadata = error ? {
        ...metadata,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      } : metadata
      
      const entry = {
        ...context,
        stack: error?.stack,
        fingerprint: error ? generateFingerprint(error) : undefined
      }
      
      get().log('error', message, entry, errorMetadata)
      
      // Track error metrics
      set(state => {
        const errorKey = error?.name || 'Unknown'
        state.performance.errors[errorKey] = (state.performance.errors[errorKey] || 0) + 1
      })
    },
    
    fatal: (message, error, context, metadata) => {
      const errorMetadata = error ? {
        ...metadata,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      } : metadata
      
      const entry = {
        ...context,
        stack: error?.stack,
        fingerprint: error ? generateFingerprint(error) : undefined
      }
      
      get().log('fatal', message, entry, errorMetadata)
    },
    
    metric: (name, value, type, tags = {}) => {
      const metric: Metric = {
        name,
        value,
        type,
        tags,
        timestamp: Date.now()
      }
      
      set(state => {
        state.metrics.push(metric)
        
        // Limit metrics
        if (state.metrics.length > 1000) {
          state.metrics = state.metrics.slice(-1000)
        }
      })
    },
    
    timer: (name, tags = {}) => {
      const startTime = performance.now()
      
      return () => {
        const duration = performance.now() - startTime
        get().metric(name, duration, 'timer', tags)
      }
    },
    
    addAlert: (alert) => {
      set(state => {
        state.alerts.push(alert)
      })
    },
    
    removeAlert: (id) => {
      set(state => {
        state.alerts = state.alerts.filter(alert => alert.id !== id)
      })
    },
    
    flush: async () => {
      const { entries, metrics, config } = get()
      
      if (!config.remote || entries.length === 0) return
      
      const entriesToSend = [...entries]
      const metricsToSend = [...metrics]
      
      // Clear entries
      set(state => {
        state.entries = []
        state.metrics = []
      })
      
      try {
        // Send logs
        if (entriesToSend.length > 0) {
          await fetch(config.endpoints.logs, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ entries: entriesToSend })
          })
        }
        
        // Send metrics
        if (metricsToSend.length > 0) {
          await fetch(config.endpoints.metrics, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ metrics: metricsToSend })
          })
        }
      } catch (error) {
        console.error('Failed to send logs:', error)
        
        // Re-add entries on failure
        set(state => {
          state.entries.unshift(...entriesToSend)
          state.metrics.unshift(...metricsToSend)
        })
      }
    },
    
    clear: () => {
      set(state => {
        state.entries = []
        state.metrics = []
      })
    },
    
    export: (): string => {
      const { entries, metrics, performance } = get()
      
      const exportData = {
        entries,
        metrics,
        performance,
        exportedAt: new Date().toISOString()
      }
      
      return JSON.stringify(exportData, null, 2)
    },
    
    // Helper method to check alerts
    checkAlerts: (entry: LogEntry) => {
      const { alerts } = get()
      
      alerts.forEach(alert => {
        if (!alert.enabled) return
        
        // Check cooldown
        if (alert.lastTriggered && 
            Date.now() - alert.lastTriggered < alert.cooldown) {
          return
        }
        
        // Simple condition check (can be extended)
        if (entry.level === 'error' || entry.level === 'fatal') {
          get().triggerAlert(alert, entry)
        }
      })
    },
    
    triggerAlert: (alert: Alert, entry: LogEntry) => {
      set(state => {
        const alertToUpdate = state.alerts.find(a => a.id === alert.id)
        if (alertToUpdate) {
          alertToUpdate.lastTriggered = Date.now()
        }
      })
      
      // Execute alert actions
      alert.actions.forEach(action => {
        switch (action.type) {
          case 'console':
            console.error(`ALERT: ${alert.name}`, entry)
            break
          case 'webhook':
            if (action.config.url) {
              fetch(action.config.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ alert, entry })
              }).catch(console.error)
            }
            break
        }
      })
    }
  }))
)

// ===== LOGGER CLASS =====
export class Logger {
  private store = useLoggingStore.getState()
  private flushInterval: NodeJS.Timeout | null = null
  private performanceObserver: PerformanceObserver | null = null
  
  constructor(private context: Partial<LogContext> = {}) {
    this.setupAutoFlush()
    this.setupPerformanceMonitoring()
    this.setupErrorHandling()
  }
  
  // Setup automatic flushing
  private setupAutoFlush(): void {
    this.flushInterval = setInterval(() => {
      this.store.flush()
    }, this.store.config.flushInterval)
  }
  
  // Setup performance monitoring
  private setupPerformanceMonitoring(): void {
    if (typeof PerformanceObserver === 'undefined') return
    
    this.performanceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      
      entries.forEach(entry => {
        if (entry.entryType === 'navigation') {
          const nav = entry as PerformanceNavigationTiming
          this.store.metric('page_load_time', nav.loadEventEnd - nav.navigationStart, 'timer')
        }
        
        if (entry.entryType === 'measure') {
          this.store.metric(entry.name, entry.duration, 'timer')
        }
      })
    })
    
    this.performanceObserver.observe({ entryTypes: ['navigation', 'measure'] })
  }
  
  // Setup global error handling
  private setupErrorHandling(): void {
    // Unhandled errors
    window.addEventListener('error', (event) => {
      this.error('Unhandled error', event.error, {
        component: 'global',
        action: 'error_handler'
      })
    })
    
    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.error('Unhandled promise rejection', event.reason, {
        component: 'global',
        action: 'promise_rejection'
      })
    })
  }
  
  // Create child logger with additional context
  child(context: Partial<LogContext>): Logger {
    return new Logger({ ...this.context, ...context })
  }
  
  // Log methods
  debug(message: string, metadata?: Record<string, any>): void {
    this.store.debug(message, this.context, metadata)
  }
  
  info(message: string, metadata?: Record<string, any>): void {
    this.store.info(message, this.context, metadata)
  }
  
  warn(message: string, metadata?: Record<string, any>): void {
    this.store.warn(message, this.context, metadata)
  }
  
  error(message: string, error?: Error, metadata?: Record<string, any>): void {
    this.store.error(message, error, this.context, metadata)
  }
  
  fatal(message: string, error?: Error, metadata?: Record<string, any>): void {
    this.store.fatal(message, error, this.context, metadata)
  }
  
  // Metric methods
  metric(name: string, value: number, type: Metric['type'] = 'gauge', tags?: Record<string, string>): void {
    this.store.metric(name, value, type, tags)
  }
  
  counter(name: string, value: number = 1, tags?: Record<string, string>): void {
    this.metric(name, value, 'counter', tags)
  }
  
  gauge(name: string, value: number, tags?: Record<string, string>): void {
    this.metric(name, value, 'gauge', tags)
  }
  
  timer(name: string, tags?: Record<string, string>): () => void {
    return this.store.timer(name, tags)
  }
  
  // Performance tracking
  trackApiCall(url: string, method: string, duration: number, statusCode: number): void {
    this.metric('api_call_duration', duration, 'timer', {
      url,
      method,
      status: statusCode.toString()
    })
    
    this.info('API call completed', {
      action: 'api_call',
      url,
      method,
      statusCode,
      duration
    })
  }
  
  trackPageView(path: string, loadTime?: number): void {
    this.info('Page view', {
      action: 'page_view',
      url: path
    })
    
    if (loadTime) {
      this.metric('page_load_time', loadTime, 'timer', { path })
    }
  }
  
  trackUserAction(action: string, component: string, metadata?: Record<string, any>): void {
    this.info(`User action: ${action}`, {
      component,
      action: 'user_action'
    }, metadata)
    
    this.counter('user_actions', 1, { action, component })
  }
  
  destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
      this.flushInterval = null
    }
    
    if (this.performanceObserver) {
      this.performanceObserver.disconnect()
      this.performanceObserver = null
    }
  }
}

// ===== HOOKS =====

// Main logging hook
export const useLogger = (context?: Partial<LogContext>) => {
  const logger = React.useMemo(() => new Logger(context), [context])
  
  React.useEffect(() => {
    return () => logger.destroy()
  }, [logger])
  
  return logger
}

// Log entries hook
export const useLogEntries = (level?: LogLevel, limit?: number) => {
  const { entries } = useLoggingStore()
  
  return React.useMemo(() => {
    let filtered = entries
    
    if (level) {
      filtered = entries.filter(entry => entry.level === level)
    }
    
    if (limit) {
      filtered = filtered.slice(-limit)
    }
    
    return filtered.sort((a, b) => b.timestamp - a.timestamp)
  }, [entries, level, limit])
}

// Metrics hook
export const useMetrics = (name?: string) => {
  const { metrics } = useLoggingStore()
  
  return React.useMemo(() => {
    if (name) {
      return metrics.filter(metric => metric.name === name)
    }
    return metrics
  }, [metrics, name])
}

// Performance hook
export const usePerformance = () => {
  const { performance } = useLoggingStore()
  
  return performance
}

// ===== DEFAULT INSTANCE =====
export const logger = new Logger()

// ===== EXPORTS =====
export {
  Logger,
  useLogger,
  useLogEntries,
  useMetrics,
  usePerformance,
  LOG_LEVELS,
  COMMON_TAGS
}

// React import
import React from 'react'