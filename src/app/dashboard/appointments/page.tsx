'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar as CalendarIcon, Clock, User, MapPin, FileText, Check, X, Plus, Filter } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Dados mockados para os agendamentos
const mockAppointments = [
  {
    id: "1",
    clientName: "Maria Oliveira",
    clientEmail: "maria@email.com",
    clientPhone: "(65) 99999-8888",
    date: "2024-05-10T14:30:00",
    type: "Consulta Inicial",
    status: "confirmed",
    location: "Escritório",
    notes: "Cliente quer discutir um caso de divórcio."
  },
  {
    id: "2",
    clientName: "Carlos Santos",
    clientEmail: "carlos@email.com",
    clientPhone: "(65) 99999-7777",
    date: "2024-05-12T10:00:00",
    type: "Acompanhamento",
    status: "pending",
    location: "Online (Zoom)",
    notes: "Acompanhamento do processo trabalhista."
  }
]

export default function AppointmentsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [appointments, setAppointments] = useState(mockAppointments)
  const [filter, setFilter] = useState('all')

  // Formatador de data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR })
  }

  // Formatador de hora
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "HH:mm", { locale: ptBR })
  }

  // Filtrar agendamentos por data
  const getAppointmentsForDate = (date: Date | undefined) => {
    if (!date) return []
    
    const dateString = format(date, 'yyyy-MM-dd')
    
    return appointments.filter(appointment => {
      const appointmentDate = format(new Date(appointment.date), 'yyyy-MM-dd')
      return appointmentDate === dateString
    })
  }

  // Filtrar agendamentos por status
  const getFilteredAppointments = () => {
    if (filter === 'all') return appointments
    return appointments.filter(appointment => appointment.status === filter)
  }

  // Manipular confirmação de agendamento
  const handleConfirmAppointment = (id: string) => {
    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === id 
          ? { ...appointment, status: 'confirmed' } 
          : appointment
      )
    )
    toast.success('Agendamento confirmado com sucesso!')
  }

  // Manipular cancelamento de agendamento
  const handleCancelAppointment = (id: string) => {
    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === id 
          ? { ...appointment, status: 'cancelled' } 
          : appointment
      )
    )
    toast.success('Agendamento cancelado com sucesso!')
  }

  // Obter a cor do badge com base no status
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'default'
      case 'pending':
        return 'secondary'
      case 'cancelled':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  // Obter o texto do status
  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado'
      case 'pending':
        return 'Pendente'
      case 'cancelled':
        return 'Cancelado'
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Agendamentos
            </h1>
            <p className="text-muted-foreground mt-2">Gerencie seus agendamentos de forma eficiente</p>
          </div>
          <div className="flex gap-3">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="mr-2 h-4 w-4" />
              Novo Agendamento
            </Button>
          </div>
        </div>

        <Tabs defaultValue="calendar" className="space-y-4">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="calendar">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Calendário
            </TabsTrigger>
            <TabsTrigger value="list">
              <FileText className="mr-2 h-4 w-4" />
              Lista
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Calendário</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>
                    Agendamentos para {date ? format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Hoje"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {getAppointmentsForDate(date).length > 0 ? (
                    <div className="space-y-4">
                      {getAppointmentsForDate(date).map(appointment => (
                        <Card key={appointment.id} className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row">
                              <div className={`w-full md:w-2 h-2 md:h-auto ${
                                appointment.status === 'confirmed' ? 'bg-primary' :
                                appointment.status === 'pending' ? 'bg-yellow-500' :
                                'bg-destructive'
                              }`} />
                              <div className="p-4 flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h3 className="font-medium">{appointment.clientName}</h3>
                                    <p className="text-sm text-muted-foreground">{appointment.type}</p>
                                  </div>
                                  <Badge variant={getStatusBadgeVariant(appointment.status) as any}>
                                    {getStatusText(appointment.status)}
                                  </Badge>
                                </div>
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm">
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                                    {formatTime(appointment.date)}
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                                    {appointment.location}
                                  </div>
                                </div>
                                {appointment.notes && (
                                  <p className="text-sm text-muted-foreground mt-2 line-clamp-1">
                                    {appointment.notes}
                                  </p>
                                )}
                                <div className="flex justify-end mt-4 gap-2">
                                  <Button variant="outline" size="sm">
                                    Detalhes
                                  </Button>
                                  {appointment.status === 'pending' && (
                                    <Button 
                                      size="sm"
                                      onClick={() => handleConfirmAppointment(appointment.id)}
                                    >
                                      <Check className="mr-1 h-4 w-4" />
                                      Confirmar
                                    </Button>
                                  )}
                                  {appointment.status !== 'cancelled' && (
                                    <Button 
                                      variant="destructive" 
                                      size="sm"
                                      onClick={() => handleCancelAppointment(appointment.id)}
                                    >
                                      <X className="mr-1 h-4 w-4" />
                                      Cancelar
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Nenhum agendamento</h3>
                      <p className="text-muted-foreground">
                        Não há agendamentos para esta data.
                      </p>
                      <Button className="mt-4">
                        <Plus className="mr-2 h-4 w-4" />
                        Criar Agendamento
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Todos os Agendamentos</CardTitle>
                  <div className="flex items-center gap-2">
                    <Select value={filter} onValueChange={setFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrar por status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="confirmed">Confirmados</SelectItem>
                        <SelectItem value="pending">Pendentes</SelectItem>
                        <SelectItem value="cancelled">Cancelados</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getFilteredAppointments().length > 0 ? (
                    getFilteredAppointments().map(appointment => (
                      <Card key={appointment.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            <div className={`w-full md:w-2 h-2 md:h-auto ${
                              appointment.status === 'confirmed' ? 'bg-primary' :
                              appointment.status === 'pending' ? 'bg-yellow-500' :
                              'bg-destructive'
                            }`} />
                            <div className="p-4 flex-grow">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h3 className="font-medium">{appointment.clientName}</h3>
                                  <p className="text-sm text-muted-foreground">{appointment.type}</p>
                                </div>
                                <Badge variant={getStatusBadgeVariant(appointment.status) as any}>
                                  {getStatusText(appointment.status)}
                                </Badge>
                              </div>
                              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm">
                                <div className="flex items-center">
                                  <CalendarIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                                  {formatDate(appointment.date)}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                                  {formatTime(appointment.date)}
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                                  {appointment.location}
                                </div>
                              </div>
                              {appointment.notes && (
                                <p className="text-sm text-muted-foreground mt-2 line-clamp-1">
                                  {appointment.notes}
                                </p>
                              )}
                              <div className="flex justify-end mt-4 gap-2">
                                <Button variant="outline" size="sm">
                                  Detalhes
                                </Button>
                                {appointment.status === 'pending' && (
                                  <Button 
                                    size="sm"
                                    onClick={() => handleConfirmAppointment(appointment.id)}
                                  >
                                    <Check className="mr-1 h-4 w-4" />
                                    Confirmar
                                  </Button>
                                )}
                                {appointment.status !== 'cancelled' && (
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => handleCancelAppointment(appointment.id)}
                                  >
                                    <X className="mr-1 h-4 w-4" />
                                    Cancelar
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Nenhum agendamento encontrado</h3>
                      <p className="text-muted-foreground">
                        Não há agendamentos com os filtros selecionados.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}