/**
 * Notification Store - Gerenciamento Centralizado de Estado
 * Baseado em padrões Zustand/Redux com TypeScript
 */

import React from 'react'
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

// ===== TYPES =====
export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'appointment' | 'system'

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface BaseNotification {
  id: string
  type: NotificationType
  priority: NotificationPriority
  title: string
  message: string
  timestamp: Date
  read: boolean
  persistent?: boolean
  autoClose?: boolean
  duration?: number
  actions?: NotificationAction[]
  metadata?: Record<string, any>
}

export interface NotificationAction {
  id: string
  label: string
  variant?: 'primary' | 'secondary' | 'destructive'
  handler: () => void | Promise<void>
}

export interface AppointmentNotification extends BaseNotification {
  type: 'appointment'
  metadata: {
    appointmentId: string
    clientName: string
    appointmentTime: Date
    location?: string
  }
}

export interface SystemNotification extends BaseNotification {
  type: 'system'
  metadata: {
    version?: string
    feature?: string
    updateType?: 'feature' | 'bugfix' | 'security'
  }
}

export type Notification = BaseNotification | AppointmentNotification | SystemNotification

// ===== STORE STATE =====
interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  settings: {
    enableSound: boolean
    enableDesktop: boolean
    autoCloseDelay: number
    maxVisible: number
  }
}

// ===== STORE ACTIONS =====
interface NotificationActions {
  // Core actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => string
  removeNotification: (id: string) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearAll: () => void
  
  // Bulk actions
  removeByType: (type: NotificationType) => void
  markReadByType: (type: NotificationType) => void
  
  // Settings
  updateSettings: (settings: Partial<NotificationState['settings']>) => void
  
  // Convenience methods
  notifySuccess: (title: string, message: string, options?: Partial<Notification>) => string
  notifyError: (title: string, message: string, options?: Partial<Notification>) => string
  notifyWarning: (title: string, message: string, options?: Partial<Notification>) => string
  notifyInfo: (title: string, message: string, options?: Partial<Notification>) => string
  notifyAppointment: (
    title: string,
    message: string,
    appointmentData: AppointmentNotification['metadata'],
    options?: Partial<Notification>
  ) => string
}

type NotificationStore = NotificationState & NotificationActions

