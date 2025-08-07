/**
 * Modern Notification System
 * Arquitetura baseada em benchmarks da indústria:
 * - Compound Components Pattern
 * - Headless UI Architecture
 * - Accessibility First
 * - Performance Optimized
 */

"use client"

import React, { createContext, useContext, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { 
  Bell, 
  X, 
  Check, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Calendar,
  Clock,
  User,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { 
  useNotifications, 
  useUnreadNotifications,
  type Notification,
  type NotificationType 
} from '@/lib/notification-store'
import { spacing, animations, colors } from '@/lib/design-system'

// ===== CONTEXT =====
interface NotificationContextValue {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

const useNotificationContext = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('Notification components must be used within NotificationProvider')
  }
  return context
}

// ===== CONFIGURATION =====
const NOTIFICATION_CONFIG = {
  maxVisible: 5,
  autoCloseDelay: 5000,
  animationDuration: parseInt(animations.durations.normal),
  toastPosition: 'top-right' as const,
} as const

// ===== ICON MAPPING =====
const getNotificationIcon = (type: NotificationType) => {
  const iconMap = {
    success: CheckCircle,
    error: AlertTriangle,
    warning: AlertTriangle,
    info: Info,
    appointment: Calendar,
    system: Bell,
  } as const

  return iconMap[type] || Bell
}

// ===== STYLING =====
const getNotificationStyles = (type: NotificationType) => {
  const styleMap = {
    success: {
      icon: 'text-green-600',
      bg: 'bg-green-50 border-green-200',
      accent: 'border-l-green-500',
    },
    error: {
      icon: 'text-red-600',
      bg: 'bg-red-50 border-red-200',
      accent: 'border-l-red-500',
    },
    warning: {
      icon: 'text-yellow-600',
      bg: 'bg-yellow-50 border-yellow-200',
      accent: 'border-l-yellow-500',
    },
    info: {
      icon: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-200',
      accent: 'border-l-blue-500',
    },
    appointment: {
      icon: 'text-purple-600',
      bg: 'bg-purple-50 border-purple-200',
      accent: 'border-l-purple-500',
    },
    system: {
      icon: 'text-gray-600',
      bg: 'bg-gray-50 border-gray-200',
      accent: 'border-l-gray-500',
    },
  } as const

  return styleMap[type] || styleMap.info
}

// ===== ANIMATIONS =====
const notificationAnimations = {
  toast: {
    initial: { opacity: 0, x: 300, scale: 0.9 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: 300, scale: 0.9 },
    transition: { duration: 0.2 }
  },
  popover: {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.15 }
  }
}

