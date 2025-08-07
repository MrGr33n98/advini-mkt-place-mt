'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar as CalendarIcon, Clock, User, MapPin, FileText, Check, X, Plus, Filter, ChevronLeft, ChevronRight, Mail, Phone } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"
import { AgendaCalendar } from "@/components/dashboard/agenda-calendar"
import { AppointmentFilters, type AppointmentFilters as AppointmentFiltersType } from "@/components/dashboard/appointment-filters"

// Componentes Dialog customizados
const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal

const DialogOverlay = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>) => (
  <DialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
)

const DialogContent = ({ className, children, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
)

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
)

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
)

const DialogTitle = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) => (
  <DialogPrimitive.Title
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
)

const DialogDescription = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>) => (
  <DialogPrimitive.Description
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
)

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
  },
  {
    id: "3",
    clientName: "Ana Paula",
    clientEmail: "ana@email.com",
    clientPhone: "(65) 99999-6666",
    date: "2024-05-15T16:00:00",
    type: "Consulta Inicial",
    status: "confirmed",
    location: "Escritório",
    notes: "Cliente quer discutir um contrato de aluguel."
  },
  {
    id: "4",
    clientName: "Roberto Almeida",
    clientEmail: "roberto@email.com",
    clientPhone: "(65) 99999-5555",
    date: "2024-05-18T11:00:00",
    type: "Assinatura de Documentos",
    status: "confirmed",
    location: "Escritório",
    notes: "Assinatura de procuração e contrato."
  },
  {
    id: "5",
    clientName: "Fernanda Lima",
    clientEmail: "fernanda@email.com",
    clientPhone: "(65) 99999-4444",
    date: "2024-05-20T15:00:00",
    type: "Acompanhamento",
    status: "cancelled",
    location: "Online (Zoom)",
    notes: "Cliente cancelou por motivos pessoais."
  }
];



