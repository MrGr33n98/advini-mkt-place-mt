/**
 * Modern API System
 * Arquitetura baseada em benchmarks da indústria:
 * - Type-safe API calls
 * - Automatic retry logic
 * - Request/Response interceptors
 * - Caching strategies
 * - Error handling
 * - Loading states
 * - Optimistic updates
 */

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

// ===== TYPES =====
export interface ApiConfig {
  baseURL: string
  timeout: number
  retries: number
  retryDelay: number
  headers: Record<string, string>
  interceptors: {
    request: RequestInterceptor[]
    response: ResponseInterceptor[]
  }
}

export interface RequestConfig extends Omit<RequestInit, 'cache'> {
  url: string
  params?: Record<string, any>
  timeout?: number
  retries?: number
  retryDelay?: number
  cache?: CacheStrategy
  optimistic?: boolean
  skipAuth?: boolean
  skipLoading?: boolean
}

export interface ApiResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: Headers
  config: RequestConfig
}

export interface ApiError {
  message: string
  status?: number
  code?: string
  details?: any
  config?: RequestConfig
}

export interface RequestInterceptor {
  onFulfilled?: (config: RequestConfig) => RequestConfig | Promise<RequestConfig>
  onRejected?: (error: any) => any
}

export interface ResponseInterceptor {
  onFulfilled?: (response: ApiResponse) => ApiResponse | Promise<ApiResponse>
  onRejected?: (error: ApiError) => any
}

export type CacheStrategy = 'no-cache' | 'cache-first' | 'network-first' | 'cache-only' | 'network-only'

export interface CacheEntry<T = any> {
  data: T
  timestamp: number
  ttl: number
  etag?: string
}

export interface LoadingState {
  [key: string]: boolean
}

export interface ApiState {
  // Loading states
  loading: LoadingState
  
  // Cache
  cache: Map<string, CacheEntry>
  
  // Error tracking
  errors: Map<string, ApiError>
  
  // Request tracking
  pendingRequests: Map<string, AbortController>
  
  // Actions
  setLoading: (key: string, loading: boolean) => void
  setError: (key: string, error: ApiError | null) => void
  setCache: (key: string, data: any, ttl?: number) => void
  getCache: (key: string) => CacheEntry | null
  clearCache: (pattern?: string) => void
  abortRequest: (key: string) => void
  abortAllRequests: () => void
}

// ===== CONSTANTS =====
export const API_CONFIG: ApiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 30000, // 30 seconds
  retries: 3,
  retryDelay: 1000, // 1 second
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  interceptors: {
    request: [],
    response: []
  }
}

export const CACHE_TTL = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 2 * 60 * 60 * 1000, // 2 hours
  VERY_LONG: 24 * 60 * 60 * 1000, // 24 hours
} as const

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const

// ===== UTILITY FUNCTIONS =====

// Generate cache key
const generateCacheKey = (url: string, params?: Record<string, any>): string => {
  const baseKey = url
  if (!params || Object.keys(params).length === 0) {
    return baseKey
  }
  
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&')
  
  return `${baseKey}?${sortedParams}`
}

// Build URL with params
const buildURL = (baseURL: string, url: string, params?: Record<string, any>): string => {
  const fullURL = url.startsWith('http') ? url : `${baseURL}${url}`
  
  if (!params || Object.keys(params).length === 0) {
    return fullURL
  }
  
  const urlObj = new URL(fullURL)
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      urlObj.searchParams.set(key, String(value))
    }
  })
  
  return urlObj.toString()
}

// Sleep utility for retry delays
const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms))

// Check if error is retryable
const isRetryableError = (error: any): boolean => {
  if (!error.status) return true // Network errors
  
  return [
    HTTP_STATUS.TOO_MANY_REQUESTS,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    HTTP_STATUS.BAD_GATEWAY,
    HTTP_STATUS.SERVICE_UNAVAILABLE,
    HTTP_STATUS.GATEWAY_TIMEOUT
  ].includes(error.status)
}

