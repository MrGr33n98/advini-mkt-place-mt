"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { 
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Filter,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreHorizontal
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Separator } from "@/components/ui/separator"

interface Appointment {
  id: string
  clientName: string
  clientEmail: string
  clientPhone: string
  type: string
  date: Date
  time: string
  location: string
  status: "confirmed" | "pending" | "cancelled" | "completed"
  notes?: string
  duration: number
}

interface AppointmentListProps {
  appointments?: Appointment[]
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    clientName: "Maria Silva",
    clientEmail: "maria@email.com",
    clientPhone: "(11) 99999-9999",
    type: "Consulta Inicial",
    date: new Date(2024, 0, 15),
    time: "09:00",
    location: "Escritório",
    status: "confirmed",
    notes: "Cliente interessado em divórcio consensual",
    duration: 60
  },
  {
    id: "2",
    clientName: "João Santos",
    clientEmail: "joao@email.com",
    clientPhone: "(11) 88888-8888",
    type: "Acompanhamento",
    date: new Date(2024, 0, 15),
    time: "14:00",
    location: "Online",
    status: "pending",
    notes: "Revisão de documentos contratuais",
    duration: 45
  },
  {
    id: "3",
    clientName: "Ana Costa",
    clientEmail: "ana@email.com",
    clientPhone: "(11) 77777-7777",
    type: "Audiência",
    date: new Date(2024, 0, 16),
    time: "10:30",
    location: "Fórum",
    status: "confirmed",
    notes: "Audiência de conciliação",
    duration: 120
  },
  {
    id: "4",
    clientName: "Pedro Oliveira",
    clientEmail: "pedro@email.com",
    clientPhone: "(11) 66666-6666",
    type: "Consulta Inicial",
    date: new Date(2024, 0, 14),
    time: "16:00",
    location: "Escritório",
    status: "completed",
    notes: "Consulta sobre direito trabalhista",
    duration: 60
  }
]

const statusConfig = {
  confirmed: { label: "Confirmado", color: "bg-green-100 text-green-800", icon: CheckCircle },
  pending: { label: "Pendente", color: "bg-yellow-100 text-yellow-800", icon: AlertCircle },
  cancelled: { label: "Cancelado", color: "bg-red-100 text-red-800", icon: XCircle },
  completed: { label: "Concluído", color: "bg-blue-100 text-blue-800", icon: CheckCircle }
}

export function AppointmentList({ appointments = mockAppointments }: AppointmentListProps) {
  const [filteredAppointments, setFilteredAppointments] = useState(appointments)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<Date | undefined>()
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  // Aplicar filtros
  const applyFilters = () => {
    let filtered = appointments

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(appointment =>
        appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtro por status
    if (statusFilter !== "all") {
      filtered = filtered.filter(appointment => appointment.status === statusFilter)
    }

    // Filtro por tipo
    if (typeFilter !== "all") {
      filtered = filtered.filter(appointment => appointment.type === typeFilter)
    }

    // Filtro por data
    if (dateFilter) {
      filtered = filtered.filter(appointment =>
        format(appointment.date, "yyyy-MM-dd") === format(dateFilter, "yyyy-MM-dd")
      )
    }

    setFilteredAppointments(filtered)
  }

  // Aplicar filtros quando os valores mudarem
  useState(() => {
    applyFilters()
  }, [searchTerm, statusFilter, typeFilter, dateFilter])

  const handleStatusChange = (appointmentId: string, newStatus: Appointment["status"]) => {
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === appointmentId
        ? { ...appointment, status: newStatus }
        : appointment
    )
    setFilteredAppointments(updatedAppointments)
  }

  const appointmentTypes = [...new Set(appointments.map(a => a.type))]

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Busca */}
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nome, email ou tipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="confirmed">Confirmado</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tipo */}
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {appointmentTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Data */}
            <div className="space-y-2">
              <Label>Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {dateFilter ? format(dateFilter, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={dateFilter}
                    onSelect={setDateFilter}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-muted-foreground">
              {filteredAppointments.length} agendamento(s) encontrado(s)
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("all")
                setTypeFilter("all")
                setDateFilter(undefined)
                setFilteredAppointments(appointments)
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Agendamentos */}
      <div className="space-y-4">
        {filteredAppointments.map((appointment) => {
          const StatusIcon = statusConfig[appointment.status].icon
          
          return (
            <Card key={appointment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-4">
                      <h3 className="font-semibold text-lg">{appointment.clientName}</h3>
                      <Badge className={statusConfig[appointment.status].color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[appointment.status].label}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {format(appointment.date, "dd/MM/yyyy", { locale: ptBR })}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {appointment.time} ({appointment.duration}min)
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {appointment.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{appointment.type}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {appointment.clientEmail}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {appointment.clientPhone}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedAppointment(appointment)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Detalhes
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Detalhes do Agendamento</DialogTitle>
                          <DialogDescription>
                            Informações completas sobre o agendamento
                          </DialogDescription>
                        </DialogHeader>
                        {selectedAppointment && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">Cliente</Label>
                                <p className="text-sm">{selectedAppointment.clientName}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Status</Label>
                                <Badge className={statusConfig[selectedAppointment.status].color}>
                                  {statusConfig[selectedAppointment.status].label}
                                </Badge>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Email</Label>
                                <p className="text-sm">{selectedAppointment.clientEmail}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Telefone</Label>
                                <p className="text-sm">{selectedAppointment.clientPhone}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Data</Label>
                                <p className="text-sm">
                                  {format(selectedAppointment.date, "dd/MM/yyyy", { locale: ptBR })}
                                </p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Horário</Label>
                                <p className="text-sm">{selectedAppointment.time} ({selectedAppointment.duration}min)</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Tipo</Label>
                                <p className="text-sm">{selectedAppointment.type}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Local</Label>
                                <p className="text-sm">{selectedAppointment.location}</p>
                              </div>
                            </div>
                            
                            {selectedAppointment.notes && (
                              <div>
                                <Label className="text-sm font-medium">Observações</Label>
                                <p className="text-sm mt-1 p-3 bg-muted rounded-md">
                                  {selectedAppointment.notes}
                                </p>
                              </div>
                            )}

                            <Separator />

                            <div className="flex gap-2">
                              {selectedAppointment.status === "pending" && (
                                <>
                                  <Button
                                    onClick={() => handleStatusChange(selectedAppointment.id, "confirmed")}
                                    className="flex-1"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Confirmar
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleStatusChange(selectedAppointment.id, "cancelled")}
                                    className="flex-1"
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Cancelar
                                  </Button>
                                </>
                              )}
                              {selectedAppointment.status === "confirmed" && (
                                <Button
                                  onClick={() => handleStatusChange(selectedAppointment.id, "completed")}
                                  className="flex-1"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Marcar como Concluído
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {appointment.status === "pending" && (
                          <>
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(appointment.id, "confirmed")}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Confirmar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(appointment.id, "cancelled")}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Cancelar
                            </DropdownMenuItem>
                          </>
                        )}
                        {appointment.status === "confirmed" && (
                          <DropdownMenuItem
                            onClick={() => handleStatusChange(appointment.id, "completed")}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Marcar como Concluído
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {filteredAppointments.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum agendamento encontrado</h3>
              <p className="text-muted-foreground">
                Tente ajustar os filtros ou criar um novo agendamento.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}