// ===== UTILITY FUNCTIONS =====
const generateId = (): string => {
  return `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

const createBaseNotification = (
  data: Omit<Notification, 'id' | 'timestamp'>
): Notification => ({
  id: generateId(),
  timestamp: new Date(),
  read: false,
  autoClose: true,
  duration: 5000,
  priority: 'medium',
  ...data,
})

// ===== STORE IMPLEMENTATION =====
export const useNotificationStore = create<NotificationStore>()(
  subscribeWithSelector(
    immer((set, get) => ({
      // Initial state
      notifications: [],
      unreadCount: 0,
      settings: {
        enableSound: true,
        enableDesktop: true,
        autoCloseDelay: 5000,
        maxVisible: 5,
      },

      // Core actions
      addNotification: (data) => {
        const notification = createBaseNotification(data)
        
        set((state) => {
          state.notifications.unshift(notification)
          
          // Limit notifications
          if (state.notifications.length > 100) {
            state.notifications = state.notifications.slice(0, 100)
          }
          
          // Update unread count
          state.unreadCount = state.notifications.filter(n => !n.read).length
        })
        
        // Auto-remove if configured
        if (notification.autoClose && notification.duration) {
          setTimeout(() => {
            get().removeNotification(notification.id)
          }, notification.duration)
        }
        
        return notification.id
      },

      removeNotification: (id) => {
        set((state) => {
          const index = state.notifications.findIndex(n => n.id === id)
          if (index !== -1) {
            state.notifications.splice(index, 1)
            state.unreadCount = state.notifications.filter(n => !n.read).length
          }
        })
      },

      markAsRead: (id) => {
        set((state) => {
          const notification = state.notifications.find(n => n.id === id)
          if (notification && !notification.read) {
            notification.read = true
            state.unreadCount = state.notifications.filter(n => !n.read).length
          }
        })
      },

      markAllAsRead: () => {
        set((state) => {
          state.notifications.forEach(n => n.read = true)
          state.unreadCount = 0
        })
      },

      clearAll: () => {
        set((state) => {
          state.notifications = []
          state.unreadCount = 0
        })
      },

      // Bulk actions
      removeByType: (type) => {
        set((state) => {
          state.notifications = state.notifications.filter(n => n.type !== type)
          state.unreadCount = state.notifications.filter(n => !n.read).length
        })
      },

      markReadByType: (type) => {
        set((state) => {
          state.notifications
            .filter(n => n.type === type)
            .forEach(n => n.read = true)
          state.unreadCount = state.notifications.filter(n => !n.read).length
        })
      },

      // Settings
      updateSettings: (newSettings) => {
        set((state) => {
          Object.assign(state.settings, newSettings)
        })
      },

      // Convenience methods
      notifySuccess: (title, message, options = {}) => {
        return get().addNotification({
          type: 'success',
          priority: 'medium',
          title,
          message,
          ...options,
        })
      },

      notifyError: (title, message, options = {}) => {
        return get().addNotification({
          type: 'error',
          priority: 'high',
          title,
          message,
          persistent: true,
          autoClose: false,
          ...options,
        })
      },

      notifyWarning: (title, message, options = {}) => {
        return get().addNotification({
          type: 'warning',
          priority: 'medium',
          title,
          message,
          ...options,
        })
      },

      notifyInfo: (title, message, options = {}) => {
        return get().addNotification({
          type: 'info',
          priority: 'low',
          title,
          message,
          ...options,
        })
      },

      notifyAppointment: (title, message, appointmentData, options = {}) => {
        return get().addNotification({
          type: 'appointment',
          priority: 'high',
          title,
          message,
          persistent: true,
          metadata: appointmentData,
          ...options,
        } as AppointmentNotification)
      },
    }))
  )
)

// ===== SELECTORS =====
export const notificationSelectors = {
  // Get notifications by type
  byType: (type: NotificationType) => (state: NotificationStore) =>
    state.notifications.filter(n => n.type === type),
  
  // Get unread notifications
  unread: (state: NotificationStore) =>
    state.notifications.filter(n => !n.read),
  
  // Get urgent notifications
  urgent: (state: NotificationStore) =>
    state.notifications.filter(n => n.priority === 'urgent'),
  
  // Get recent notifications (last 24h)
  recent: (state: NotificationStore) => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return state.notifications.filter(n => n.timestamp > yesterday)
  },
  
  // Get notifications for display (limited by settings)
  forDisplay: (state: NotificationStore) =>
    state.notifications.slice(0, state.settings.maxVisible),
}

// ===== HOOKS =====
export const useNotifications = () => {
  const store = useNotificationStore()
  return {
    notifications: store.notifications,
    unreadCount: store.unreadCount,
    settings: store.settings,
    actions: {
      add: store.addNotification,
      remove: store.removeNotification,
      markAsRead: store.markAsRead,
      markAllAsRead: store.markAllAsRead,
      clearAll: store.clearAll,
      updateSettings: store.updateSettings,
    },
    helpers: {
      success: store.notifySuccess,
      error: store.notifyError,
      warning: store.notifyWarning,
      info: store.notifyInfo,
      appointment: store.notifyAppointment,
    }
  }
}

export const useUnreadNotifications = () => {
  return useNotificationStore(notificationSelectors.unread)
}

export const useUrgentNotifications = () => {
  return useNotificationStore(notificationSelectors.urgent)
}

export const useNotificationsByType = (type: NotificationType) => {
  return useNotificationStore(notificationSelectors.byType(type))
}

// ===== PROVIDER COMPONENT =====
interface NotificationProviderProps {
  children: React.ReactNode
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  // Initialize with sample notifications for demo
  React.useEffect(() => {
    const store = useNotificationStore.getState()
    
    // Add sample notifications
    store.notifyAppointment(
      'Consulta em 30 minutos',
      'Consulta com Maria Silva às 14:30',
      {
        clientName: 'Maria Silva',
        appointmentTime: new Date(Date.now() + 30 * 60 * 1000),
        appointmentId: 'apt-001'
      }
    )
    
    store.notifyInfo(
      'Dica do dia',
      'Use atalhos de teclado para navegar mais rapidamente'
    )
  }, [])
  
  return children
}