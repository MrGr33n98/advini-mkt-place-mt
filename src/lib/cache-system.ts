/**
 * Modern Cache & Storage System
 * Arquitetura baseada em benchmarks da indústria:
 * - Multi-layer caching (Memory, IndexedDB, LocalStorage)
 * - TTL (Time To Live) support
 * - LRU (Least Recently Used) eviction
 * - Compression support
 * - Encryption for sensitive data
 * - Background sync
 * - Offline support
 * - Cache invalidation strategies
 */

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

// ===== TYPES =====
export interface CacheEntry<T = any> {
  key: string
  value: T
  timestamp: number
  ttl?: number
  accessCount: number
  lastAccessed: number
  size: number
  compressed: boolean
  encrypted: boolean
  tags: string[]
  metadata: Record<string, any>
}

export interface CacheConfig {
  maxMemorySize: number // bytes
  maxIndexedDBSize: number // bytes
  defaultTTL: number // milliseconds
  compressionThreshold: number // bytes
  encryptionEnabled: boolean
  backgroundSyncEnabled: boolean
  evictionPolicy: 'lru' | 'lfu' | 'ttl'
  persistenceLayer: 'memory' | 'localStorage' | 'indexedDB' | 'all'
  syncInterval: number // milliseconds
}

export interface StorageAdapter {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T, ttl?: number): Promise<void>
  delete(key: string): Promise<void>
  clear(): Promise<void>
  keys(): Promise<string[]>
  size(): Promise<number>
}

export interface CacheStats {
  memoryUsage: number
  indexedDBUsage: number
  localStorageUsage: number
  totalEntries: number
  hitRate: number
  missRate: number
  evictions: number
  compressionRatio: number
}

export interface CacheState {
  // Configuration
  config: CacheConfig
  
  // Memory cache
  memoryCache: Map<string, CacheEntry>
  
  // Statistics
  stats: CacheStats
  
  // Background sync queue
  syncQueue: string[]
  
  // Actions
  updateConfig: (config: Partial<CacheConfig>) => void
  get: <T>(key: string, fallback?: () => Promise<T>) => Promise<T | null>
  set: <T>(key: string, value: T, options?: CacheSetOptions) => Promise<void>
  delete: (key: string) => Promise<void>
  clear: (pattern?: string) => Promise<void>
  invalidate: (tags: string[]) => Promise<void>
  getStats: () => CacheStats
  preload: (keys: string[]) => Promise<void>
  warmup: (data: Record<string, any>) => Promise<void>
  getStorageAdapters: () => StorageAdapter[]
  evictIfNeeded: () => Promise<void>
  updateStats: () => void
}

export interface CacheSetOptions {
  ttl?: number
  tags?: string[]
  compress?: boolean
  encrypt?: boolean
  metadata?: Record<string, any>
}

// ===== CONSTANTS =====
export const DEFAULT_CONFIG: CacheConfig = {
  maxMemorySize: 50 * 1024 * 1024, // 50MB
  maxIndexedDBSize: 500 * 1024 * 1024, // 500MB
  defaultTTL: 60 * 60 * 1000, // 1 hour
  compressionThreshold: 1024, // 1KB
  encryptionEnabled: false,
  backgroundSyncEnabled: true,
  evictionPolicy: 'lru',
  persistenceLayer: 'all',
  syncInterval: 30000 // 30 seconds
}

export const CACHE_KEYS = {
  USER_PROFILE: 'user:profile',
  USER_PREFERENCES: 'user:preferences',
  API_RESPONSES: 'api:responses',
  STATIC_DATA: 'static:data',
  FORM_DATA: 'form:data',
  ANALYTICS: 'analytics:data'
} as const

// ===== UTILITY FUNCTIONS =====

// Calculate object size in bytes
const calculateSize = (obj: any): number => {
  return new Blob([JSON.stringify(obj)]).size
}