// ===== UTILITY FUNCTIONS =====
const formatTimeAgo = (date: Date): string => {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Agora'
  if (diffInMinutes < 60) return `${diffInMinutes}m`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d`
  
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit' 
  })
}

// ===== COMPONENTS =====

// Notification Item Component
interface NotificationItemProps {
  notification: Notification
  variant?: 'compact' | 'detailed'
  showActions?: boolean
  className?: string
}

const NotificationItem = React.memo<NotificationItemProps>(({ 
  notification, 
  variant = 'detailed',
  showActions = true,
  className 
}) => {
  const { actions } = useNotifications()
  const Icon = getNotificationIcon(notification.type)
  const styles = getNotificationStyles(notification.type)
  
  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation()
    actions.markAsRead(notification.id)
  }
  
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    actions.remove(notification.id)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className={cn(
        'group relative border-l-4 transition-all duration-200',
        styles.bg,
        styles.accent,
        !notification.read && 'shadow-sm',
        'hover:shadow-md',
        className
      )}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={cn('flex-shrink-0 mt-0.5', styles.icon)}>
            <Icon className="h-4 w-4" />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h4 className={cn(
                  'text-sm font-medium text-gray-900',
                  !notification.read && 'font-semibold'
                )}>
                  {notification.title}
                </h4>
                
                {variant === 'detailed' && (
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                    {notification.message}
                  </p>
                )}
                
                {/* Metadata for appointment notifications */}
                {notification.type === 'appointment' && notification.metadata && (
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    {notification.metadata.clientName && (
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{notification.metadata.clientName}</span>
                      </div>
                    )}
                    {notification.metadata.appointmentTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {new Date(notification.metadata.appointmentTime).toLocaleString('pt-BR')}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Timestamp */}
              <div className="flex-shrink-0 text-xs text-gray-400">
                {formatTimeAgo(notification.timestamp)}
              </div>
            </div>
            
            {/* Actions */}
            {showActions && notification.actions && notification.actions.length > 0 && (
              <div className="flex gap-2 mt-3">
                {notification.actions.map((action) => (
                  <Button
                    key={action.id}
                    size="sm"
                    variant={action.variant === 'primary' ? 'default' : action.variant || 'secondary'}
                    onClick={action.handler}
                    className="h-7 px-3 text-xs"
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
          
          {/* Quick Actions */}
          {showActions && (
            <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {!notification.read && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleMarkAsRead}
                  className="h-6 w-6 p-0 hover:bg-gray-200"
                  title="Marcar como lida"
                >
                  <Check className="h-3 w-3" />
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={handleRemove}
                className="h-6 w-6 p-0 hover:bg-gray-200"
                title="Remover"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
})

NotificationItem.displayName = 'NotificationItem'

// Notification Bell Trigger
interface NotificationTriggerProps {
  className?: string
}

const NotificationTrigger = React.memo<NotificationTriggerProps>(({ className }) => {
  const { isOpen, setIsOpen } = useNotificationContext()
  const { unreadCount } = useNotifications()
  const urgentNotifications = useUnreadNotifications().filter(n => n.priority === 'urgent')
  
  return (
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        size="icon"
        className={cn(
          'relative transition-all duration-200',
          'hover:bg-accent hover:text-accent-foreground',
          isOpen && 'bg-accent text-accent-foreground',
          className
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge
            variant={urgentNotifications.length > 0 ? "destructive" : "default"}
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs font-medium"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Button>
    </PopoverTrigger>
  )
})

NotificationTrigger.displayName = 'NotificationTrigger'

// Notification List
interface NotificationListProps {
  className?: string
}

const NotificationList = React.memo<NotificationListProps>(({ className }) => {
  const { notifications, unreadCount, actions } = useNotifications()
  
  if (notifications.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Nenhuma notificação</p>
      </div>
    )
  }
  
  return (
    <div className={className}>
      {/* Header */}
      <div className="p-4 border-b bg-gray-50/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Notificações</h3>
            <p className="text-xs text-gray-500">
              {unreadCount > 0 
                ? `${unreadCount} não lida${unreadCount > 1 ? 's' : ''}`
                : 'Todas lidas'
              }
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={actions.markAllAsRead}
              className="text-xs"
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>
      </div>
      
      {/* List */}
      <ScrollArea className="h-80">
        <AnimatePresence mode="popLayout">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              className="border-b last:border-b-0"
            />
          ))}
        </AnimatePresence>
      </ScrollArea>
    </div>
  )
})

NotificationList.displayName = 'NotificationList'

// Toast Notifications
const NotificationToasts = React.memo(() => {
  const { notifications, actions } = useNotifications()
  const toastNotifications = notifications
    .filter(n => !n.read && n.autoClose)
    .slice(0, NOTIFICATION_CONFIG.maxVisible)
  
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toastNotifications.map((notification) => (
          <motion.div
            key={notification.id}
            {...notificationAnimations.toast}
            className="pointer-events-auto"
          >
            <Card className="w-80 shadow-lg border-0">
              <CardContent className="p-0">
                <NotificationItem
                  notification={notification}
                  variant="compact"
                  showActions={false}
                  className="border-l-4 rounded-r-lg"
                />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
})

NotificationToasts.displayName = 'NotificationToasts'

// Main Notification System
interface NotificationSystemProps {
  className?: string
}

const NotificationSystem = React.memo<NotificationSystemProps>(({ className }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  
  return (
    <NotificationContext.Provider value={{ isOpen, setIsOpen }}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <NotificationTrigger className={className} />
        <PopoverContent 
          className="w-96 p-0 shadow-xl border-0" 
          align="end"
          sideOffset={8}
        >
          <motion.div
            {...notificationAnimations.popover}
          >
            <Card className="border-0">
              <NotificationList />
            </Card>
          </motion.div>
        </PopoverContent>
      </Popover>
    </NotificationContext.Provider>
  )
})

NotificationSystem.displayName = 'NotificationSystem'

// ===== EXPORTS =====
export {
  NotificationSystem,
  NotificationToasts,
  NotificationItem,
  NotificationTrigger,
  NotificationList,
}

// Convenience hook for common notification actions
export const useNotificationHelpers = () => {
  const { helpers } = useNotifications()
  
  return {
    notifySuccess: helpers.success,
    notifyError: helpers.error,
    notifyWarning: helpers.warning,
    notifyInfo: helpers.info,
    notifyAppointment: helpers.appointment,
  }
}