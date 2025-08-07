/**
 * Modern Configuration & Feature Flags System
 * Arquitetura baseada em benchmarks da indústria:
 * - Environment-based configuration
 * - Feature flags with targeting
 * - A/B testing integration
 * - Real-time updates
 * - Type-safe configuration
 * - Validation and schema
 * - Hot reloading
 * - Rollout strategies
 */

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { z } from 'zod'

// ===== TYPES =====
export interface FeatureFlag {
  key: string
  name: string
  description: string
  enabled: boolean
  rolloutPercentage: number
  targeting: TargetingRule[]
  variants?: FeatureVariant[]
  metadata: Record<string, any>
  createdAt: Date
  updatedAt: Date
  createdBy: string
  tags: string[]
}

export interface FeatureVariant {
  key: string
  name: string
  description: string
  value: any
  weight: number
  enabled: boolean
}

export interface TargetingRule {
  id: string
  name: string
  conditions: TargetingCondition[]
  operator: 'AND' | 'OR'
  enabled: boolean
  rolloutPercentage: number
}

export interface TargetingCondition {
  attribute: string
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than' | 'in' | 'not_in' | 'regex'
  value: any
  type: 'string' | 'number' | 'boolean' | 'array' | 'date'
}

export interface UserContext {
  userId?: string
  email?: string
  role?: string
  plan?: string
  country?: string
  language?: string
  platform?: string
  version?: string
  customAttributes: Record<string, any>
}

export interface ConfigSchema {
  [key: string]: {
    type: 'string' | 'number' | 'boolean' | 'object' | 'array'
    default: any
    required?: boolean
    validation?: z.ZodSchema
    description?: string
    sensitive?: boolean
    environment?: string[]
  }
}

export interface Environment {
  name: string
  displayName: string
  description: string
  variables: Record<string, any>
  featureFlags: Record<string, boolean>
  isProduction: boolean
}

export interface ConfigState {
  // Current environment
  currentEnvironment: string
  environments: Record<string, Environment>
  
  // Feature flags
  featureFlags: Record<string, FeatureFlag>
  evaluatedFlags: Record<string, any>
  
  // Configuration
  config: Record<string, any>
  schema: ConfigSchema
  
  // User context
  userContext: UserContext
  
  // Actions
  setEnvironment: (environment: string) => void
  updateConfig: (key: string, value: any) => void
  addFeatureFlag: (flag: FeatureFlag) => void
  updateFeatureFlag: (key: string, updates: Partial<FeatureFlag>) => void
  removeFeatureFlag: (key: string) => void
  evaluateFlag: (key: string, context?: UserContext) => any
  evaluateAllFlags: (context?: UserContext) => void
  setUserContext: (context: UserContext) => void
  validateConfig: () => ConfigValidationResult
  exportConfig: () => string
  importConfig: (config: string) => void
}

export interface ConfigValidationResult {
  valid: boolean
  errors: ConfigValidationError[]
  warnings: ConfigValidationWarning[]
}

export interface ConfigValidationError {
  key: string
  message: string
  value: any
}

export interface ConfigValidationWarning {
  key: string
  message: string
  value: any
}

// ===== CONSTANTS =====
export const DEFAULT_ENVIRONMENTS: Record<string, Environment> = {
  development: {
    name: 'development',
    displayName: 'Development',
    description: 'Local development environment',
    variables: {
      API_URL: 'http://localhost:3001',
      DEBUG: true,
      LOG_LEVEL: 'debug'
    },
    featureFlags: {},
    isProduction: false
  },
  staging: {
    name: 'staging',
    displayName: 'Staging',
    description: 'Staging environment for testing',
    variables: {
      API_URL: 'https://api-staging.example.com',
      DEBUG: true,
      LOG_LEVEL: 'info'
    },
    featureFlags: {},
    isProduction: false
  },
  production: {
    name: 'production',
    displayName: 'Production',
    description: 'Production environment',
    variables: {
      API_URL: 'https://api.example.com',
      DEBUG: false,
      LOG_LEVEL: 'error'
    },
    featureFlags: {},
    isProduction: true
  }
}