// Compress data using built-in compression
const compress = async (data: string): Promise<string> => {
  if (typeof CompressionStream === 'undefined') {
    return data // Fallback if compression not supported
  }
  
  const stream = new CompressionStream('gzip')
  const writer = stream.writable.getWriter()
  const reader = stream.readable.getReader()
  
  writer.write(new TextEncoder().encode(data))
  writer.close()
  
  const chunks: Uint8Array[] = []
  let done = false
  
  while (!done) {
    const { value, done: readerDone } = await reader.read()
    done = readerDone
    if (value) chunks.push(value)
  }
  
  const compressed = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0))
  let offset = 0
  for (const chunk of chunks) {
    compressed.set(chunk, offset)
    offset += chunk.length
  }
  
  return btoa(String.fromCharCode(...compressed))
}

// Decompress data
const decompress = async (compressedData: string): Promise<string> => {
  if (typeof DecompressionStream === 'undefined') {
    return compressedData // Fallback if decompression not supported
  }
  
  const compressed = Uint8Array.from(atob(compressedData), c => c.charCodeAt(0))
  
  const stream = new DecompressionStream('gzip')
  const writer = stream.writable.getWriter()
  const reader = stream.readable.getReader()
  
  writer.write(compressed)
  writer.close()
  
  const chunks: Uint8Array[] = []
  let done = false
  
  while (!done) {
    const { value, done: readerDone } = await reader.read()
    done = readerDone
    if (value) chunks.push(value)
  }
  
  const decompressed = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0))
  let offset = 0
  for (const chunk of chunks) {
    decompressed.set(chunk, offset)
    offset += chunk.length
  }
  
  return new TextDecoder().decode(decompressed)
}

// Simple encryption (for demo purposes - use proper encryption in production)
const encrypt = (data: string, key: string = 'default-key'): string => {
  let result = ''
  for (let i = 0; i < data.length; i++) {
    result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length))
  }
  return btoa(result)
}

// Simple decryption
const decrypt = (encryptedData: string, key: string = 'default-key'): string => {
  const data = atob(encryptedData)
  let result = ''
  for (let i = 0; i < data.length; i++) {
    result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length))
  }
  return result
}

// Generate cache key with namespace
const generateKey = (namespace: string, key: string): string => {
  return `cache:${namespace}:${key}`
}

// Check if entry is expired
const isExpired = (entry: CacheEntry): boolean => {
  if (!entry.ttl) return false
  return Date.now() > entry.timestamp + entry.ttl
}

// ===== STORAGE ADAPTERS =====

// Memory Storage Adapter
class MemoryStorageAdapter implements StorageAdapter {
  private storage = new Map<string, any>()
  
  async get<T>(key: string): Promise<T | null> {
    return this.storage.get(key) || null
  }
  
  async set<T>(key: string, value: T): Promise<void> {
    this.storage.set(key, value)
  }
  
  async delete(key: string): Promise<void> {
    this.storage.delete(key)
  }
  
  async clear(): Promise<void> {
    this.storage.clear()
  }
  
  async keys(): Promise<string[]> {
    return Array.from(this.storage.keys())
  }
  
  async size(): Promise<number> {
    return this.storage.size
  }
}

// LocalStorage Adapter
class LocalStorageAdapter implements StorageAdapter {
  async get<T>(key: string): Promise<T | null> {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  }
  
  async set<T>(key: string, value: T): Promise<void> {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn('LocalStorage quota exceeded:', error)
      throw error
    }
  }
  
  async delete(key: string): Promise<void> {
    localStorage.removeItem(key)
  }
  
  async clear(): Promise<void> {
    localStorage.clear()
  }
  
  async keys(): Promise<string[]> {
    return Object.keys(localStorage)
  }
  
  async size(): Promise<number> {
    return localStorage.length
  }
}

// IndexedDB Adapter
class IndexedDBAdapter implements StorageAdapter {
  private dbName = 'CacheDB'
  private storeName = 'cache'
  private version = 1
  
