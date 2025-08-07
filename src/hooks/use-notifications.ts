"use client"

import { useState, useEffect, useCallback } from "react"
import { Notification } from "@/components/dashboard/notification-system"

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Simular notificações iniciais
  useEffect(() => {
    const now = new Date()
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'urgent',
        title: 'Consulta em 15 minutos',
        message: 'Maria Silva - Consulta Inicial às 14:30',
        timestamp: new Date(now.getTime() - 5 * 60 * 1000), // 5 min atrás
        read: false,
        actionRequired: true,
        appointmentId: 'apt-1',
        clientName: 'Maria Silva',
        appointmentTime: new Date(now.getTime() + 15 * 60 * 1000)
      },
      {
        id: '2',
        type: 'appointment',
        title: 'Novo agendamento',
        message: 'João Santos agendou uma consulta para amanhã',
        timestamp: new Date(now.getTime() - 30 * 60 * 1000), // 30 min atrás
        read: false,
        appointmentId: 'apt-2',
        clientName: 'João Santos',
        appointmentTime: new Date(now.getTime() + 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        type: 'reminder',
        title: 'Lembrete de follow-up',
        message: 'Acompanhar caso de Ana Costa - prazo em 2 dias',
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2h atrás
        read: false,
        clientName: 'Ana Costa'
      },
      {
        id: '4',
        type: 'system',
        title: 'Perfil atualizado',
        message: 'Suas informações de contato foram atualizadas com sucesso',
        timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4h atrás
        read: true
      },
      {
        id: '5',
        type: 'appointment',
        title: 'Consulta confirmada',
        message: 'Pedro Oliveira confirmou a consulta de sexta-feira',
        timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000), // 6h atrás
        read: true,
        appointmentId: 'apt-5',
        clientName: 'Pedro Oliveira'
      }
    ]
    
    setNotifications(mockNotifications)
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }, [])

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    )
  }, [])

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date()
    }
    
    setNotifications(prev => [newNotification, ...prev])
  }, [])

  const handleNotificationAction = useCallback((notification: Notification) => {
    // Aqui você pode implementar ações específicas baseadas no tipo de notificação
    if (notification.type === 'appointment' && notification.appointmentId) {
      // Navegar para detalhes do agendamento
      console.log('Navegando para agendamento:', notification.appointmentId)
    } else if (notification.type === 'urgent') {
      // Ação urgente - talvez abrir modal de confirmação
      console.log('Ação urgente para:', notification.id)
    }
    
    // Marcar como lida
    markAsRead(notification.id)
  }, [markAsRead])

  return {
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    handleNotificationAction
  }
}