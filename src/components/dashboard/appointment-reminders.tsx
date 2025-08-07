"use client"

import { useState, useEffect } from "react"
import { Clock, Calendar, User, MapPin, Phone, MessageSquare, AlertTriangle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

interface UpcomingAppointment {
  id: string
  clientName: string
  clientPhone?: string
  appointmentType: string
  date: Date
  duration: number // em minutos
  location: string
  status: 'confirmed' | 'pending' | 'reminded'
  notes?: string
  isUrgent?: boolean
  timeUntil: number // em minutos
}

interface AppointmentRemindersProps {
  appointments?: UpcomingAppointment[]
  onSendReminder?: (appointmentId: string) => void
  onConfirmAppointment?: (appointmentId: string) => void
  onViewDetails?: (appointmentId: string) => void
  className?: string
}

export function AppointmentReminders({
  appointments,
  onSendReminder,
  onConfirmAppointment,
  onViewDetails,
  className
}: AppointmentRemindersProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [upcomingAppointments, setUpcomingAppointments] = useState<UpcomingAppointment[]>([])

  // Atualizar o tempo atual a cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // 1 minuto

    return () => clearInterval(timer)
  }, [])

  // Simular dados se não fornecidos
  useEffect(() => {
    if (appointments) {
      setUpcomingAppointments(appointments)
    } else {
      // Dados simulados
      const now = new Date()
      const mockAppointments: UpcomingAppointment[] = [
        {
          id: '1',
          clientName: 'Maria Silva',
          clientPhone: '(11) 99999-9999',
          appointmentType: 'Consulta Inicial',
          date: new Date(now.getTime() + 30 * 60 * 1000), // 30 minutos
          duration: 60,
          location: 'Escritório Principal',
          status: 'confirmed',
          timeUntil: 30,
          isUrgent: true
        },
        {
          id: '2',
          clientName: 'João Santos',
          clientPhone: '(11) 88888-8888',
          appointmentType: 'Acompanhamento',
          date: new Date(now.getTime() + 90 * 60 * 1000), // 1h30
          duration: 45,
          location: 'Online',
          status: 'pending',
          timeUntil: 90,
          notes: 'Cliente solicitou reunião online'
        },
        {
          id: '3',
          clientName: 'Ana Costa',
          clientPhone: '(11) 77777-7777',
          appointmentType: 'Revisão de Contrato',
          date: new Date(now.getTime() + 4 * 60 * 60 * 1000), // 4 horas
          duration: 90,
          location: 'Escritório Principal',
          status: 'reminded',
          timeUntil: 240
        }
      ]
      setUpcomingAppointments(mockAppointments)
    }
  }, [appointments])

  const formatTimeUntil = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    if (remainingMinutes === 0) {
      return `${hours}h`
    }
    return `${hours}h ${remainingMinutes}min`
  }

  const getUrgencyLevel = (minutes: number) => {
    if (minutes <= 15) return 'critical'
    if (minutes <= 60) return 'urgent'
    if (minutes <= 120) return 'soon'
    return 'normal'
  }

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'border-red-500 bg-red-50'
      case 'urgent':
        return 'border-orange-500 bg-orange-50'
      case 'soon':
        return 'border-yellow-500 bg-yellow-50'
      default:
        return 'border-gray-200 bg-white'
    }
  }

  const getStatusBadge = (status: UpcomingAppointment['status']) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmado</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
      case 'reminded':
        return <Badge className="bg-blue-100 text-blue-800">Lembrete Enviado</Badge>
      default:
        return null
    }
  }

  // Filtrar apenas consultas das próximas 24 horas
  const todayAppointments = upcomingAppointments
    .filter(apt => apt.timeUntil <= 24 * 60) // 24 horas em minutos
    .sort((a, b) => a.timeUntil - b.timeUntil)

  const criticalAppointments = todayAppointments.filter(apt => apt.timeUntil <= 60)

  return (
    <div className={cn("space-y-4", className)}>
      {/* Alerta para consultas críticas */}
      {criticalAppointments.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Atenção!</strong> Você tem {criticalAppointments.length} consulta(s) 
            nas próximas {criticalAppointments[0].timeUntil <= 15 ? '15 minutos' : 'hora'}.
          </AlertDescription>
        </Alert>
      )}

      {/* Lista de consultas próximas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Consultas Próximas
              </CardTitle>
              <CardDescription>
                Próximas 24 horas • {todayAppointments.length} agendamento(s)
              </CardDescription>
            </div>
            <Badge variant="outline">
              {currentTime.toLocaleTimeString('pt-BR', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {todayAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle className="h-12 w-12 text-green-300 mb-4" />
              <p className="text-sm text-gray-500">
                Nenhuma consulta nas próximas 24 horas
              </p>
            </div>
          ) : (
            <ScrollArea className="h-96">
              <div className="space-y-1">
                {todayAppointments.map((appointment, index) => {
                  const urgencyLevel = getUrgencyLevel(appointment.timeUntil)
                  
                  return (
                    <div key={appointment.id}>
                      <div 
                        className={cn(
                          "p-4 transition-all duration-200 hover:bg-gray-50 cursor-pointer border-l-4",
                          getUrgencyColor(urgencyLevel)
                        )}
                        onClick={() => onViewDetails?.(appointment.id)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium text-gray-900">
                                {appointment.clientName}
                              </h4>
                              {getStatusBadge(appointment.status)}
                              {appointment.isUrgent && (
                                <Badge variant="destructive" className="text-xs">
                                  Urgente
                                </Badge>
                              )}
                            </div>

                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                <span>{appointment.appointmentType}</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                <span>
                                  {appointment.date.toLocaleTimeString('pt-BR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })} ({appointment.duration} min)
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <MapPin className="h-3 w-3" />
                                <span>{appointment.location}</span>
                              </div>

                              {appointment.clientPhone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-3 w-3" />
                                  <span>{appointment.clientPhone}</span>
                                </div>
                              )}

                              {appointment.notes && (
                                <div className="flex items-start gap-2">
                                  <MessageSquare className="h-3 w-3 mt-0.5" />
                                  <span className="text-xs">{appointment.notes}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            <div className="text-right">
                              <div className={cn(
                                "text-lg font-bold",
                                urgencyLevel === 'critical' && "text-red-600",
                                urgencyLevel === 'urgent' && "text-orange-600",
                                urgencyLevel === 'soon' && "text-yellow-600",
                                urgencyLevel === 'normal' && "text-gray-600"
                              )}>
                                {formatTimeUntil(appointment.timeUntil)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {appointment.timeUntil <= 60 ? 'restante' : 'até a consulta'}
                              </div>
                            </div>

                            <div className="flex gap-1">
                              {appointment.status === 'pending' && onConfirmAppointment && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onConfirmAppointment(appointment.id)
                                  }}
                                  className="h-7 text-xs"
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Confirmar
                                </Button>
                              )}
                              
                              {onSendReminder && appointment.status !== 'reminded' && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onSendReminder(appointment.id)
                                  }}
                                  className="h-7 text-xs"
                                >
                                  <MessageSquare className="h-3 w-3 mr-1" />
                                  Lembrar
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {index < todayAppointments.length - 1 && <Separator />}
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Hook para gerenciar lembretes
export function useAppointmentReminders() {
  const [reminders, setReminders] = useState<UpcomingAppointment[]>([])

  useEffect(() => {
    // Simular carregamento de dados
    const loadReminders = () => {
      // Aqui você faria a chamada real para a API
      const now = new Date()
      const mockReminders: UpcomingAppointment[] = [
        {
          id: '1',
          clientName: 'Maria Silva',
          clientPhone: '(11) 99999-9999',
          appointmentType: 'Consulta Inicial',
          date: new Date(now.getTime() + 30 * 60 * 1000),
          duration: 60,
          location: 'Escritório Principal',
          status: 'confirmed',
          timeUntil: 30,
          isUrgent: true
        }
      ]
      setReminders(mockReminders)
    }

    loadReminders()
    
    // Atualizar a cada minuto
    const interval = setInterval(loadReminders, 60000)
    
    return () => clearInterval(interval)
  }, [])

  const sendReminder = (appointmentId: string) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === appointmentId 
          ? { ...reminder, status: 'reminded' as const }
          : reminder
      )
    )
  }

  const confirmAppointment = (appointmentId: string) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === appointmentId 
          ? { ...reminder, status: 'confirmed' as const }
          : reminder
      )
    )
  }

  return {
    reminders,
    sendReminder,
    confirmAppointment
  }
}