export const DEFAULT_CONFIG_SCHEMA: ConfigSchema = {
  API_URL: {
    type: 'string',
    default: 'http://localhost:3001',
    required: true,
    description: 'API base URL',
    environment: ['development', 'staging', 'production']
  },
  DEBUG: {
    type: 'boolean',
    default: false,
    description: 'Enable debug mode'
  },
  LOG_LEVEL: {
    type: 'string',
    default: 'info',
    validation: z.enum(['debug', 'info', 'warn', 'error']),
    description: 'Logging level'
  },
  MAX_UPLOAD_SIZE: {
    type: 'number',
    default: 10485760, // 10MB
    description: 'Maximum file upload size in bytes'
  },
  FEATURE_FLAGS_ENDPOINT: {
    type: 'string',
    default: '/api/feature-flags',
    description: 'Feature flags API endpoint'
  },
  ANALYTICS_ENABLED: {
    type: 'boolean',
    default: true,
    description: 'Enable analytics tracking'
  }
}

export const ROLLOUT_STRATEGIES = {
  PERCENTAGE: 'percentage',
  USER_ID: 'user_id',
  EMAIL: 'email',
  CUSTOM: 'custom'
} as const

// ===== UTILITY FUNCTIONS =====

// Hash function for consistent user bucketing
const hashString = (str: string): number => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

// Check if user is in rollout percentage
const isInRollout = (userId: string, percentage: number): boolean => {
  if (percentage >= 100) return true
  if (percentage <= 0) return false
  
  const hash = hashString(userId)
  const bucket = hash % 100
  return bucket < percentage
}

// Evaluate targeting condition
const evaluateCondition = (condition: TargetingCondition, context: UserContext): boolean => {
  const attributeValue = getAttributeValue(condition.attribute, context)
  const conditionValue = condition.value
  
  switch (condition.operator) {
    case 'equals':
      return attributeValue === conditionValue
    case 'not_equals':
      return attributeValue !== conditionValue
    case 'contains':
      return String(attributeValue).includes(String(conditionValue))
    case 'not_contains':
      return !String(attributeValue).includes(String(conditionValue))
    case 'starts_with':
      return String(attributeValue).startsWith(String(conditionValue))
    case 'ends_with':
      return String(attributeValue).endsWith(String(conditionValue))
    case 'greater_than':
      return Number(attributeValue) > Number(conditionValue)
    case 'less_than':
      return Number(attributeValue) < Number(conditionValue)
    case 'in':
      return Array.isArray(conditionValue) && conditionValue.includes(attributeValue)
    case 'not_in':
      return Array.isArray(conditionValue) && !conditionValue.includes(attributeValue)
    case 'regex':
      try {
        const regex = new RegExp(conditionValue)
        return regex.test(String(attributeValue))
      } catch {
        return false
      }
    default:
      return false
  }
}

// Get attribute value from context
const getAttributeValue = (attribute: string, context: UserContext): any => {
  const parts = attribute.split('.')
  let value: any = context
  
  for (const part of parts) {
    if (value && typeof value === 'object') {
      value = value[part]
    } else {
      return undefined
    }
  }
  
  return value
}

// Evaluate targeting rule
const evaluateTargetingRule = (rule: TargetingRule, context: UserContext): boolean => {
  if (!rule.enabled) return false
  
  const results = rule.conditions.map(condition => evaluateCondition(condition, context))
  
  switch (rule.operator) {
    case 'AND':
      return results.every(result => result)
    case 'OR':
      return results.some(result => result)
    default:
      return false
  }
}

// Select variant based on weights
const selectVariant = (variants: FeatureVariant[], userId: string): FeatureVariant | null => {
  const enabledVariants = variants.filter(v => v.enabled)
  if (enabledVariants.length === 0) return null
  
  const totalWeight = enabledVariants.reduce((sum, variant) => sum + variant.weight, 0)
  if (totalWeight === 0) return enabledVariants[0]
  
  const hash = hashString(userId)
  const bucket = hash % totalWeight
  
  let cumulativeWeight = 0
  for (const variant of enabledVariants) {
    cumulativeWeight += variant.weight
    if (bucket < cumulativeWeight) {
      return variant
    }
  }
  
  return enabledVariants[0]
}

