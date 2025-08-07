"use client"

import { useState, useEffect } from "react"
import { Bell, Calendar, Clock, User, X, Check, AlertCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export interface Notification {
  id: string
  type: 'appointment' | 'reminder' | 'system' | 'urgent'
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionRequired?: boolean
  appointmentId?: string
  clientName?: string
  appointmentTime?: Date
}

interface NotificationSystemProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onDeleteNotification: (id: string) => void
  onNotificationAction?: (notification: Notification) => void
}

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'appointment':
      return <Calendar className="h-4 w-4" />
    case 'reminder':
      return <Clock className="h-4 w-4" />
    case 'urgent':
      return <AlertCircle className="h-4 w-4" />
    case 'system':
      return <Info className="h-4 w-4" />
    default:
      return <Bell className="h-4 w-4" />
  }
}

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'appointment':
      return 'text-blue-600'
    case 'reminder':
      return 'text-yellow-600'
    case 'urgent':
      return 'text-red-600'
    case 'system':
      return 'text-gray-600'
    default:
      return 'text-gray-600'
  }
}

const formatTimeAgo = (date: Date) => {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Agora'
  if (diffInMinutes < 60) return `${diffInMinutes}m atrás`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h atrás`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d atrás`
  
  return date.toLocaleDateString('pt-BR')
}

export function NotificationSystem({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onNotificationAction
}: NotificationSystemProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const unreadCount = notifications.filter(n => !n.read).length
  const urgentCount = notifications.filter(n => n.type === 'urgent' && !n.read).length

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant={urgentCount > 0 ? "destructive" : "default"} 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-96 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Notificações</CardTitle>
                <CardDescription>
                  {unreadCount > 0 ? `${unreadCount} não lidas` : 'Todas lidas'}
                </CardDescription>
              </div>
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onMarkAllAsRead}
                  className="text-xs"
                >
                  Marcar todas como lidas
                </Button>
              )}
            </div>
          </CardHeader>
          
          <Separator />
          
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Bell className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-sm text-gray-500">Nenhuma notificação</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "p-4 hover:bg-gray-50 transition-colors cursor-pointer border-l-4",
                        !notification.read && "bg-blue-50 border-l-blue-500",
                        notification.read && "border-l-transparent",
                        notification.type === 'urgent' && !notification.read && "bg-red-50 border-l-red-500"
                      )}
                      onClick={() => onMarkAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn("mt-1", getNotificationColor(notification.type))}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className={cn(
                                "text-sm font-medium",
                                !notification.read && "font-semibold"
                              )}>
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              
                              {notification.clientName && (
                                <div className="flex items-center gap-1 mt-2">
                                  <User className="h-3 w-3 text-gray-400" />
                                  <span className="text-xs text-gray-500">
                                    {notification.clientName}
                                  </span>
                                </div>
                              )}
                              
                              {notification.appointmentTime && (
                                <div className="flex items-center gap-1 mt-1">
                                  <Clock className="h-3 w-3 text-gray-400" />
                                  <span className="text-xs text-gray-500">
                                    {notification.appointmentTime.toLocaleDateString('pt-BR')} às{' '}
                                    {notification.appointmentTime.toLocaleTimeString('pt-BR', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-400">
                                {formatTimeAgo(notification.timestamp)}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onDeleteNotification(notification.id)
                                }}
                                className="h-6 w-6 p-0 hover:bg-red-100"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          {notification.actionRequired && onNotificationAction && (
                            <div className="flex gap-2 mt-3">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onNotificationAction(notification)
                                }}
                                className="h-7 text-xs"
                              >
                                <Check className="h-3 w-3 mr-1" />
                                Ação Necessária
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}

// Hook para gerenciar notificações
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Simular notificações iniciais
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'appointment',
        title: 'Novo agendamento',
        message: 'Maria Silva agendou uma consulta para amanhã às 14:00',
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutos atrás
        read: false,
        actionRequired: true,
        clientName: 'Maria Silva',
        appointmentTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // amanhã
      },
      {
        id: '2',
        type: 'reminder',
        title: 'Consulta em 1 hora',
        message: 'Lembrete: Consulta com João Santos às 15:00',
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutos atrás
        read: false,
        clientName: 'João Santos',
        appointmentTime: new Date(Date.now() + 60 * 60 * 1000) // em 1 hora
      },
      {
        id: '3',
        type: 'urgent',
        title: 'Cancelamento de última hora',
        message: 'Ana Costa cancelou a consulta de hoje às 16:00',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutos atrás
        read: false,
        actionRequired: true,
        clientName: 'Ana Costa'
      },
      {
        id: '4',
        type: 'system',
        title: 'Atualização do sistema',
        message: 'Nova versão da plataforma disponível com melhorias',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
        read: true
      }
    ]
    
    setNotifications(mockNotifications)
  }, [])

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date()
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  return {
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification
  }
}