"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, AlertTriangle, CheckCircle, XCircle, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AppointmentStats {
  newAppointments: number
  todayAppointments: number
  pendingConfirmation: number
  upcomingReminders: number
  cancelledToday: number
  totalThisWeek: number
}

interface AppointmentBadgesProps {
  stats?: AppointmentStats
  onBadgeClick?: (type: string) => void
  className?: string
}

export function AppointmentBadges({ 
  stats, 
  onBadgeClick,
  className 
}: AppointmentBadgesProps) {
  const [currentStats, setCurrentStats] = useState<AppointmentStats>({
    newAppointments: 0,
    todayAppointments: 0,
    pendingConfirmation: 0,
    upcomingReminders: 0,
    cancelledToday: 0,
    totalThisWeek: 0
  })

  // Simular dados se não fornecidos
  useEffect(() => {
    if (stats) {
      setCurrentStats(stats)
    } else {
      // Dados simulados
      setCurrentStats({
        newAppointments: 3,
        todayAppointments: 5,
        pendingConfirmation: 2,
        upcomingReminders: 4,
        cancelledToday: 1,
        totalThisWeek: 18
      })
    }
  }, [stats])

  const badges = [
    {
      id: 'new',
      label: 'Novos Agendamentos',
      value: currentStats.newAppointments,
      icon: Calendar,
      color: 'bg-blue-500',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50',
      urgent: currentStats.newAppointments > 5
    },
    {
      id: 'today',
      label: 'Hoje',
      value: currentStats.todayAppointments,
      icon: Clock,
      color: 'bg-green-500',
      textColor: 'text-green-700',
      bgColor: 'bg-green-50',
      urgent: false
    },
    {
      id: 'pending',
      label: 'Pendente Confirmação',
      value: currentStats.pendingConfirmation,
      icon: AlertTriangle,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-700',
      bgColor: 'bg-yellow-50',
      urgent: currentStats.pendingConfirmation > 3
    },
    {
      id: 'reminders',
      label: 'Lembretes Próximos',
      value: currentStats.upcomingReminders,
      icon: CheckCircle,
      color: 'bg-purple-500',
      textColor: 'text-purple-700',
      bgColor: 'bg-purple-50',
      urgent: false
    },
    {
      id: 'cancelled',
      label: 'Cancelados Hoje',
      value: currentStats.cancelledToday,
      icon: XCircle,
      color: 'bg-red-500',
      textColor: 'text-red-700',
      bgColor: 'bg-red-50',
      urgent: currentStats.cancelledToday > 2
    },
    {
      id: 'week',
      label: 'Total da Semana',
      value: currentStats.totalThisWeek,
      icon: Users,
      color: 'bg-gray-500',
      textColor: 'text-gray-700',
      bgColor: 'bg-gray-50',
      urgent: false
    }
  ]

  return (
    <div className={cn("space-y-4", className)}>
      {/* Badges principais */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {badges.map((badge) => {
          const Icon = badge.icon
          return (
            <Card 
              key={badge.id}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:shadow-md",
                badge.urgent && "ring-2 ring-red-200 animate-pulse"
              )}
              onClick={() => onBadgeClick?.(badge.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className={cn("p-2 rounded-full", badge.bgColor)}>
                    <Icon className={cn("h-4 w-4", badge.textColor)} />
                  </div>
                  {badge.urgent && (
                    <Badge variant="destructive" className="text-xs">
                      Urgente
                    </Badge>
                  )}
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold">{badge.value}</p>
                  <p className="text-xs text-gray-600 mt-1">{badge.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Resumo rápido */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Resumo do Dia</CardTitle>
          <CardDescription>
            Status atual dos seus agendamentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {currentStats.newAppointments > 0 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {currentStats.newAppointments} novos agendamentos
              </Badge>
            )}
            {currentStats.pendingConfirmation > 0 && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                {currentStats.pendingConfirmation} aguardando confirmação
              </Badge>
            )}
            {currentStats.upcomingReminders > 0 && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                {currentStats.upcomingReminders} lembretes próximos
              </Badge>
            )}
            {currentStats.cancelledToday > 0 && (
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                {currentStats.cancelledToday} cancelamentos hoje
              </Badge>
            )}
            {currentStats.newAppointments === 0 && 
             currentStats.pendingConfirmation === 0 && 
             currentStats.upcomingReminders === 0 && 
             currentStats.cancelledToday === 0 && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Tudo em dia! 🎉
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Componente de badge individual para uso em outros lugares
interface SingleBadgeProps {
  count: number
  label: string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary'
  urgent?: boolean
  onClick?: () => void
  className?: string
}

export function AppointmentBadge({ 
  count, 
  label, 
  variant = 'default',
  urgent = false,
  onClick,
  className 
}: SingleBadgeProps) {
  if (count === 0) return null

  return (
    <Badge 
      variant={urgent ? 'destructive' : variant}
      className={cn(
        "cursor-pointer transition-all duration-200 hover:scale-105",
        urgent && "animate-pulse",
        className
      )}
      onClick={onClick}
    >
      {count} {label}
    </Badge>
  )
}

// Hook para gerenciar estatísticas de agendamentos
export function useAppointmentStats() {
  const [stats, setStats] = useState<AppointmentStats>({
    newAppointments: 0,
    todayAppointments: 0,
    pendingConfirmation: 0,
    upcomingReminders: 0,
    cancelledToday: 0,
    totalThisWeek: 0
  })

  // Simular atualização de estatísticas
  useEffect(() => {
    const updateStats = () => {
      // Aqui você faria a chamada real para a API
      setStats({
        newAppointments: Math.floor(Math.random() * 6),
        todayAppointments: Math.floor(Math.random() * 8) + 2,
        pendingConfirmation: Math.floor(Math.random() * 4),
        upcomingReminders: Math.floor(Math.random() * 6),
        cancelledToday: Math.floor(Math.random() * 3),
        totalThisWeek: Math.floor(Math.random() * 25) + 10
      })
    }

    updateStats()
    
    // Atualizar a cada 5 minutos
    const interval = setInterval(updateStats, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  const incrementNew = () => {
    setStats(prev => ({ ...prev, newAppointments: prev.newAppointments + 1 }))
  }

  const decrementPending = () => {
    setStats(prev => ({ 
      ...prev, 
      pendingConfirmation: Math.max(0, prev.pendingConfirmation - 1) 
    }))
  }

  const incrementCancelled = () => {
    setStats(prev => ({ ...prev, cancelledToday: prev.cancelledToday + 1 }))
  }

  return {
    stats,
    incrementNew,
    decrementPending,
    incrementCancelled
  }
}