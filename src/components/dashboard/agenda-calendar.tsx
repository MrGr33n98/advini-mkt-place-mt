'use client'

import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft, ChevronRight, Clock, User, MapPin, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Appointment {
  id: string
  clientName: string
  date: string
  time: string
  type: string
  status: 'confirmed' | 'pending' | 'cancelled'
  location: string
  duration: number
}

interface AgendaCalendarProps {
  appointments: Appointment[]
  onDateSelect: (date: Date) => void
  onAppointmentClick: (appointment: Appointment) => void
  onNewAppointment: (date: Date, time?: string) => void
  selectedDate?: Date
  view: 'month' | 'week' | 'day'
  onViewChange: (view: 'month' | 'week' | 'day') => void
}

export function AgendaCalendar({
  appointments,
  onDateSelect,
  onAppointmentClick,
  onNewAppointment,
  selectedDate = new Date(),
  view,
  onViewChange
}: AgendaCalendarProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate)

  // Gerar horários do dia (8h às 18h)
  const timeSlots = Array.from({ length: 21 }, (_, i) => {
    const hour = Math.floor(8 + i / 2)
    const minute = i % 2 === 0 ? '00' : '30'
    return `${hour.toString().padStart(2, '0')}:${minute}`
  })

  // Obter agendamentos para uma data específica
  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(appointment => 
      isSameDay(new Date(appointment.date), date)
    )
  }

  // Obter agendamentos para um horário específico
  const getAppointmentForTimeSlot = (date: Date, time: string) => {
    const dayAppointments = getAppointmentsForDate(date)
    return dayAppointments.find(appointment => appointment.time === time)
  }

  // Renderizar visualização mensal
  const renderMonthView = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Agenda - {format(currentDate, 'MMMM yyyy', { locale: ptBR })}</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Hoje
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onDateSelect(date)}
          month={currentDate}
          onMonthChange={setCurrentDate}
          locale={ptBR}
          className="rounded-md border"
          components={{
            DayContent: ({ date }) => {
              const dayAppointments = getAppointmentsForDate(date)
              return (
                <div className="relative w-full h-full">
                  <span>{date.getDate()}</span>
                  {dayAppointments.length > 0 && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                      <div className="flex gap-0.5">
                        {dayAppointments.slice(0, 3).map((_, i) => (
                          <div
                            key={i}
                            className="w-1 h-1 rounded-full bg-blue-500"
                          />
                        ))}
                        {dayAppointments.length > 3 && (
                          <div className="w-1 h-1 rounded-full bg-gray-400" />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            }
          }}
        />
      </CardContent>
    </Card>
  )

  // Renderizar visualização semanal
  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate, { locale: ptBR })
    const weekEnd = endOfWeek(currentDate, { locale: ptBR })
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Semana de {format(weekStart, 'd MMM', { locale: ptBR })} - {format(weekEnd, 'd MMM yyyy', { locale: ptBR })}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(prev => subWeeks(prev, 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                Hoje
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(prev => addWeeks(prev, 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-8 gap-2">
            {/* Header com horários */}
            <div className="text-sm font-medium text-gray-500 p-2">Horário</div>
            {weekDays.map(day => (
              <div key={day.toISOString()} className="text-sm font-medium text-center p-2">
                <div>{format(day, 'EEE', { locale: ptBR })}</div>
                <div className="text-lg">{format(day, 'd')}</div>
              </div>
            ))}

            {/* Grid de horários */}
            {timeSlots.map(time => (
              <div key={time} className="contents">
                <div className="text-xs text-gray-500 p-2 border-r">
                  {time}
                </div>
                {weekDays.map(day => {
                  const appointment = getAppointmentForTimeSlot(day, time)
                  return (
                    <div
                      key={`${day.toISOString()}-${time}`}
                      className="min-h-[60px] border border-gray-200 p-1 hover:bg-gray-50 cursor-pointer"
                      onClick={() => appointment ? onAppointmentClick(appointment) : onNewAppointment(day, time)}
                    >
                      {appointment ? (
                        <div className={cn(
                          "w-full h-full rounded p-2 text-xs",
                          appointment.status === 'confirmed' && "bg-green-100 text-green-800",
                          appointment.status === 'pending' && "bg-yellow-100 text-yellow-800",
                          appointment.status === 'cancelled' && "bg-red-100 text-red-800"
                        )}>
                          <div className="font-medium truncate">{appointment.clientName}</div>
                          <div className="truncate">{appointment.type}</div>
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Plus className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Renderizar visualização diária
  const renderDayView = () => {
    const dayAppointments = getAppointmentsForDate(currentDate)

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {format(currentDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(prev => new Date(prev.getTime() - 24 * 60 * 60 * 1000))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                Hoje
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(prev => new Date(prev.getTime() + 24 * 60 * 60 * 1000))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {timeSlots.map(time => {
              const appointment = getAppointmentForTimeSlot(currentDate, time)
              return (
                <div
                  key={time}
                  className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => appointment ? onAppointmentClick(appointment) : onNewAppointment(currentDate, time)}
                >
                  <div className="w-16 text-sm text-gray-500 font-medium">
                    {time}
                  </div>
                  {appointment ? (
                    <div className="flex-1 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-medium">{appointment.clientName}</div>
                          <div className="text-sm text-gray-500">{appointment.type}</div>
                        </div>
                        <Badge
                          variant={
                            appointment.status === 'confirmed' ? 'default' :
                            appointment.status === 'pending' ? 'secondary' : 'destructive'
                          }
                        >
                          {appointment.status === 'confirmed' ? 'Confirmado' :
                           appointment.status === 'pending' ? 'Pendente' : 'Cancelado'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        {appointment.location}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400 opacity-0 hover:opacity-100 transition-opacity">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar agendamento
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controles de visualização */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={view === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewChange('month')}
          >
            Mês
          </Button>
          <Button
            variant={view === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewChange('week')}
          >
            Semana
          </Button>
          <Button
            variant={view === 'day' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onViewChange('day')}
          >
            Dia
          </Button>
        </div>
        <Button onClick={() => onNewAppointment(selectedDate)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      {/* Renderizar visualização selecionada */}
      {view === 'month' && renderMonthView()}
      {view === 'week' && renderWeekView()}
      {view === 'day' && renderDayView()}
    </div>
  )
}