export default function AppointmentsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [appointments, setAppointments] = useState(mockAppointments)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false)
  const [showNewAppointmentDialog, setShowNewAppointmentDialog] = useState(false)
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [filter, setFilter] = useState('all')
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('month')
  const [filters, setFilters] = useState<AppointmentFiltersType>({
    search: "",
    status: "all",
    type: "all",
    location: "all"
  })

  // Extrair tipos e locais únicos dos agendamentos
  const appointmentTypesFromData = [...new Set(appointments.map(apt => apt.type))]
  const appointmentLocationsFromData = [...new Set(appointments.map(apt => apt.location))]

  // Formatador de data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  // Formatador de hora
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "HH:mm", { locale: ptBR });
  };

  // Filtrar agendamentos por data
  const getAppointmentsForDate = (date: Date | undefined) => {
    if (!date) return [];
    
    const dateString = format(date, 'yyyy-MM-dd');
    
    return appointments.filter(appointment => {
      const appointmentDate = format(new Date(appointment.date), 'yyyy-MM-dd');
      return appointmentDate === dateString;
    });
  };

  // Filtrar agendamentos
  const getFilteredAppointments = () => {
    return appointments.filter(appointment => {
      // Filtro básico por status (mantido para compatibilidade)
      if (filter !== 'all' && appointment.status !== filter) return false
      
      // Filtros avançados
      if (filters.search && !appointment.clientName.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }
      
      if (filters.status !== 'all' && appointment.status !== filters.status) {
        return false
      }
      
      if (filters.type !== 'all' && appointment.type !== filters.type) {
        return false
      }
      
      if (filters.location !== 'all' && appointment.location !== filters.location) {
        return false
      }
      
      // Filtro por data
      if (filters.startDate || filters.endDate) {
        const appointmentDate = new Date(appointment.date)
        if (filters.startDate && appointmentDate < filters.startDate) return false
        if (filters.endDate && appointmentDate > filters.endDate) return false
      }
      
      return true
    })
  };

  // Manipular confirmação de agendamento
  const handleConfirmAppointment = (id: string) => {
    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === id 
          ? { ...appointment, status: 'confirmed' } 
          : appointment
      )
    );
    toast.success('Agendamento confirmado com sucesso!');
  };

  // Manipular cancelamento de agendamento
  const handleCancelAppointment = (id: string) => {
    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === id 
          ? { ...appointment, status: 'cancelled' } 
          : appointment
      )
    );
    toast.success('Agendamento cancelado com sucesso!');
  };

  // Manipular criação de novo agendamento
  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementaria a lógica para criar um novo agendamento
    toast.success('Agendamento criado com sucesso!');
    setIsNewAppointmentOpen(false);
  };

  // Obter a cor do badge com base no status
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  // Obter o texto do status
  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

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
            <Button 
              onClick={() => setShowNewAppointmentDialog(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Agendamento
            </Button>
            <Dialog open={showNewAppointmentDialog} onOpenChange={setShowNewAppointmentDialog}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Novo Agendamento</DialogTitle>
                  <DialogDescription>
                    Crie um novo agendamento para um cliente.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateAppointment} className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Nome do Cliente</label>
                      <Input required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email do Cliente</label>
                      <Input type="email" required />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Telefone do Cliente</label>
                      <Input type="tel" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tipo de Agendamento</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {appointmentTypesFromData.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Data</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP", { locale: ptBR }) : "Selecione uma data"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Horário</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um horário" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 10 }, (_, i) => i + 8).map(hour => (
                            <SelectItem key={hour} value={`${hour}:00`}>{`${hour}:00`}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Local</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um local" />
                      </SelectTrigger>
                      <SelectContent>
                        {appointmentLocationsFromData.map(location => (
                          <SelectItem key={location} value={location}>{location}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Observações</label>
                    <Textarea placeholder="Adicione informações relevantes sobre o agendamento" />
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit">Criar Agendamento</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
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
            <AgendaCalendar
              appointments={getFilteredAppointments()}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              onAppointmentClick={(appointment) => {
                setSelectedAppointment(appointment)
                setShowAppointmentDetails(true)
              }}
              onNewAppointment={(date, time) => {
                setSelectedDate(date)
                setShowNewAppointmentDialog(true)
              }}
              view={calendarView}
              onViewChange={setCalendarView}
            />
          </TabsContent>
          
          <TabsContent value="list" className="space-y-4">
              <AppointmentFilters
                filters={filters}
                onFiltersChange={setFilters}
                appointmentTypes={appointmentTypesFromData}
                appointmentLocations={appointmentLocationsFromData}
              />
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
                                <Badge variant={getStatusBadgeVariant(appointment.status)}>
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
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedAppointment(appointment);
                                    setShowAppointmentDetails(true);
                                  }}
                                >
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

        {/* Dialog de Detalhes do Agendamento */}
        <Dialog open={showAppointmentDetails} onOpenChange={setShowAppointmentDetails}>
          <DialogContent className="sm:max-w-[500px]">
            {selectedAppointment && (
              <>
                <DialogHeader>
                  <DialogTitle>Detalhes do Agendamento</DialogTitle>
                  <DialogDescription>
                    Informações completas sobre o agendamento.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">{selectedAppointment.clientName}</h3>
                    <Badge variant={getStatusBadgeVariant(selectedAppointment.status)}>
                      {getStatusText(selectedAppointment.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Data</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(selectedAppointment.date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Horário</p>
                      <p className="text-sm text-muted-foreground">
                        {formatTime(selectedAppointment.date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Tipo</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedAppointment.type}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Local</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedAppointment.location}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Informações de Contato</p>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {selectedAppointment.clientName}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {selectedAppointment.clientEmail}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {selectedAppointment.clientPhone}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {selectedAppointment.notes && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Observações</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedAppointment.notes}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-end gap-2 mt-6">
                    {selectedAppointment.status === 'pending' && (
                      <Button 
                        onClick={() => {
                          handleConfirmAppointment(selectedAppointment.id);
                          setShowAppointmentDetails(false);
                        }}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Confirmar
                      </Button>
                    )}
                    {selectedAppointment.status !== 'cancelled' && (
                      <Button 
                        variant="destructive"
                        onClick={() => {
                          handleCancelAppointment(selectedAppointment.id);
                          setShowAppointmentDetails(false);
                        }}
                      >
                        <X className="mr-1 h-4 w-4" />
                        Cancelar
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}