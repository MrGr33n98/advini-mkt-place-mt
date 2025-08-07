'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Star,
  Calendar,
  MessageSquare,
  TrendingUp,
  Users,
  Clock,
  X
} from 'lucide-react'
import { useState } from 'react'

interface Notification {
  id: string
  type: 'success' | 'warning' | 'info' | 'urgent'
  title: string
  message: string
  time: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
  icon: React.ComponentType<{ className?: string }>
  read: boolean
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'urgent',
    title: 'Nova avaliação 5 estrelas!',
    message: 'Maria Santos deixou uma avaliação excelente sobre seus serviços.',
    time: '5 min atrás',
    icon: Star,
    read: false,
    action: {
      label: 'Ver avaliação',
      href: '/dashboard/reviews'
    }
  },
  {
    id: '2',
    type: 'warning',
    title: 'Agendamento em 30 minutos',
    message: 'Consulta com Carlos Oliveira às 14:30.',
    time: '25 min atrás',
    icon: Calendar,
    read: false,
    action: {
      label: 'Ver detalhes',
      href: '/dashboard/appointments'
    }
  },
  {
    id: '3',
    type: 'info',
    title: 'Aumento nas visualizações',
    message: 'Seu perfil teve 15% mais visualizações esta semana.',
    time: '2 horas atrás',
    icon: TrendingUp,
    read: false
  },
  {
    id: '4',
    type: 'success',
    title: 'Meta de clientes atingida!',
    message: 'Parabéns! Você atingiu sua meta mensal de novos clientes.',
    time: '1 dia atrás',
    icon: CheckCircle,
    read: true
  },
  {
    id: '5',
    type: 'info',
    title: 'Nova mensagem',
    message: 'Você tem 3 novas mensagens de clientes potenciais.',
    time: '2 dias atrás',
    icon: MessageSquare,
    read: true,
    action: {
      label: 'Ver mensagens',
      href: '/dashboard/messages'
    }
  }
]

const notificationStyles = {
  success: {
    bg: 'bg-green-50 dark:bg-green-950',
    border: 'border-green-200 dark:border-green-800',
    icon: 'text-green-600 dark:text-green-400'
  },
  warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-950',
    border: 'border-yellow-200 dark:border-yellow-800',
    icon: 'text-yellow-600 dark:text-yellow-400'
  },
  info: {
    bg: 'bg-blue-50 dark:bg-blue-950',
    border: 'border-blue-200 dark:border-blue-800',
    icon: 'text-blue-600 dark:text-blue-400'
  },
  urgent: {
    bg: 'bg-red-50 dark:bg-red-950',
    border: 'border-red-200 dark:border-red-800',
    icon: 'text-red-600 dark:text-red-400'
  }
}

export function NotificationsCenter() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5" />
          <CardTitle className="text-lg">Central de Notificações</CardTitle>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount}
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={markAllAsRead}
            className="text-xs"
          >
            Marcar todas como lidas
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <AnimatePresence>
            {notifications.map((notification, index) => {
              const styles = notificationStyles[notification.type]
              const IconComponent = notification.icon
              
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 border-l-4 ${styles.border} ${!notification.read ? styles.bg : ''} hover:bg-muted/50 transition-colors`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`p-2 rounded-full ${styles.bg}`}>
                        <IconComponent className={`h-4 w-4 ${styles.icon}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className={`text-sm font-medium ${!notification.read ? 'font-semibold' : ''}`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {notification.time}
                          </span>
                          {notification.action && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs h-6 px-2"
                            >
                              {notification.action.label}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        dismissNotification(notification.id)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
          
          {notifications.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma notificação no momento</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}