// ===== API STORE =====
export const useApiStore = create<ApiState>()(
  immer((set, get) => ({
    loading: {},
    cache: new Map(),
    errors: new Map(),
    pendingRequests: new Map(),
    
    setLoading: (key: string, loading: boolean) => {
      set(state => {
        if (loading) {
          state.loading[key] = true
        } else {
          delete state.loading[key]
        }
      })
    },
    
    setError: (key: string, error: ApiError | null) => {
      set(state => {
        if (error) {
          // Serialize the error to avoid Immer WritableDraft issues
          const serializedError = JSON.parse(JSON.stringify({
            message: error.message,
            name: error.name,
            status: error.status,
            code: error.code,
            details: error.details
          }))
          state.errors.set(key, serializedError)
        } else {
          state.errors.delete(key)
        }
      })
    },
    
    setCache: (key: string, data: any, ttl: number = CACHE_TTL.MEDIUM) => {
      set(state => {
        state.cache.set(key, {
          data,
          timestamp: Date.now(),
          ttl
        })
      })
    },
    
    getCache: (key: string) => {
      const entry = get().cache.get(key)
      if (!entry) return null
      
      const isExpired = Date.now() - entry.timestamp > entry.ttl
      if (isExpired) {
        get().cache.delete(key)
        return null
      }
      
      return entry
    },
    
    clearCache: (pattern?: string) => {
      set(state => {
        if (!pattern) {
          state.cache.clear()
          return
        }
        
        const regex = new RegExp(pattern)
        for (const [key] of state.cache) {
          if (regex.test(key)) {
            state.cache.delete(key)
          }
        }
      })
    },
    
    abortRequest: (key: string) => {
      const controller = get().pendingRequests.get(key)
      if (controller) {
        controller.abort()
        set(state => {
          state.pendingRequests.delete(key)
        })
      }
    },
    
    abortAllRequests: () => {
      const { pendingRequests } = get()
      for (const [key, controller] of pendingRequests) {
        controller.abort()
      }
      set(state => {
        state.pendingRequests.clear()
      })
    }
  }))
)

// ===== API CLIENT CLASS =====
export class ApiClient {
  private config: ApiConfig
  
  constructor(config: Partial<ApiConfig> = {}) {
    this.config = { ...API_CONFIG, ...config }
  }
  