  private async getDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result)
      
      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName)
        }
      }
    })
  }
  
  async get<T>(key: string): Promise<T | null> {
    try {
      const db = await this.getDB()
      const transaction = db.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      
      return new Promise((resolve, reject) => {
        const request = store.get(key)
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result || null)
      })
    } catch {
      return null
    }
  }
  
  async set<T>(key: string, value: T): Promise<void> {
    const db = await this.getDB()
    const transaction = db.transaction([this.storeName], 'readwrite')
    const store = transaction.objectStore(this.storeName)
    
    return new Promise((resolve, reject) => {
      const request = store.put(value, key)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }
  
  async delete(key: string): Promise<void> {
    const db = await this.getDB()
    const transaction = db.transaction([this.storeName], 'readwrite')
    const store = transaction.objectStore(this.storeName)
    
    return new Promise((resolve, reject) => {
      const request = store.delete(key)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }
  
  async clear(): Promise<void> {
    const db = await this.getDB()
    const transaction = db.transaction([this.storeName], 'readwrite')
    const store = transaction.objectStore(this.storeName)
    
    return new Promise((resolve, reject) => {
      const request = store.clear()
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }
  
  async keys(): Promise<string[]> {
    const db = await this.getDB()
    const transaction = db.transaction([this.storeName], 'readonly')
    const store = transaction.objectStore(this.storeName)
    
    return new Promise((resolve, reject) => {
      const request = store.getAllKeys()
      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result as string[])
    })
  }
  
  async size(): Promise<number> {
    const keys = await this.keys()
    return keys.length
  }
}

// ===== CACHE STORE =====
export const useCacheStore = create<CacheState>()(
  immer((set, get) => ({
    config: DEFAULT_CONFIG,
    memoryCache: new Map(),
    stats: {
      memoryUsage: 0,
      indexedDBUsage: 0,
      localStorageUsage: 0,
      totalEntries: 0,
      hitRate: 0,
      missRate: 0,
      evictions: 0,
      compressionRatio: 0
    },
    syncQueue: [],
    
    updateConfig: (newConfig) => {
      set(state => {
        Object.assign(state.config, newConfig)
      })
    },
    
    get: async <T>(key: string, fallback?: () => Promise<T>): Promise<T | null> => {
      const { memoryCache, config } = get()
      
      // Check memory cache first
      const memoryEntry = memoryCache.get(key)
      if (memoryEntry && !isExpired(memoryEntry)) {
        // Update access statistics
        set(state => {
          const entry = state.memoryCache.get(key)
          if (entry) {
            entry.accessCount++
            entry.lastAccessed = Date.now()
          }
        })
        
        let value = memoryEntry.value
        
        // Decrypt if needed
        if (memoryEntry.encrypted) {
          value = decrypt(value)
        }
        
        // Decompress if needed
        if (memoryEntry.compressed) {
          value = await decompress(value)
        }
        
        // Parse if string
        if (typeof value === 'string') {
          try {
            value = JSON.parse(value)
          } catch {
            // Keep as string if not JSON
          }
        }
        
        return value
      }
      
      // Check persistent storage
      if (config.persistenceLayer !== 'memory') {
        const adapters = get().getStorageAdapters()
        
        for (const adapter of adapters) {
          try {
            const entry = await adapter.get<CacheEntry>(key)
            if (entry && !isExpired(entry)) {
              // Move to memory cache
              set(state => {
                state.memoryCache.set(key, entry)
              })
              
              return get().get(key) // Recursive call to handle decompression/decryption
            }
          } catch (error) {
            console.warn('Cache adapter error:', error)
          }
        }
      }
      
      // Use fallback if provided
      if (fallback) {
        try {
          const value = await fallback()
          await get().set(key, value)
          return value
        } catch (error) {
          console.warn('Cache fallback error:', error)
        }
      }
      
      return null
    },
    
    set: async <T>(key: string, value: T, options: CacheSetOptions = {}): Promise<void> => {
      const { config } = get()
      const now = Date.now()
      
      let processedValue: any = value
      let compressed = false
      let encrypted = false
      
      // Serialize value
      if (typeof value !== 'string') {
        processedValue = JSON.stringify(value)
      }
      
      // Calculate size
      const size = calculateSize(processedValue)
      
      // Compress if needed
      if (options.compress !== false && size > config.compressionThreshold) {
        processedValue = await compress(processedValue)
        compressed = true
      }
      
      // Encrypt if needed
      if (options.encrypt || config.encryptionEnabled) {
        processedValue = encrypt(processedValue)
        encrypted = true
      }
      
      const entry: CacheEntry<T> = {
        key,
        value: processedValue,
        timestamp: now,
        ttl: options.ttl || config.defaultTTL,
        accessCount: 0,
        lastAccessed: now,
        size,
        compressed,
        encrypted,
        tags: options.tags || [],
        metadata: options.metadata || {}
      }
      
      // Add to memory cache
      set(state => {
        state.memoryCache.set(key, entry)
      })
      
      // Evict if necessary
      await get().evictIfNeeded()
      
      // Persist to storage
      if (config.persistenceLayer !== 'memory') {
        const adapters = get().getStorageAdapters()
        
        for (const adapter of adapters) {
          try {
            await adapter.set(key, entry)
          } catch (error) {
            console.warn('Cache persistence error:', error)
          }
        }
      }
      
      // Update statistics
      get().updateStats()
    },
    
    delete: async (key: string): Promise<void> => {
      const { config } = get()
      
      // Remove from memory
      set(state => {
        state.memoryCache.delete(key)
      })
      
      // Remove from persistent storage
      if (config.persistenceLayer !== 'memory') {
        const adapters = get().getStorageAdapters()
        
        for (const adapter of adapters) {
          try {
            await adapter.delete(key)
          } catch (error) {
            console.warn('Cache deletion error:', error)
          }
        }
      }
      
      get().updateStats()
    },
    
    clear: async (pattern?: string): Promise<void> => {
      const { memoryCache, config } = get()
      
      if (pattern) {
        // Clear by pattern
        const regex = new RegExp(pattern)
        const keysToDelete = Array.from(memoryCache.keys()).filter(key => regex.test(key))
        
        for (const key of keysToDelete) {
          await get().delete(key)
        }
      } else {
        // Clear all
        set(state => {
          state.memoryCache.clear()
        })
        
        if (config.persistenceLayer !== 'memory') {
          const adapters = get().getStorageAdapters()
          
          for (const adapter of adapters) {
            try {
              await adapter.clear()
            } catch (error) {
              console.warn('Cache clear error:', error)
            }
          }
        }
      }
      
      get().updateStats()
    },
    
    invalidate: async (tags: string[]): Promise<void> => {
      const { memoryCache } = get()
      const keysToDelete: string[] = []
      
      for (const [key, entry] of memoryCache) {
        if (entry.tags.some(tag => tags.includes(tag))) {
          keysToDelete.push(key)
        }
      }
      
      for (const key of keysToDelete) {
        await get().delete(key)
      }
    },
    
    getStats: (): CacheStats => {
      return get().stats
    },
    
    preload: async (keys: string[]): Promise<void> => {
      const promises = keys.map(key => get().get(key))
      await Promise.allSettled(promises)
    },
    
    warmup: async (data: Record<string, any>): Promise<void> => {
      const promises = Object.entries(data).map(([key, value]) => 
        get().set(key, value)
      )
      await Promise.allSettled(promises)
    },
    
    // Helper methods
    getStorageAdapters: (): StorageAdapter[] => {
      const { config } = get()
      const adapters: StorageAdapter[] = []
      
      if (config.persistenceLayer === 'localStorage' || config.persistenceLayer === 'all') {
        adapters.push(new LocalStorageAdapter())
      }
      
      if (config.persistenceLayer === 'indexedDB' || config.persistenceLayer === 'all') {
        adapters.push(new IndexedDBAdapter())
      }
      
      return adapters
    },
    
    evictIfNeeded: async (): Promise<void> => {
      const { memoryCache, config } = get()
      const currentSize = Array.from(memoryCache.values()).reduce((sum, entry) => sum + entry.size, 0)
      
      if (currentSize <= config.maxMemorySize) return
      
      const entries = Array.from(memoryCache.entries())
      
      // Sort by eviction policy
      switch (config.evictionPolicy) {
        case 'lru':
          entries.sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed)
          break
        case 'lfu':
          entries.sort(([, a], [, b]) => a.accessCount - b.accessCount)
          break
        case 'ttl':
          entries.sort(([, a], [, b]) => (a.timestamp + (a.ttl || 0)) - (b.timestamp + (b.ttl || 0)))
          break
      }
      
      // Evict entries until under limit
      let evictedSize = 0
      let evictedCount = 0
      
      for (const [key, entry] of entries) {
        if (currentSize - evictedSize <= config.maxMemorySize) break
        
        await get().delete(key)
        evictedSize += entry.size
        evictedCount++
      }
      
      // Update stats
      set(state => {
        state.stats.evictions += evictedCount
      })
    },
    
    updateStats: (): void => {
      const { memoryCache } = get()
      const entries = Array.from(memoryCache.values())
      
      set(state => {
        state.stats.memoryUsage = entries.reduce((sum, entry) => sum + entry.size, 0)
        state.stats.totalEntries = entries.length
        
        const totalAccess = entries.reduce((sum, entry) => sum + entry.accessCount, 0)
        const totalSize = entries.reduce((sum, entry) => sum + entry.size, 0)
        const compressedSize = entries
          .filter(entry => entry.compressed)
          .reduce((sum, entry) => sum + entry.size, 0)
        
        state.stats.compressionRatio = totalSize > 0 ? compressedSize / totalSize : 0
      })
    }
  }))
)

// ===== CACHE MANAGER CLASS =====
export class CacheManager {
  private store = useCacheStore.getState()
  private syncInterval: NodeJS.Timeout | null = null
  
  constructor() {
    this.setupBackgroundSync()
    this.setupCleanup()
  }
  
  // Setup background sync
  private setupBackgroundSync(): void {
    if (!this.store.config.backgroundSyncEnabled) return
    
    this.syncInterval = setInterval(() => {
      this.cleanup()
    }, this.store.config.syncInterval)
  }
  
  // Setup cleanup of expired entries
  private setupCleanup(): void {
    setInterval(() => {
      this.cleanupExpired()
    }, 60000) // Every minute
  }
  
  // Clean up expired entries
  private async cleanupExpired(): Promise<void> {
    const { memoryCache } = this.store
    const expiredKeys: string[] = []
    
    for (const [key, entry] of memoryCache) {
      if (isExpired(entry)) {
        expiredKeys.push(key)
      }
    }
    
    for (const key of expiredKeys) {
      await this.store.delete(key)
    }
  }
  
  // General cleanup
  private async cleanup(): Promise<void> {
    await this.cleanupExpired()
    await this.store.evictIfNeeded()
  }
  
  // Namespace-specific methods
  createNamespace(namespace: string) {
    return {
      get: <T>(key: string, fallback?: () => Promise<T>) => 
        this.store.get<T>(generateKey(namespace, key), fallback),
      
      set: <T>(key: string, value: T, options?: CacheSetOptions) => 
        this.store.set(generateKey(namespace, key), value, options),
      
      delete: (key: string) => 
        this.store.delete(generateKey(namespace, key)),
      
      clear: () => 
        this.store.clear(`^cache:${namespace}:`),
      
      invalidate: (tags: string[]) => 
        this.store.invalidate(tags)
    }
  }
  
  destroy(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
  }
}

// ===== HOOKS =====

// Main cache hook
export const useCache = () => {
  const store = useCacheStore()
  
  return {
    ...store,
    namespace: (namespace: string) => cacheManager.createNamespace(namespace)
  }
}

// Cached data hook
export const useCachedData = <T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheSetOptions & { enabled?: boolean } = {}
) => {
  const [data, setData] = React.useState<T | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)
  const { get, set } = useCacheStore()
  
  const fetchData = React.useCallback(async () => {
    if (!options.enabled) return
    
    setLoading(true)
    setError(null)
    
    try {
      const cachedData = await get<T>(key)
      
      if (cachedData) {
        setData(cachedData)
        setLoading(false)
        return
      }
      
      const freshData = await fetcher()
      await set(key, freshData, options)
      setData(freshData)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [key, fetcher, options.enabled])
  
  React.useEffect(() => {
    fetchData()
  }, [fetchData])
  
  const refetch = React.useCallback(() => {
    return fetchData()
  }, [fetchData])
  
  const invalidate = React.useCallback(async () => {
    await useCacheStore.getState().delete(key)
    return fetchData()
  }, [key, fetchData])
  
  return {
    data,
    loading,
    error,
    refetch,
    invalidate
  }
}

// Cache statistics hook
export const useCacheStats = () => {
  const { stats } = useCacheStore()
  
  return stats
}

// ===== DEFAULT INSTANCE =====
export const cacheManager = new CacheManager()



// React import
import React from 'react'