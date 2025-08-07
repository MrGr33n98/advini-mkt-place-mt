"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, User, MapPin, Search, Filter, Download, Eye, Star, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface HistoricalAppointment {
  id: string
  clientName: string
  clientPhone?: string
  clientEmail?: string
  appointmentType: string
  date: Date
  duration: number
  location: string
  status: 'completed' | 'cancelled' | 'no-show' | 'rescheduled'
  notes?: string
  rating?: number
  feedback?: string
  paymentStatus?: 'paid' | 'pending' | 'overdue'
  amount?: number
  followUpRequired?: boolean
  documents?: string[]
}

interface AppointmentHistoryProps {
  appointments?: HistoricalAppointment[]
  onViewDetails?: (appointmentId: string) => void
  onExportData?: () => void
  className?: string
}

interface HistoryFilters {
  search: string
  status: string
  period: string
  appointmentType: string
  paymentStatus: string
}

export function AppointmentHistory({
  appointments,
  onViewDetails,
  onExportData,
  className
}: AppointmentHistoryProps) {
  const [historicalAppointments, setHistoricalAppointments] = useState<HistoricalAppointment[]>([])
  const [filters, setFilters] = useState<HistoryFilters>({
    search: '',
    status: 'all',
    period: 'all',
    appointmentType: 'all',
    paymentStatus: 'all'
  })
  const [selectedAppointment, setSelectedAppointment] = useState<HistoricalAppointment | null>(null)

  // Simular dados se não fornecidos
  useEffect(() => {
    if (appointments) {
      setHistoricalAppointments(appointments)
    } else {
      // Dados simulados
      const now = new Date()
      const mockAppointments: HistoricalAppointment[] = [
        {
          id: '1',
          clientName: 'Maria Silva',
          clientPhone: '(11) 99999-9999',
          clientEmail: 'maria@email.com',
          appointmentType: 'Consulta Inicial',
          date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
          duration: 60,
          location: 'Escritório Principal',
          status: 'completed',
          notes: 'Cliente interessada em ação trabalhista. Documentos coletados.',
          rating: 5,
          feedback: 'Excelente atendimento, muito esclarecedor!',
          paymentStatus: 'paid',
          amount: 300,
          followUpRequired: true,
          documents: ['contrato_trabalho.pdf', 'holerites.pdf']
        },
        {
          id: '2',
          clientName: 'João Santos',
          clientPhone: '(11) 88888-8888',
          clientEmail: 'joao@email.com',
          appointmentType: 'Acompanhamento',
          date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 dias atrás
          duration: 45,
          location: 'Online',
          status: 'completed',
          notes: 'Revisão do processo. Próxima audiência agendada.',
          rating: 4,
          paymentStatus: 'paid',
          amount: 200
        },
        {
          id: '3',
          clientName: 'Ana Costa',
          clientPhone: '(11) 77777-7777',
          appointmentType: 'Consulta Inicial',
          date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 1 semana atrás
          duration: 90,
          location: 'Escritório Principal',
          status: 'cancelled',
          notes: 'Cliente cancelou por motivos pessoais.',
          paymentStatus: 'pending'
        },
        {
          id: '4',
          clientName: 'Pedro Oliveira',
          clientPhone: '(11) 66666-6666',
          appointmentType: 'Revisão de Contrato',
          date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 dias atrás
          duration: 120,
          location: 'Escritório Principal',
          status: 'no-show',
          notes: 'Cliente não compareceu e não justificou ausência.',
          paymentStatus: 'overdue',
          amount: 400
        }
      ]
      setHistoricalAppointments(mockAppointments)
    }
  }, [appointments])

  const getStatusBadge = (status: HistoricalAppointment['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Concluído</Badge>
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800">Cancelado</Badge>
      case 'no-show':
        return <Badge className="bg-red-100 text-red-800">Faltou</Badge>
      case 'rescheduled':
        return <Badge className="bg-blue-100 text-blue-800">Reagendado</Badge>
      default:
        return null
    }
  }

  const getPaymentBadge = (status?: HistoricalAppointment['paymentStatus']) => {
    if (!status) return null
    
    switch (status) {
      case 'paid':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Pago</Badge>
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendente</Badge>
      case 'overdue':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Vencido</Badge>
      default:
        return null
    }
  }

  const renderStars = (rating?: number) => {
    if (!rating) return null
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-3 w-3",
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            )}
          />
        ))}
        <span className="text-xs text-gray-500 ml-1">({rating})</span>
      </div>
    )
  }

  // Filtrar agendamentos
  const filteredAppointments = historicalAppointments.filter(appointment => {
    const matchesSearch = appointment.clientName.toLowerCase().includes(filters.search.toLowerCase()) ||
                         appointment.appointmentType.toLowerCase().includes(filters.search.toLowerCase())
    
    const matchesStatus = filters.status === 'all' || appointment.status === filters.status
    const matchesType = filters.appointmentType === 'all' || appointment.appointmentType === filters.appointmentType
    const matchesPayment = filters.paymentStatus === 'all' || appointment.paymentStatus === filters.paymentStatus
    
    let matchesPeriod = true
    if (filters.period !== 'all') {
      const now = new Date()
      const appointmentDate = appointment.date
      
      switch (filters.period) {
        case 'week':
          matchesPeriod = (now.getTime() - appointmentDate.getTime()) <= 7 * 24 * 60 * 60 * 1000
          break
        case 'month':
          matchesPeriod = (now.getTime() - appointmentDate.getTime()) <= 30 * 24 * 60 * 60 * 1000
          break
        case 'quarter':
          matchesPeriod = (now.getTime() - appointmentDate.getTime()) <= 90 * 24 * 60 * 60 * 1000
          break
      }
    }
    
    return matchesSearch && matchesStatus && matchesType && matchesPayment && matchesPeriod
  })

  // Estatísticas
  const stats = {
    total: filteredAppointments.length,
    completed: filteredAppointments.filter(a => a.status === 'completed').length,
    cancelled: filteredAppointments.filter(a => a.status === 'cancelled').length,
    noShow: filteredAppointments.filter(a => a.status === 'no-show').length,
    totalRevenue: filteredAppointments
      .filter(a => a.paymentStatus === 'paid' && a.amount)
      .reduce((sum, a) => sum + (a.amount || 0), 0)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Filtros */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Histórico de Agendamentos</CardTitle>
              <CardDescription>
                {stats.total} agendamento(s) encontrado(s)
              </CardDescription>
            </div>
            {onExportData && (
              <Button variant="outline" onClick={onExportData}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Estatísticas rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-xs text-green-700">Concluídos</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{stats.cancelled}</div>
              <div className="text-xs text-gray-700">Cancelados</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{stats.noShow}</div>
              <div className="text-xs text-red-700">Faltas</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                R$ {stats.totalRevenue.toLocaleString('pt-BR')}
              </div>
              <div className="text-xs text-blue-700">Receita</div>
            </div>
          </div>

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar cliente ou tipo..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>
            
            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
                <SelectItem value="no-show">Faltou</SelectItem>
                <SelectItem value="rescheduled">Reagendado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.period} onValueChange={(value) => setFilters(prev => ({ ...prev, period: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Períodos</SelectItem>
                <SelectItem value="week">Última Semana</SelectItem>
                <SelectItem value="month">Último Mês</SelectItem>
                <SelectItem value="quarter">Último Trimestre</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.appointmentType} onValueChange={(value) => setFilters(prev => ({ ...prev, appointmentType: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="Consulta Inicial">Consulta Inicial</SelectItem>
                <SelectItem value="Acompanhamento">Acompanhamento</SelectItem>
                <SelectItem value="Revisão de Contrato">Revisão de Contrato</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.paymentStatus} onValueChange={(value) => setFilters(prev => ({ ...prev, paymentStatus: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="paid">Pago</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="overdue">Vencido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de agendamentos */}
      <Card>
        <CardContent className="p-0">
          {filteredAppointments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Calendar className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-sm text-gray-500">Nenhum agendamento encontrado</p>
            </div>
          ) : (
            <ScrollArea className="h-96">
              <div className="space-y-1">
                {filteredAppointments.map((appointment, index) => (
                  <div key={appointment.id}>
                    <div className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-gray-900">
                              {appointment.clientName}
                            </h4>
                            {getStatusBadge(appointment.status)}
                            {getPaymentBadge(appointment.paymentStatus)}
                            {appointment.followUpRequired && (
                              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                                Follow-up
                              </Badge>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              <span>{appointment.appointmentType}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              <span>
                                {appointment.date.toLocaleDateString('pt-BR')} às{' '}
                                {appointment.date.toLocaleTimeString('pt-BR', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3 w-3" />
                              <span>{appointment.location}</span>
                            </div>

                            {appointment.amount && (
                              <div className="flex items-center gap-2">
                                <span className="text-green-600 font-medium">
                                  R$ {appointment.amount.toLocaleString('pt-BR')}
                                </span>
                              </div>
                            )}
                          </div>

                          {appointment.rating && (
                            <div className="mt-2">
                              {renderStars(appointment.rating)}
                            </div>
                          )}

                          {appointment.notes && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-500 line-clamp-2">
                                {appointment.notes}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedAppointment(appointment)}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Detalhes
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Detalhes do Agendamento</DialogTitle>
                                <DialogDescription>
                                  Informações completas do agendamento
                                </DialogDescription>
                              </DialogHeader>
                              
                              {selectedAppointment && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium">Cliente</label>
                                      <p className="text-sm text-gray-600">{selectedAppointment.clientName}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Tipo</label>
                                      <p className="text-sm text-gray-600">{selectedAppointment.appointmentType}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Data/Hora</label>
                                      <p className="text-sm text-gray-600">
                                        {selectedAppointment.date.toLocaleDateString('pt-BR')} às{' '}
                                        {selectedAppointment.date.toLocaleTimeString('pt-BR', {
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Local</label>
                                      <p className="text-sm text-gray-600">{selectedAppointment.location}</p>
                                    </div>
                                  </div>

                                  {selectedAppointment.notes && (
                                    <div>
                                      <label className="text-sm font-medium">Observações</label>
                                      <Textarea 
                                        value={selectedAppointment.notes} 
                                        readOnly 
                                        className="mt-1"
                                      />
                                    </div>
                                  )}

                                  {selectedAppointment.feedback && (
                                    <div>
                                      <label className="text-sm font-medium">Feedback do Cliente</label>
                                      <Textarea 
                                        value={selectedAppointment.feedback} 
                                        readOnly 
                                        className="mt-1"
                                      />
                                    </div>
                                  )}

                                  {selectedAppointment.documents && selectedAppointment.documents.length > 0 && (
                                    <div>
                                      <label className="text-sm font-medium">Documentos</label>
                                      <div className="flex flex-wrap gap-2 mt-1">
                                        {selectedAppointment.documents.map((doc, idx) => (
                                          <Badge key={idx} variant="outline">
                                            {doc}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                    
                    {index < filteredAppointments.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Hook para gerenciar histórico
export function useAppointmentHistory() {
  const [history, setHistory] = useState<HistoricalAppointment[]>([])

  useEffect(() => {
    // Simular carregamento de dados
    const loadHistory = () => {
      // Aqui você faria a chamada real para a API
      const now = new Date()
      const mockHistory: HistoricalAppointment[] = [
        {
          id: '1',
          clientName: 'Maria Silva',
          appointmentType: 'Consulta Inicial',
          date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
          duration: 60,
          location: 'Escritório Principal',
          status: 'completed',
          paymentStatus: 'paid',
          amount: 300,
          rating: 5
        }
      ]
      setHistory(mockHistory)
    }

    loadHistory()
  }, [])

  const exportData = () => {
    // Implementar exportação de dados
    console.log('Exportando dados do histórico...')
  }

  return {
    history,
    exportData
  }
}