// Validate configuration value
const validateConfigValue = (key: string, value: any, schema: ConfigSchema): ConfigValidationError | null => {
  const schemaEntry = schema[key]
  if (!schemaEntry) return null
  
  // Type validation
  const expectedType = schemaEntry.type
  const actualType = Array.isArray(value) ? 'array' : typeof value
  
  if (actualType !== expectedType) {
    return {
      key,
      message: `Expected ${expectedType}, got ${actualType}`,
      value
    }
  }
  
  // Custom validation
  if (schemaEntry.validation) {
    try {
      schemaEntry.validation.parse(value)
    } catch (error) {
      return {
        key,
        message: `Validation failed: ${error}`,
        value
      }
    }
  }
  
  return null
}

// ===== CONFIG STORE =====
export const useConfigStore = create<ConfigState>()(
  immer((set, get) => ({
    currentEnvironment: process.env.NODE_ENV || 'development',
    environments: DEFAULT_ENVIRONMENTS,
    featureFlags: {},
    evaluatedFlags: {},
    config: {},
    schema: DEFAULT_CONFIG_SCHEMA,
    userContext: {
      customAttributes: {}
    },
    
    setEnvironment: (environment) => {
      set(state => {
        state.currentEnvironment = environment
        
        // Update config with environment variables
        const env = state.environments[environment]
        if (env) {
          Object.assign(state.config, env.variables)
        }
      })
      
      // Re-evaluate all flags
      get().evaluateAllFlags()
    },
    
    updateConfig: (key, value) => {
      set(state => {
        state.config[key] = value
      })
    },
    
    addFeatureFlag: (flag) => {
      set(state => {
        state.featureFlags[flag.key] = flag
      })
      
      // Evaluate the new flag
      get().evaluateFlag(flag.key)
    },
    
    updateFeatureFlag: (key, updates) => {
      set(state => {
        const flag = state.featureFlags[key]
        if (flag) {
          Object.assign(flag, updates)
          flag.updatedAt = new Date()
        }
      })
      
      // Re-evaluate the flag
      get().evaluateFlag(key)
    },
    
    removeFeatureFlag: (key) => {
      set(state => {
        delete state.featureFlags[key]
        delete state.evaluatedFlags[key]
      })
    },
    
    evaluateFlag: (key, context) => {
      const { featureFlags, userContext } = get()
      const flag = featureFlags[key]
      
      if (!flag) {
        set(state => {
          state.evaluatedFlags[key] = false
        })
        return false
      }
      
      const evalContext = context || userContext
      
      // Check if flag is enabled
      if (!flag.enabled) {
        set(state => {
          state.evaluatedFlags[key] = false
        })
        return false
      }
      
      // Check rollout percentage
      const userId = evalContext.userId || 'anonymous'
      if (!isInRollout(userId, flag.rolloutPercentage)) {
        set(state => {
          state.evaluatedFlags[key] = false
        })
        return false
      }
      
      // Check targeting rules
      const matchingRule = flag.targeting.find(rule => evaluateTargetingRule(rule, evalContext))
      
      if (matchingRule) {
        // Check rule-specific rollout
        if (!isInRollout(userId, matchingRule.rolloutPercentage)) {
          set(state => {
            state.evaluatedFlags[key] = false
          })
          return false
        }
      }
      
      // Select variant if available
      let result: any = true
      
      if (flag.variants && flag.variants.length > 0) {
        const selectedVariant = selectVariant(flag.variants, userId)
        result = selectedVariant ? selectedVariant.value : false
      }
      
      set(state => {
        state.evaluatedFlags[key] = result
      })
      
      return result
    },
    
    evaluateAllFlags: (context) => {
      const { featureFlags } = get()
      
      Object.keys(featureFlags).forEach(key => {
        get().evaluateFlag(key, context)
      })
    },
    
    setUserContext: (context) => {
      set(state => {
        state.userContext = { ...state.userContext, ...context }
      })
      
      // Re-evaluate all flags with new context
      get().evaluateAllFlags()
    },
    
    validateConfig: (): ConfigValidationResult => {
      const { config, schema } = get()
      const errors: ConfigValidationError[] = []
      const warnings: ConfigValidationWarning[] = []
      
      // Check required fields
      Object.entries(schema).forEach(([key, schemaEntry]) => {
        if (schemaEntry.required && !(key in config)) {
          errors.push({
            key,
            message: 'Required field is missing',
            value: undefined
          })
        }
      })
      
      // Validate existing values
      Object.entries(config).forEach(([key, value]) => {
        const error = validateConfigValue(key, value, schema)
        if (error) {
          errors.push(error)
        }
      })
      
      // Check for unused schema entries
      Object.keys(schema).forEach(key => {
        if (!(key in config)) {
          warnings.push({
            key,
            message: 'Schema entry not used in config',
            value: schema[key].default
          })
        }
      })
      
      return {
        valid: errors.length === 0,
        errors,
        warnings
      }
    },
    
    exportConfig: (): string => {
      const { config, featureFlags, environments, currentEnvironment } = get()
      
      const exportData = {
        config,
        featureFlags,
        environments,
        currentEnvironment,
        exportedAt: new Date().toISOString()
      }
      
      return JSON.stringify(exportData, null, 2)
    },
    
    importConfig: (configString) => {
      try {
        const importData = JSON.parse(configString)
        
        set(state => {
          if (importData.config) {
            state.config = importData.config
          }
          if (importData.featureFlags) {
            state.featureFlags = importData.featureFlags
          }
          if (importData.environments) {
            state.environments = importData.environments
          }
          if (importData.currentEnvironment) {
            state.currentEnvironment = importData.currentEnvironment
          }
        })
        
        // Re-evaluate all flags
        get().evaluateAllFlags()
      } catch (error) {
        console.error('Failed to import config:', error)
        throw new Error('Invalid configuration format')
      }
    }
  }))
)

