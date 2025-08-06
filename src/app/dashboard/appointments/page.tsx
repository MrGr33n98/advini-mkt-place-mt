'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { NavigationMenu } from '@/app/navigation-menu'
import { MadeWithDyad } from '@/components/made-with-dyad'
import { Calendar as CalendarIcon, Clock, User, MapPin, FileText, Check, X, Plus, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

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

// Tipos de agendamento
const appointmentTypes = [
  "Consulta Inicial",
  "Acompanhamento",
  "Assinatura de Documentos",
  "Audiência",
  "Reunião"
];

// Locais de agendamento
const appointmentLocations = [
  "Escritório",
  "Online (Zoom)",
  "Online (Google Meet)",
  "Fórum",
  "Outro"
];

export default function AppointmentsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [appointments, setAppointments] = useState(mockAppointments)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false)
  const [filter, setFilter] = useState('all')

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

  // Filtrar agendamentos por status
  const getFilteredAppointments = () => {
    if (filter === 'all') return appointments;
    return appointments.filter(appointment => appointment.status === filter);
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
    <div className="min-h-screen bg-background">
      <NavigationMenu />
      
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Agendamentos</h1>
          <div className="flex gap-2">
            <Dialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Agendamento
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Novo Agendamento</DialogTitle>
                  <DialogDescription>
                    Preencha os detalhes para criar um novo agendamento.
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
                          {appointmentTypes.map(type => (
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
                        {appointmentLocations.map(location => (
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
                                  <Badge variant={getStatusBadgeVariant(appointment.status)}>
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
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => {
                                      setSelectedAppointment(appointment);
                                      setIsDetailsOpen(true);
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
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Nenhum agendamento</h3>
                      <p className="text-muted-foreground">
                        Não há agendamentos para esta data.
                      </p>
                      <Button className="mt-4" onClick={() => setIsNewAppointmentOpen(true)}>
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
                                    setIsDetailsOpen(true);
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
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
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
                          setIsDetailsOpen(false);
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
                          setIsDetailsOpen(false);
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

      <MadeWithDyad />
    </div>
  )
}

// Componentes adicionais para o Mail e Phone
function Mail(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function Phone(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}