  // Add request interceptor
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.config.interceptors.request.push(interceptor)
  }
  
  // Add response interceptor
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.config.interceptors.response.push(interceptor)
  }
  
  // Apply request interceptors
  private async applyRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
    let processedConfig = config
    
    for (const interceptor of this.config.interceptors.request) {
      if (interceptor.onFulfilled) {
        try {
          processedConfig = await interceptor.onFulfilled(processedConfig)
        } catch (error) {
          if (interceptor.onRejected) {
            throw await interceptor.onRejected(error as ApiError)
          }
          throw error
        }
      }
    }
    
    return processedConfig
  }
  
  // Apply response interceptors
  private async applyResponseInterceptors(response: ApiResponse): Promise<ApiResponse> {
    let processedResponse = response
    
    for (const interceptor of this.config.interceptors.response) {
      if (interceptor.onFulfilled) {
        try {
          processedResponse = await interceptor.onFulfilled(processedResponse)
        } catch (error) {
          if (interceptor.onRejected) {
            throw await interceptor.onRejected(error as ApiError)
          }
          throw error
        }
      }
    }
    
    return processedResponse
  }
  
  // Main request method
  async request<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
    const store = useApiStore.getState()
    const processedConfig = await this.applyRequestInterceptors(config)
    
    const {
      url,
      params,
      timeout = this.config.timeout,
      retries = this.config.retries,
      retryDelay = this.config.retryDelay,
      cache = 'network-first',
      optimistic = false,
      skipAuth = false,
      skipLoading = false,
      ...fetchConfig
    } = processedConfig
    
    const cacheKey = generateCacheKey(url, params)
    const loadingKey = `${fetchConfig.method || 'GET'}:${cacheKey}`
    
    // Handle caching
    if (cache !== 'no-cache' && cache !== 'network-only') {
      const cachedEntry = store.getCache(cacheKey)
      if (cachedEntry) {
        if (cache === 'cache-only' || cache === 'cache-first') {
          return {
            data: cachedEntry.data,
            status: HTTP_STATUS.OK,
            statusText: 'OK',
            headers: new Headers(),
            config: processedConfig
          }
        }
      } else if (cache === 'cache-only') {
        throw new ApiError({
          message: 'No cached data available',
          code: 'CACHE_MISS',
          config: processedConfig
        })
      }
    }
    
    // Set loading state
    if (!skipLoading) {
      store.setLoading(loadingKey, true)
    }
    
    // Clear previous error
    store.setError(loadingKey, null)
    
    // Create abort controller
    const controller = new AbortController()
    store.pendingRequests.set(loadingKey, controller)
    
    let lastError: ApiError | undefined
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Build final URL
        const finalURL = buildURL(this.config.baseURL, url, params)
        
        // Prepare headers
        const headers = new Headers({
          ...this.config.headers,
          ...fetchConfig.headers
        })
        
        // Add auth header if not skipped
        if (!skipAuth) {
          // This would be handled by an auth interceptor in practice
          const token = localStorage.getItem('auth-token')
          if (token) {
            headers.set('Authorization', `Bearer ${token}`)
          }
        }
        
        // Make request
        const response = await fetch(finalURL, {
          ...fetchConfig,
          headers,
          signal: controller.signal,
          // Note: timeout would be implemented with AbortController and setTimeout
        })
        
        // Handle non-2xx responses
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new ApiError({
            message: errorData.message || response.statusText,
            status: response.status,
            code: errorData.code,
            details: errorData,
            config: processedConfig
          })
        }
        
        // Parse response
        const data = await response.json()
        
        const apiResponse: ApiResponse<T> = {
          data,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          config: processedConfig
        }
        
        // Apply response interceptors
        const processedResponse = await this.applyResponseInterceptors(apiResponse)
        
        // Cache successful response
        if (cache !== 'no-cache' && fetchConfig.method === 'GET') {
          store.setCache(cacheKey, processedResponse.data)
        }
        
        // Clear loading and pending request
        if (!skipLoading) {
          store.setLoading(loadingKey, false)
        }
        store.pendingRequests.delete(loadingKey)
        
        return processedResponse
        
      } catch (error) {
        lastError = error instanceof ApiError ? error : new ApiError({
          message: error instanceof Error ? error.message : 'Unknown error',
          config: processedConfig
        })
        
        // Don't retry if aborted or not retryable
        if (controller.signal.aborted || !isRetryableError(lastError)) {
          break
        }
        
        // Don't retry on last attempt
        if (attempt === retries) {
          break
        }
        
        // Wait before retry
        await sleep(retryDelay * Math.pow(2, attempt)) // Exponential backoff
      }
    }
    
    // If we reach here, there was an error
    if (!lastError) {
      lastError = new ApiError({
        message: 'Request failed with unknown error',
        config: processedConfig
      })
    }
    
    // Set error state
    store.setError(loadingKey, lastError)
    
    // Clear loading and pending request
    if (!skipLoading) {
      store.setLoading(loadingKey, false)
    }
    store.pendingRequests.delete(loadingKey)
    
    throw lastError
  }
  
  // Convenience methods
  async get<T = any>(url: string, config: Omit<RequestConfig, 'url' | 'method'> = {}): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, url, method: 'GET' })
  }
  
  async post<T = any>(url: string, data?: any, config: Omit<RequestConfig, 'url' | 'method' | 'body'> = {}): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      url,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    })
  }
  
  async put<T = any>(url: string, data?: any, config: Omit<RequestConfig, 'url' | 'method' | 'body'> = {}): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      url,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    })
  }
  
  async patch<T = any>(url: string, data?: any, config: Omit<RequestConfig, 'url' | 'method' | 'body'> = {}): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      url,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined
    })
  }
  
  async delete<T = any>(url: string, config: Omit<RequestConfig, 'url' | 'method'> = {}): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, url, method: 'DELETE' })
  }
}

// ===== DEFAULT CLIENT INSTANCE =====
export const apiClient = new ApiClient()