// ===== CONFIG MANAGER CLASS =====
export class ConfigManager {
  private store = useConfigStore.getState()
  private updateInterval: NodeJS.Timeout | null = null
  
  constructor() {
    this.initialize()
    this.setupAutoUpdate()
  }
  
  // Initialize configuration
  private initialize(): void {
    // Load environment-specific config
    const currentEnv = this.store.currentEnvironment
    const environment = this.store.environments[currentEnv]
    
    if (environment) {
      Object.entries(environment.variables).forEach(([key, value]) => {
        this.store.updateConfig(key, value)
      })
    }
    
    // Load default values from schema
    Object.entries(this.store.schema).forEach(([key, schemaEntry]) => {
      if (!(key in this.store.config)) {
        this.store.updateConfig(key, schemaEntry.default)
      }
    })
  }
  
  // Setup automatic updates from remote
  private setupAutoUpdate(): void {
    this.updateInterval = setInterval(() => {
      this.fetchRemoteConfig()
    }, 30000) // Every 30 seconds
  }
  
  // Fetch configuration from remote
  private async fetchRemoteConfig(): Promise<void> {
    try {
      const endpoint = this.store.config.FEATURE_FLAGS_ENDPOINT
      if (!endpoint) return
      
      const response = await fetch(endpoint)
      if (!response.ok) return
      
      const remoteConfig = await response.json()
      
      // Update feature flags
      if (remoteConfig.featureFlags) {
        Object.entries(remoteConfig.featureFlags).forEach(([key, flag]) => {
          this.store.addFeatureFlag(flag as FeatureFlag)
        })
      }
      
      // Update configuration
      if (remoteConfig.config) {
        Object.entries(remoteConfig.config).forEach(([key, value]) => {
          this.store.updateConfig(key, value)
        })
      }
    } catch (error) {
      console.warn('Failed to fetch remote config:', error)
    }
  }
  
  // Get configuration value with type safety
  get<T = any>(key: string): T | undefined
  get<T = any>(key: string, defaultValue: T): T
  get<T = any>(key: string, defaultValue?: T): T | undefined {
    const value = this.store.config[key]
    return value !== undefined ? value : defaultValue
  }
  
  // Check if feature flag is enabled
  isEnabled(flagKey: string): boolean {
    return Boolean(this.store.evaluatedFlags[flagKey])
  }
  
