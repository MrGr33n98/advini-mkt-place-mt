/**
 * Sistema de Integração Frontend-Backend com Active Admin
 * 
 * Este sistema permite que o Active Admin (Rails) administre completamente
 * o frontend Next.js através de APIs e configurações dinâmicas.
 * 
 * Funcionalidades:
 * - Configuração dinâmica de componentes
 * - Gerenciamento de conteúdo via CMS
 * - Controle de features flags
 * - Personalização de temas e layouts
 * - Administração de usuários e permissões
 * - Analytics e monitoramento
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

// ===== TYPES =====

export interface AdminConfig {
  id: string
  key: string
  value: any
  type: 'string' | 'number' | 'boolean' | 'object' | 'array'
  category: string
  description: string
  isActive: boolean
  updatedAt: Date
}

export interface ContentBlock {
  id: string
  type: 'hero' | 'features' | 'testimonials' | 'pricing' | 'faq' | 'custom'
  title: string
  content: any
  metadata: Record<string, any>
  isPublished: boolean
  order: number
  pageId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Page {
  id: string
  slug: string
  title: string
  description: string
  metaTitle?: string
  metaDescription?: string
  blocks: ContentBlock[]
  layout: string
  isPublished: boolean
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Theme {
  id: string
  name: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
    muted: string
    border: string
  }
  fonts: {
    heading: string
    body: string
  }
  spacing: Record<string, string>
  borderRadius: Record<string, string>
  isActive: boolean
}

export interface FeatureFlag {
  id: string
  key: string
  name: string
  description: string
  isEnabled: boolean
  rolloutPercentage: number
  targetAudience?: string[]
  startDate?: Date
  endDate?: Date
  metadata: Record<string, any>
}

export interface AdminUser {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'admin' | 'editor' | 'viewer'
  permissions: string[]
  lastLoginAt?: Date
  isActive: boolean
}

export interface AdminState {
  // Configuration
  configs: AdminConfig[]
  
  // Content Management
  pages: Page[]
  contentBlocks: ContentBlock[]
  
  // Theme & Design
  activeTheme: Theme | null
  availableThemes: Theme[]
  
  // Feature Flags
  featureFlags: FeatureFlag[]
  
  // Users & Permissions
  adminUsers: AdminUser[]
  currentUser: AdminUser | null
  
  // System Status
  isLoading: boolean
  lastSync: Date | null
  errors: string[]
  
  // Actions
  fetchConfigs: () => Promise<void>
  updateConfig: (key: string, value: any) => Promise<void>
  
  fetchPages: () => Promise<void>
  createPage: (page: Omit<Page, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updatePage: (id: string, updates: Partial<Page>) => Promise<void>
  deletePage: (id: string) => Promise<void>
  
  fetchContentBlocks: () => Promise<void>
  createContentBlock: (block: Omit<ContentBlock, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateContentBlock: (id: string, updates: Partial<ContentBlock>) => Promise<void>
  deleteContentBlock: (id: string) => Promise<void>
  
  fetchThemes: () => Promise<void>
  setActiveTheme: (themeId: string) => Promise<void>
  
  fetchFeatureFlags: () => Promise<void>
  updateFeatureFlag: (id: string, updates: Partial<FeatureFlag>) => Promise<void>
  
  fetchAdminUsers: () => Promise<void>
  authenticate: (email: string, password: string) => Promise<void>
  logout: () => void
  
  syncWithBackend: () => Promise<void>
  clearErrors: () => void
}

// ===== CONSTANTS =====

export const ADMIN_API_ENDPOINTS = {
  configs: '/api/admin/configs',
  pages: '/api/admin/pages',
  contentBlocks: '/api/admin/content_blocks',
  themes: '/api/admin/themes',
  featureFlags: '/api/admin/feature_flags',
  users: '/api/admin/users',
  auth: '/api/admin/auth',
  sync: '/api/admin/sync',
} as const

export const DEFAULT_THEME: Theme = {
  id: 'default',
  name: 'Default Theme',
  colors: {
    primary: '#3b82f6',
    secondary: '#64748b',
    accent: '#f59e0b',
    background: '#ffffff',
    foreground: '#0f172a',
    muted: '#f8fafc',
    border: '#e2e8f0',
  },
  fonts: {
    heading: 'Inter',
    body: 'Inter',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
  isActive: true,
}

// ===== UTILITY FUNCTIONS =====

export const adminApiClient = {
  async get<T>(endpoint: string): Promise<T> {
    const token = localStorage.getItem('admin_token')
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }
    
    return response.json()
  },
  
  async post<T>(endpoint: string, data: any): Promise<T> {
    const token = localStorage.getItem('admin_token')
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }
    
    return response.json()
  },
  
  async put<T>(endpoint: string, data: any): Promise<T> {
    const token = localStorage.getItem('admin_token')
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }
    
    return response.json()
  },
  
  async delete<T>(endpoint: string): Promise<T> {
    const token = localStorage.getItem('admin_token')
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }
    
    return response.json()
  },
}

// ===== ZUSTAND STORE =====

export const useAdminStore = create<AdminState>()(
  persist(
    immer((set, get) => ({
      // Initial State
      configs: [],
      pages: [],
      contentBlocks: [],
      activeTheme: DEFAULT_THEME,
      availableThemes: [DEFAULT_THEME],
      featureFlags: [],
      adminUsers: [],
      currentUser: null,
      isLoading: false,
      lastSync: null,
      errors: [],
      
      // Configuration Actions
      fetchConfigs: async () => {
        try {
          set((state) => { state.isLoading = true })
          const configs = await adminApiClient.get<AdminConfig[]>(ADMIN_API_ENDPOINTS.configs)
          set((state) => {
            state.configs = configs
            state.isLoading = false
          })
        } catch (error) {
          set((state) => {
            state.errors.push(error instanceof Error ? error.message : 'Failed to fetch configs')
            state.isLoading = false
          })
        }
      },
      
      updateConfig: async (key: string, value: any) => {
        try {
          const updatedConfig = await adminApiClient.put<AdminConfig>(
            `${ADMIN_API_ENDPOINTS.configs}/${key}`,
            { value }
          )
          set((state) => {
            const index = state.configs.findIndex(c => c.key === key)
            if (index !== -1) {
              state.configs[index] = updatedConfig
            }
          })
        } catch (error) {
          set((state) => {
            state.errors.push(error instanceof Error ? error.message : 'Failed to update config')
          })
        }
      },
      
      // Page Management Actions
      fetchPages: async () => {
        try {
          set((state) => { state.isLoading = true })
          const pages = await adminApiClient.get<Page[]>(ADMIN_API_ENDPOINTS.pages)
          set((state) => {
            state.pages = pages
            state.isLoading = false
          })
        } catch (error) {
          set((state) => {
            state.errors.push(error instanceof Error ? error.message : 'Failed to fetch pages')
            state.isLoading = false
          })
        }
      },
      
      createPage: async (pageData) => {
        try {
          const newPage = await adminApiClient.post<Page>(ADMIN_API_ENDPOINTS.pages, pageData)
          set((state) => {
            state.pages.push(newPage)
          })
        } catch (error) {
          set((state) => {
            state.errors.push(error instanceof Error ? error.message : 'Failed to create page')
          })
        }
      },
      
      updatePage: async (id: string, updates: Partial<Page>) => {
        try {
          const updatedPage = await adminApiClient.put<Page>(
            `${ADMIN_API_ENDPOINTS.pages}/${id}`,
            updates
          )
          set((state) => {
            const index = state.pages.findIndex(p => p.id === id)
            if (index !== -1) {
              state.pages[index] = updatedPage
            }
          })
        } catch (error) {
          set((state) => {
            state.errors.push(error instanceof Error ? error.message : 'Failed to update page')
          })
        }
      },
      
      deletePage: async (id: string) => {
        try {
          await adminApiClient.delete(`${ADMIN_API_ENDPOINTS.pages}/${id}`)
          set((state) => {
            state.pages = state.pages.filter(p => p.id !== id)
          })
        } catch (error) {
          set((state) => {
            state.errors.push(error instanceof Error ? error.message : 'Failed to delete page')
          })
        }
      },
      
      // Content Block Actions
      fetchContentBlocks: async () => {
        try {
          const blocks = await adminApiClient.get<ContentBlock[]>(ADMIN_API_ENDPOINTS.contentBlocks)
          set((state) => {
            state.contentBlocks = blocks
          })
        } catch (error) {
          set((state) => {
            state.errors.push(error instanceof Error ? error.message : 'Failed to fetch content blocks')
          })
        }
      },
      
      createContentBlock: async (blockData) => {
        try {
          const newBlock = await adminApiClient.post<ContentBlock>(
            ADMIN_API_ENDPOINTS.contentBlocks,
            blockData
          )
          set((state) => {
            state.contentBlocks.push(newBlock)
          })
        } catch (error) {
          set((state) => {
            state.errors.push(error instanceof Error ? error.message : 'Failed to create content block')
          })
        }
      },
      
      updateContentBlock: async (id: string, updates: Partial<ContentBlock>) => {
        try {
          const updatedBlock = await adminApiClient.put<ContentBlock>(
            `${ADMIN_API_ENDPOINTS.contentBlocks}/${id}`,
            updates
          )
          set((state) => {
            const index = state.contentBlocks.findIndex(b => b.id === id)
            if (index !== -1) {
              state.contentBlocks[index] = updatedBlock
            }
          })
        } catch (error) {
          set((state) => {
            state.errors.push(error instanceof Error ? error.message : 'Failed to update content block')
          })
        }
      },
      
      deleteContentBlock: async (id: string) => {
        try {
          await adminApiClient.delete(`${ADMIN_API_ENDPOINTS.contentBlocks}/${id}`)
          set((state) => {
            state.contentBlocks = state.contentBlocks.filter(b => b.id !== id)
          })
        } catch (error) {
          set((state) => {
            state.errors.push(error instanceof Error ? error.message : 'Failed to delete content block')
          })
        }
      },
      
      // Theme Actions
      fetchThemes: async () => {
        try {
          const themes = await adminApiClient.get<Theme[]>(ADMIN_API_ENDPOINTS.themes)
          set((state) => {
            state.availableThemes = themes
            const activeTheme = themes.find(t => t.isActive)
            if (activeTheme) {
              state.activeTheme = activeTheme
            }
          })
        } catch (error) {
          set((state) => {
            state.errors.push(error instanceof Error ? error.message : 'Failed to fetch themes')
          })
        }
      },
      
      setActiveTheme: async (themeId: string) => {
        try {
          const theme = await adminApiClient.put<Theme>(
            `${ADMIN_API_ENDPOINTS.themes}/${themeId}/activate`,
            {}
          )
          set((state) => {
            state.activeTheme = theme
            state.availableThemes = state.availableThemes.map(t => ({
              ...t,
              isActive: t.id === themeId
            }))
          })
        } catch (error) {
          set((state) => {
            state.errors.push(error instanceof Error ? error.message : 'Failed to set active theme')
          })
        }
      },
      
      // Feature Flag Actions
      fetchFeatureFlags: async () => {
        try {
          const flags = await adminApiClient.get<FeatureFlag[]>(ADMIN_API_ENDPOINTS.featureFlags)
          set((state) => {
            state.featureFlags = flags
          })
        } catch (error) {
          set((state) => {
            state.errors.push(error instanceof Error ? error.message : 'Failed to fetch feature flags')
          })
        }
      },
      
      updateFeatureFlag: async (id: string, updates: Partial<FeatureFlag>) => {
        try {
          const updatedFlag = await adminApiClient.put<FeatureFlag>(
            `${ADMIN_API_ENDPOINTS.featureFlags}/${id}`,
            updates
          )
          set((state) => {
            const index = state.featureFlags.findIndex(f => f.id === id)
            if (index !== -1) {
              state.featureFlags[index] = updatedFlag
            }
          })
        } catch (error) {
          set((state) => {
            state.errors.push(error instanceof Error ? error.message : 'Failed to update feature flag')
          })
        }
      },
      
      // User Management Actions
      fetchAdminUsers: async () => {
        try {
          const users = await adminApiClient.get<AdminUser[]>(ADMIN_API_ENDPOINTS.users)
          set((state) => {
            state.adminUsers = users
          })
        } catch (error) {
          set((state) => {
            state.errors.push(error instanceof Error ? error.message : 'Failed to fetch admin users')
          })
        }
      },
      
      authenticate: async (email: string, password: string) => {
        try {
          const response = await adminApiClient.post<{ token: string; user: AdminUser }>(
            ADMIN_API_ENDPOINTS.auth,
            { email, password }
          )
          localStorage.setItem('admin_token', response.token)
          set((state) => {
            state.currentUser = response.user
          })
        } catch (error) {
          set((state) => {
            state.errors.push(error instanceof Error ? error.message : 'Authentication failed')
          })
        }
      },
      
      logout: () => {
        localStorage.removeItem('admin_token')
        set((state) => {
          state.currentUser = null
        })
      },
      
      // Sync Actions
      syncWithBackend: async () => {
        try {
          set((state) => { state.isLoading = true })
          
          await Promise.all([
            get().fetchConfigs(),
            get().fetchPages(),
            get().fetchContentBlocks(),
            get().fetchThemes(),
            get().fetchFeatureFlags(),
            get().fetchAdminUsers(),
          ])
          
          set((state) => {
            state.lastSync = new Date()
            state.isLoading = false
          })
        } catch (error) {
          set((state) => {
            state.errors.push(error instanceof Error ? error.message : 'Sync failed')
            state.isLoading = false
          })
        }
      },
      
      clearErrors: () => {
        set((state) => {
          state.errors = []
        })
      },
    })),
    {
      name: 'admin-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        activeTheme: state.activeTheme,
        currentUser: state.currentUser,
        lastSync: state.lastSync,
      }),
    }
  )
)

// ===== HOOKS =====

export const useAdminConfig = (key: string) => {
  const configs = useAdminStore(state => state.configs)
  const updateConfig = useAdminStore(state => state.updateConfig)
  
  const config = configs.find(c => c.key === key)
  
  return {
    value: config?.value,
    isActive: config?.isActive ?? false,
    updateValue: (value: any) => updateConfig(key, value),
  }
}

export const useFeatureFlag = (key: string) => {
  const featureFlags = useAdminStore(state => state.featureFlags)
  
  const flag = featureFlags.find(f => f.key === key)
  
  return {
    isEnabled: flag?.isEnabled ?? false,
    rolloutPercentage: flag?.rolloutPercentage ?? 0,
    metadata: flag?.metadata ?? {},
  }
}

export const useTheme = () => {
  const activeTheme = useAdminStore(state => state.activeTheme)
  const availableThemes = useAdminStore(state => state.availableThemes)
  const setActiveTheme = useAdminStore(state => state.setActiveTheme)
  
  return {
    activeTheme,
    availableThemes,
    setActiveTheme,
  }
}

export const useContentBlocks = (pageId?: string) => {
  const contentBlocks = useAdminStore(state => state.contentBlocks)
  
  const blocks = pageId 
    ? contentBlocks.filter(b => b.pageId === pageId && b.isPublished)
    : contentBlocks.filter(b => b.isPublished)
  
  return blocks.sort((a, b) => a.order - b.order)
}

// ===== ADMIN MANAGER CLASS =====

export class AdminManager {
  private store = useAdminStore.getState()
  
  async initialize() {
    await this.store.syncWithBackend()
    this.setupAutoSync()
  }
  
  private setupAutoSync() {
    // Sync every 5 minutes
    setInterval(() => {
      this.store.syncWithBackend()
    }, 5 * 60 * 1000)
  }
  
  getConfig(key: string, defaultValue?: any) {
    const config = this.store.configs.find(c => c.key === key)
    return config?.isActive ? config.value : defaultValue
  }
  
  isFeatureEnabled(key: string): boolean {
    const flag = this.store.featureFlags.find(f => f.key === key)
    if (!flag) return false
    
    // Check rollout percentage
    if (flag.rolloutPercentage < 100) {
      const userId = this.store.currentUser?.id
      if (userId) {
        const hash = this.hashString(userId + flag.key)
        const percentage = hash % 100
        return percentage < flag.rolloutPercentage
      }
    }
    
    return flag.isEnabled
  }
  
  private hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }
  
  applyTheme() {
    const theme = this.store.activeTheme
    if (!theme) return
    
    const root = document.documentElement
    
    // Apply CSS custom properties
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })
    
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value)
    })
    
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value)
    })
    
    // Apply fonts
    root.style.setProperty('--font-heading', theme.fonts.heading)
    root.style.setProperty('--font-body', theme.fonts.body)
  }
}

// Export singleton instance
export const adminManager = new AdminManager()