// Add default interceptors
apiClient.addRequestInterceptor({
  onFulfilled: (config) => {
    // Add timestamp to prevent caching
    if (config.method === 'GET') {
      if (!config.params) {
        config.params = {}
      }
      config.params!._t = Date.now()
    }
    return config
  }
})

apiClient.addResponseInterceptor({
  onRejected: async (error: ApiError) => {
    // Handle 401 errors globally
    if (error.status === HTTP_STATUS.UNAUTHORIZED) {
      // Redirect to login or refresh token
      window.location.href = '/login'
    }
    throw error
  }
})

// ===== HOOKS =====

// Main API hook
export const useApi = () => {
  const store = useApiStore()
  
  return {
    ...store,
    client: apiClient,
    isLoading: (key: string) => store.loading[key] || false,
    getError: (key: string) => store.errors.get(key) || null
  }
}

// Query hook for GET requests
export const useQuery = <T = any>(
  key: string,
  url: string,
  config: Omit<RequestConfig, 'url' | 'method'> = {},
  options: {
    enabled?: boolean
    refetchOnMount?: boolean
    refetchOnWindowFocus?: boolean
    staleTime?: number
  } = {}
) => {
  const [data, setData] = React.useState<T | null>(null)
  const [error, setError] = React.useState<ApiError | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isFetching, setIsFetching] = React.useState(false)
  
  const {
    enabled = true,
    refetchOnMount = true,
    refetchOnWindowFocus = false,
    staleTime = CACHE_TTL.MEDIUM
  } = options
  
  const fetchData = React.useCallback(async () => {
    if (!enabled) return
    
    setIsFetching(true)
    if (!data) setIsLoading(true)
    
    try {
      const response = await apiClient.get<T>(url, {
        ...config,
        cache: 'cache-first'
      })
      setData(response.data)
      setError(null)
    } catch (err) {
      setError(err as ApiError)
    } finally {
      setIsLoading(false)
      setIsFetching(false)
    }
  }, [url, enabled, data, config])
  
  // Initial fetch
  React.useEffect(() => {
    if (enabled && refetchOnMount) {
      fetchData()
    }
  }, [fetchData, enabled, refetchOnMount])
  
  // Refetch on window focus
  React.useEffect(() => {
    if (!refetchOnWindowFocus) return
    
    const handleFocus = () => {
      if (enabled && data) {
        fetchData()
      }
    }
    
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [fetchData, enabled, data, refetchOnWindowFocus])
  
  const refetch = React.useCallback(() => {
    return fetchData()
  }, [fetchData])
  
  return {
    data,
    error,
    isLoading,
    isFetching,
    refetch
  }
}

// Mutation hook for POST/PUT/PATCH/DELETE requests
export const useMutation = <TData = any, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
  options: {
    onSuccess?: (data: TData, variables: TVariables) => void
    onError?: (error: ApiError, variables: TVariables) => void
    onSettled?: (data: TData | undefined, error: ApiError | null, variables: TVariables) => void
  } = {}
) => {
  const [data, setData] = React.useState<TData | undefined>(undefined)
  const [error, setError] = React.useState<ApiError | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  
  const mutate = React.useCallback(async (variables: TVariables) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await mutationFn(variables)
      setData(response.data)
      options.onSuccess?.(response.data, variables)
      options.onSettled?.(response.data, null, variables)
      return response.data
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError)
      options.onError?.(apiError, variables)
      options.onSettled?.(undefined, apiError, variables)
      throw apiError
    } finally {
      setIsLoading(false)
    }
  }, [mutationFn, options])
  
  const reset = React.useCallback(() => {
    setData(undefined)
    setError(null)
  }, [])
  
  return {
    data,
    error,
    isLoading,
    mutate,
    reset
  }
}

// ===== ERROR CLASS =====
export class ApiError extends Error {
  status?: number
  code?: string
  details?: any
  config?: RequestConfig
  
  constructor(error: {
    message: string
    status?: number
    code?: string
    details?: any
    config?: RequestConfig
  }) {
    super(error.message)
    this.name = 'ApiError'
    this.status = error.status
    this.code = error.code
    this.details = error.details
    this.config = error.config
  }
}



// React import
import React from 'react'