  // Get feature flag value
  getFlag<T = any>(flagKey: string): T | undefined
  getFlag<T = any>(flagKey: string, defaultValue: T): T
  getFlag<T = any>(flagKey: string, defaultValue?: T): T | undefined {
    const value = this.store.evaluatedFlags[flagKey]
    return value !== undefined ? value : defaultValue
  }
  
  // Create feature flag builder
  createFlag(key: string): FeatureFlagBuilder {
    return new FeatureFlagBuilder(key, this.store)
  }
  
  destroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
  }
}

// ===== FEATURE FLAG BUILDER =====
export class FeatureFlagBuilder {
  private flag: Partial<FeatureFlag>
  
  constructor(private key: string, private store: any) {
    this.flag = {
      key,
      name: key,
      description: '',
      enabled: false,
      rolloutPercentage: 0,
      targeting: [],
      variants: [],
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'system',
      tags: []
    }
  }
  
  name(name: string): this {
    this.flag.name = name
    return this
  }
  
  description(description: string): this {
    this.flag.description = description
    return this
  }
  
  enabled(enabled: boolean = true): this {
    this.flag.enabled = enabled
    return this
  }
  
  rollout(percentage: number): this {
    this.flag.rolloutPercentage = Math.max(0, Math.min(100, percentage))
    return this
  }
  
  addVariant(key: string, name: string, value: any, weight: number = 50): this {
    if (!this.flag.variants) this.flag.variants = []
    
    this.flag.variants.push({
      key,
      name,
      description: '',
      value,
      weight,
      enabled: true
    })
    
    return this
  }
  
  addTargeting(rule: Omit<TargetingRule, 'id'>): this {
    if (!this.flag.targeting) this.flag.targeting = []
    
    this.flag.targeting.push({
      ...rule,
      id: Math.random().toString(36).substr(2, 9)
    })
    
    return this
  }
  
  addTag(tag: string): this {
    if (!this.flag.tags) this.flag.tags = []
    this.flag.tags.push(tag)
    return this
  }
  
  metadata(metadata: Record<string, any>): this {
    this.flag.metadata = { ...this.flag.metadata, ...metadata }
    return this
  }
  
  save(): FeatureFlag {
    const completeFlag = this.flag as FeatureFlag
    this.store.addFeatureFlag(completeFlag)
    return completeFlag
  }
}

// ===== HOOKS =====

// Main configuration hook
export const useConfig = () => {
  const store = useConfigStore()
  
  return {
    ...store,
    get: <T = any>(key: string, defaultValue?: T): T => {
      const value = store.config[key]
      return value !== undefined ? value : (defaultValue as T)
    }
  }
}

// Feature flag hook
export const useFeatureFlag = (flagKey: string) => {
  const { evaluatedFlags, evaluateFlag } = useConfigStore()
  
  const isEnabled = Boolean(evaluatedFlags[flagKey])
  const value = evaluatedFlags[flagKey]
  
  const refresh = React.useCallback(() => {
    evaluateFlag(flagKey)
  }, [flagKey, evaluateFlag])
  
  return {
    isEnabled,
    value,
    refresh
  }
}

// Multiple feature flags hook
export const useFeatureFlags = (flagKeys: string[]) => {
  const { evaluatedFlags } = useConfigStore()
  
  const flags = React.useMemo(() => {
    return flagKeys.reduce((acc, key) => {
      acc[key] = {
        isEnabled: Boolean(evaluatedFlags[key]),
        value: evaluatedFlags[key]
      }
      return acc
    }, {} as Record<string, { isEnabled: boolean; value: any }>)
  }, [flagKeys, evaluatedFlags])
  
  return flags
}

// Configuration value hook
export const useConfigValue = <T = any>(key: string, defaultValue?: T): T => {
  const { config } = useConfigStore()
  
  return React.useMemo(() => {
    const value = config[key]
    return value !== undefined ? value : (defaultValue as T)
  }, [config, key, defaultValue])
}

// ===== DEFAULT INSTANCE =====
export const configManager = new ConfigManager()



// React import
import React from 'react'