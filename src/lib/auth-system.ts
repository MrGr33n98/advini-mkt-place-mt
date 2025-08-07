/**
 * Modern Authentication & Authorization System
 * Arquitetura baseada em benchmarks da indústria:
 * - JWT Token Management
 * - Role-Based Access Control (RBAC)
 * - Permission-Based Access Control (PBAC)
 * - Secure Session Management
 * - Multi-Factor Authentication (MFA)
 * - OAuth Integration Ready
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

// ===== TYPES =====
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  roles: Role[]
  permissions: Permission[]
  profile: UserProfile
  preferences: UserPreferences
  lastLoginAt?: Date
  emailVerifiedAt?: Date
  mfaEnabled: boolean
  status: 'active' | 'inactive' | 'suspended' | 'pending'
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: Permission[]
  isSystem: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Permission {
  id: string
  name: string
  resource: string
  action: string
  description: string
  isSystem: boolean
}

export interface UserProfile {
  firstName: string
  lastName: string
  phone?: string
  birthDate?: Date
  address?: Address
  profession?: string
  specialization?: string
  license?: string
  bio?: string
}

export interface Address {
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface UserPreferences {
  language: string
  timezone: string
  theme: 'light' | 'dark' | 'system'
  notifications: NotificationPreferences
  privacy: PrivacyPreferences
}

export interface NotificationPreferences {
  email: boolean
  push: boolean
  sms: boolean
  inApp: boolean
  marketing: boolean
  appointments: boolean
  reminders: boolean
}

export interface PrivacyPreferences {
  profileVisibility: 'public' | 'private' | 'contacts'
  showOnlineStatus: boolean
  allowDataCollection: boolean
  allowMarketing: boolean
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresAt: Date
  tokenType: 'Bearer'
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
  mfaCode?: string
}

export interface RegisterData {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  phone?: string
  acceptTerms: boolean
  acceptMarketing?: boolean
}

export interface AuthState {
  // State
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  
  // Session
  sessionId: string | null
  lastActivity: Date | null
  
  // MFA
  mfaPending: boolean
  mfaMethod: 'sms' | 'email' | 'app' | null
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  refreshTokens: () => Promise<void>
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  verifyEmail: (token: string) => Promise<void>
  enableMFA: (method: 'sms' | 'email' | 'app') => Promise<void>
  disableMFA: (password: string) => Promise<void>
  verifyMFA: (code: string) => Promise<void>
  
  // Utilities
  hasRole: (roleName: string) => boolean
  hasPermission: (resource: string, action: string) => boolean
  hasAnyPermission: (permissions: Array<{ resource: string; action: string }>) => boolean
  hasAllPermissions: (permissions: Array<{ resource: string; action: string }>) => boolean
  canAccess: (requiredRoles?: string[], requiredPermissions?: string[]) => boolean
  
  // Internal
  setUser: (user: User | null) => void
  setTokens: (tokens: AuthTokens | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  updateLastActivity: () => void
  clearSession: () => void
}

// ===== CONSTANTS =====
export const AUTH_CONFIG = {
  tokenKey: 'auth-tokens',
  sessionKey: 'auth-session',
  refreshThreshold: 5 * 60 * 1000, // 5 minutes before expiry
  sessionTimeout: 30 * 60 * 1000, // 30 minutes of inactivity
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
  passwordMinLength: 8,
  mfaCodeLength: 6,
  mfaCodeExpiry: 5 * 60 * 1000, // 5 minutes
} as const

// ===== PREDEFINED ROLES & PERMISSIONS =====
export const SYSTEM_PERMISSIONS = {
  // Dashboard
  DASHBOARD_VIEW: { resource: 'dashboard', action: 'view' },
  DASHBOARD_ANALYTICS: { resource: 'dashboard', action: 'analytics' },
  
  // Users
  USERS_VIEW: { resource: 'users', action: 'view' },
  USERS_CREATE: { resource: 'users', action: 'create' },
  USERS_UPDATE: { resource: 'users', action: 'update' },
  USERS_DELETE: { resource: 'users', action: 'delete' },
  
  // Patients
  PATIENTS_VIEW: { resource: 'patients', action: 'view' },
  PATIENTS_CREATE: { resource: 'patients', action: 'create' },
  PATIENTS_UPDATE: { resource: 'patients', action: 'update' },
  PATIENTS_DELETE: { resource: 'patients', action: 'delete' },
  
  // Appointments
  APPOINTMENTS_VIEW: { resource: 'appointments', action: 'view' },
  APPOINTMENTS_CREATE: { resource: 'appointments', action: 'create' },
  APPOINTMENTS_UPDATE: { resource: 'appointments', action: 'update' },
  APPOINTMENTS_DELETE: { resource: 'appointments', action: 'delete' },
  APPOINTMENTS_MANAGE: { resource: 'appointments', action: 'manage' },
  
  // Reports
  REPORTS_VIEW: { resource: 'reports', action: 'view' },
  REPORTS_FINANCIAL: { resource: 'reports', action: 'financial' },
  REPORTS_CLINICAL: { resource: 'reports', action: 'clinical' },
  REPORTS_EXPORT: { resource: 'reports', action: 'export' },
  
  // Settings
  SETTINGS_VIEW: { resource: 'settings', action: 'view' },
  SETTINGS_UPDATE: { resource: 'settings', action: 'update' },
  SETTINGS_SYSTEM: { resource: 'settings', action: 'system' },
  
  // Billing
  BILLING_VIEW: { resource: 'billing', action: 'view' },
  BILLING_MANAGE: { resource: 'billing', action: 'manage' },
  
  // Admin
  ADMIN_FULL: { resource: 'admin', action: '*' },
} as const

export const SYSTEM_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  NURSE: 'nurse',
  RECEPTIONIST: 'receptionist',
  PATIENT: 'patient',
  VIEWER: 'viewer',
} as const

// ===== UTILITY FUNCTIONS =====

// Token management
export const tokenUtils = {
  isExpired: (token: AuthTokens): boolean => {
    return new Date() >= new Date(token.expiresAt)
  },
  
  shouldRefresh: (token: AuthTokens): boolean => {
    const now = new Date()
    const expiresAt = new Date(token.expiresAt)
    const timeUntilExpiry = expiresAt.getTime() - now.getTime()
    return timeUntilExpiry <= AUTH_CONFIG.refreshThreshold
  },
  
  decode: (token: string): any => {
    try {
      const payload = token.split('.')[1]
      return JSON.parse(atob(payload))
    } catch {
      return null
    }
  },
  
  getExpiryDate: (token: string): Date | null => {
    const decoded = tokenUtils.decode(token)
    return decoded?.exp ? new Date(decoded.exp * 1000) : null
  }
}

// Password validation
export const passwordUtils = {
  validate: (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []
    
    if (password.length < AUTH_CONFIG.passwordMinLength) {
      errors.push(`Senha deve ter pelo menos ${AUTH_CONFIG.passwordMinLength} caracteres`)
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra maiúscula')
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra minúscula')
    }
    
    if (!/\d/.test(password)) {
      errors.push('Senha deve conter pelo menos um número')
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Senha deve conter pelo menos um caractere especial')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  },
  
  generateStrong: (): string => {
    const length = 12
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
    let password = ''
    
    // Ensure at least one of each required type
    password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]
    password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]
    password += '0123456789'[Math.floor(Math.random() * 10)]
    password += '!@#$%^&*'[Math.floor(Math.random() * 8)]
    
    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)]
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('')
  }
}

// Session management
export const sessionUtils = {
  generateId: (): string => {
    return crypto.randomUUID()
  },
  
  isExpired: (lastActivity: Date): boolean => {
    const now = new Date()
    const timeSinceActivity = now.getTime() - lastActivity.getTime()
    return timeSinceActivity > AUTH_CONFIG.sessionTimeout
  },
  
  shouldWarn: (lastActivity: Date): boolean => {
    const now = new Date()
    const timeSinceActivity = now.getTime() - lastActivity.getTime()
    const warningThreshold = AUTH_CONFIG.sessionTimeout - (5 * 60 * 1000) // 5 minutes before expiry
    return timeSinceActivity > warningThreshold
  }
}

// ===== AUTH STORE =====
export const useAuthStore = create<AuthState>()(
  persist(
    immer((set, get) => ({
      // Initial state
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      sessionId: null,
      lastActivity: null,
      mfaPending: false,
      mfaMethod: null,
      
      // Actions
      login: async (credentials: LoginCredentials) => {
        set(state => {
          state.isLoading = true
          state.error = null
        })
        
        try {
          // Simulate API call
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
          })
          
          if (!response.ok) {
            throw new Error('Credenciais inválidas')
          }
          
          const data = await response.json()
          
          if (data.mfaRequired) {
            set(state => {
              state.mfaPending = true
              state.mfaMethod = data.mfaMethod
              state.isLoading = false
            })
            return
          }
          
          set(state => {
            state.user = data.user
            state.tokens = data.tokens
            state.isAuthenticated = true
            state.sessionId = sessionUtils.generateId()
            state.lastActivity = new Date()
            state.isLoading = false
            state.mfaPending = false
            state.mfaMethod = null
          })
        } catch (error) {
          set(state => {
            state.error = error instanceof Error ? error.message : 'Erro no login'
            state.isLoading = false
          })
        }
      },
      
      register: async (data: RegisterData) => {
        set(state => {
          state.isLoading = true
          state.error = null
        })
        
        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          })
          
          if (!response.ok) {
            throw new Error('Erro no cadastro')
          }
          
          const result = await response.json()
          
          set(state => {
            state.isLoading = false
          })
          
          // Optionally auto-login after registration
          if (result.autoLogin) {
            await get().login({ email: data.email, password: data.password })
          }
        } catch (error) {
          set(state => {
            state.error = error instanceof Error ? error.message : 'Erro no cadastro'
            state.isLoading = false
          })
        }
      },
      
      logout: async () => {
        const { tokens } = get()
        
        try {
          if (tokens) {
            await fetch('/api/auth/logout', {
              method: 'POST',
              headers: {
                'Authorization': `${tokens.tokenType} ${tokens.accessToken}`,
                'Content-Type': 'application/json'
              }
            })
          }
        } catch (error) {
          console.warn('Logout API call failed:', error)
        } finally {
          get().clearSession()
        }
      },
      
      refreshTokens: async () => {
        const { tokens } = get()
        
        if (!tokens) {
          throw new Error('No refresh token available')
        }
        
        try {
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: tokens.refreshToken })
          })
          
          if (!response.ok) {
            throw new Error('Token refresh failed')
          }
          
          const newTokens = await response.json()
          
          set(state => {
            state.tokens = newTokens
            state.lastActivity = new Date()
          })
        } catch (error) {
          // If refresh fails, logout user
          get().clearSession()
          throw error
        }
      },
      
      updateProfile: async (profile: Partial<UserProfile>) => {
        const { tokens, user } = get()
        
        if (!tokens || !user) {
          throw new Error('User not authenticated')
        }
        
        try {
          const response = await fetch('/api/user/profile', {
            method: 'PATCH',
            headers: {
              'Authorization': `${tokens.tokenType} ${tokens.accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(profile)
          })
          
          if (!response.ok) {
            throw new Error('Profile update failed')
          }
          
          const updatedProfile = await response.json()
          
          set(state => {
            if (state.user) {
              state.user.profile = { ...state.user.profile, ...updatedProfile }
            }
          })
        } catch (error) {
          throw error
        }
      },
      
      updatePreferences: async (preferences: Partial<UserPreferences>) => {
        const { tokens, user } = get()
        
        if (!tokens || !user) {
          throw new Error('User not authenticated')
        }
        
        try {
          const response = await fetch('/api/user/preferences', {
            method: 'PATCH',
            headers: {
              'Authorization': `${tokens.tokenType} ${tokens.accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(preferences)
          })
          
          if (!response.ok) {
            throw new Error('Preferences update failed')
          }
          
          const updatedPreferences = await response.json()
          
          set(state => {
            if (state.user) {
              state.user.preferences = { ...state.user.preferences, ...updatedPreferences }
            }
          })
        } catch (error) {
          throw error
        }
      },
      
      changePassword: async (currentPassword: string, newPassword: string) => {
        const { tokens } = get()
        
        if (!tokens) {
          throw new Error('User not authenticated')
        }
        
        const validation = passwordUtils.validate(newPassword)
        if (!validation.isValid) {
          throw new Error(validation.errors.join(', '))
        }
        
        try {
          const response = await fetch('/api/auth/change-password', {
            method: 'POST',
            headers: {
              'Authorization': `${tokens.tokenType} ${tokens.accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ currentPassword, newPassword })
          })
          
          if (!response.ok) {
            throw new Error('Password change failed')
          }
        } catch (error) {
          throw error
        }
      },
      
      resetPassword: async (email: string) => {
        try {
          const response = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          })
          
          if (!response.ok) {
            throw new Error('Password reset failed')
          }
        } catch (error) {
          throw error
        }
      },
      
      verifyEmail: async (token: string) => {
        try {
          const response = await fetch('/api/auth/verify-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token })
          })
          
          if (!response.ok) {
            throw new Error('Email verification failed')
          }
          
          set(state => {
            if (state.user) {
              state.user.emailVerifiedAt = new Date()
            }
          })
        } catch (error) {
          throw error
        }
      },
      
      enableMFA: async (method: 'sms' | 'email' | 'app') => {
        const { tokens } = get()
        
        if (!tokens) {
          throw new Error('User not authenticated')
        }
        
        try {
          const response = await fetch('/api/auth/mfa/enable', {
            method: 'POST',
            headers: {
              'Authorization': `${tokens.tokenType} ${tokens.accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ method })
          })
          
          if (!response.ok) {
            throw new Error('MFA enable failed')
          }
          
          set(state => {
            if (state.user) {
              state.user.mfaEnabled = true
            }
          })
        } catch (error) {
          throw error
        }
      },
      
      disableMFA: async (password: string) => {
        const { tokens } = get()
        
        if (!tokens) {
          throw new Error('User not authenticated')
        }
        
        try {
          const response = await fetch('/api/auth/mfa/disable', {
            method: 'POST',
            headers: {
              'Authorization': `${tokens.tokenType} ${tokens.accessToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password })
          })
          
          if (!response.ok) {
            throw new Error('MFA disable failed')
          }
          
          set(state => {
            if (state.user) {
              state.user.mfaEnabled = false
            }
          })
        } catch (error) {
          throw error
        }
      },
      
      verifyMFA: async (code: string) => {
        try {
          const response = await fetch('/api/auth/mfa/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code })
          })
          
          if (!response.ok) {
            throw new Error('MFA verification failed')
          }
          
          const data = await response.json()
          
          set(state => {
            state.user = data.user
            state.tokens = data.tokens
            state.isAuthenticated = true
            state.sessionId = sessionUtils.generateId()
            state.lastActivity = new Date()
            state.mfaPending = false
            state.mfaMethod = null
          })
        } catch (error) {
          throw error
        }
      },
      
      // Utility methods
      hasRole: (roleName: string) => {
        const { user } = get()
        return user?.roles.some(role => role.name === roleName) ?? false
      },
      
      hasPermission: (resource: string, action: string) => {
        const { user } = get()
        if (!user) return false
        
        return user.permissions.some(permission => 
          permission.resource === resource && 
          (permission.action === action || permission.action === '*')
        )
      },
      
      hasAnyPermission: (permissions: Array<{ resource: string; action: string }>) => {
        return permissions.some(({ resource, action }) => 
          get().hasPermission(resource, action)
        )
      },
      
      hasAllPermissions: (permissions: Array<{ resource: string; action: string }>) => {
        return permissions.every(({ resource, action }) => 
          get().hasPermission(resource, action)
        )
      },
      
      canAccess: (requiredRoles?: string[], requiredPermissions?: string[]) => {
        const { user } = get()
        if (!user) return false
        
        // Check roles
        if (requiredRoles && requiredRoles.length > 0) {
          const hasRequiredRole = requiredRoles.some(role => get().hasRole(role))
          if (!hasRequiredRole) return false
        }
        
        // Check permissions
        if (requiredPermissions && requiredPermissions.length > 0) {
          const hasRequiredPermissions = requiredPermissions.every(permission => {
            const [resource, action] = permission.split('.')
            return get().hasPermission(resource, action)
          })
          if (!hasRequiredPermissions) return false
        }
        
        return true
      },
      
      // Internal methods
      setUser: (user: User | null) => {
        set(state => {
          state.user = user
          state.isAuthenticated = !!user
        })
      },
      
      setTokens: (tokens: AuthTokens | null) => {
        set(state => {
          state.tokens = tokens
        })
      },
      
      setLoading: (loading: boolean) => {
        set(state => {
          state.isLoading = loading
        })
      },
      
      setError: (error: string | null) => {
        set(state => {
          state.error = error
        })
      },
      
      updateLastActivity: () => {
        set(state => {
          state.lastActivity = new Date()
        })
      },
      
      clearSession: () => {
        set(state => {
          state.user = null
          state.tokens = null
          state.isAuthenticated = false
          state.sessionId = null
          state.lastActivity = null
          state.mfaPending = false
          state.mfaMethod = null
          state.error = null
        })
      }
    })),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        sessionId: state.sessionId,
        lastActivity: state.lastActivity
      })
    }
  )
)

// ===== HOOKS =====

// Main auth hook
export const useAuth = () => {
  const store = useAuthStore()
  
  // Auto-refresh tokens
  React.useEffect(() => {
    const checkTokens = async () => {
      const { tokens, refreshTokens } = store
      
      if (tokens && tokenUtils.shouldRefresh(tokens)) {
        try {
          await refreshTokens()
        } catch (error) {
          console.error('Token refresh failed:', error)
        }
      }
    }
    
    const interval = setInterval(checkTokens, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [store])
  
  // Session timeout check
  React.useEffect(() => {
    const checkSession = () => {
      const { lastActivity, clearSession } = store
      
      if (lastActivity && sessionUtils.isExpired(lastActivity)) {
        clearSession()
      }
    }
    
    const interval = setInterval(checkSession, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [store])
  
  // Update activity on user interaction
  React.useEffect(() => {
    const updateActivity = () => {
      if (store.isAuthenticated) {
        store.updateLastActivity()
      }
    }
    
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true)
    })
    
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true)
      })
    }
  }, [store])
  
  return store
}

// Permission hook
export const usePermissions = () => {
  const { hasRole, hasPermission, hasAnyPermission, hasAllPermissions, canAccess } = useAuth()
  
  return {
    hasRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccess
  }
}



// React import
import React from 'react'