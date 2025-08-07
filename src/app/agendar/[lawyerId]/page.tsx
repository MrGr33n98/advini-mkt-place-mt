'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Phone, 
  Video, 
  Building, 
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Star,
  User
} from 'lucide-react'
import { format, addDays, isSameDay, isAfter, isBefore } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { AppointmentFormData, TimeSlot, AppointmentType, LawyerAvailability } from '@/types/appointment'
import { Lawyer } from '@/types/lawyer'

// Mock data para demonstração
const mockLawyer: Lawyer = {
  id: "1",
  name: "Dr. João Silva",
  specialties: ["Direito Civil", "Direito de Família"],
  latitude: -15.6014,
  longitude: -56.0979,
  slug: "joao-silva",
  oab: "MT-12345",
  phone: "(65) 99999-9999",
  email: "joao@email.com",
  bio: "Advogado especialista em Direito Civil e de Família com mais de 10 anos de experiência.",
  profile_image_url: "/placeholder-lawyer.jpg",
  average_rating: 4.8,
  total_reviews: 127,
  plan: "gold",
  status: "approved",
  office_address: "Rua das Flores, 123 - Centro, Cuiabá - MT",
  working_hours: [
    { day: "Segunda", start: "08:00", end: "18:00", isOpen: true },
    { day: "Terça", start: "08:00", end: "18:00", isOpen: true },
    { day: "Quarta", start: "08:00", end: "18:00", isOpen: true },
    { day: "Quinta", start: "08:00", end: "18:00", isOpen: true },
    { day: "Sexta", start: "08:00", end: "17:00", isOpen: true },
    { day: "Sábado", start: "08:00", end: "12:00", isOpen: true },
    { day: "Domingo", start: "", end: "", isOpen: false }
  ]
}

const mockAppointmentTypes: AppointmentType[] = [
  { id: "1", name: "Consulta Inicial", duration: 60, price: 200, description: "Primeira consulta para análise do caso" },
  { id: "2", name: "Acompanhamento", duration: 30, price: 150, description: "Acompanhamento de processo em andamento" },
  { id: "3", name: "Orientação Jurídica", duration: 45, price: 180, description: "Orientação sobre questões jurídicas específicas" },
  { id: "4", name: "Elaboração de Documentos", duration: 90, price: 300, description: "Elaboração de contratos e documentos legais" }
]

const generateTimeSlots = (date: Date): TimeSlot[] => {
  const slots: TimeSlot[] = []
  const startHour = 8
  const endHour = 18
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      const slotDate = new Date(date)
      slotDate.setHours(hour, minute, 0, 0)
      
      // Simular disponibilidade (alguns horários ocupados)
      const isAvailable = Math.random() > 0.3 && isAfter(slotDate, new Date())
      
      slots.push({
        id: `${format(date, 'yyyy-MM-dd')}-${timeString}`,
        time: timeString,
        available: isAvailable,
        duration: 30
      })
    }
  }
  
  return slots
}

export default function ScheduleAppointmentPage() {
  const params = useParams()
  const router = useRouter()
  const lawyerId = params.lawyerId as string
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("")
  const [selectedAppointmentType, setSelectedAppointmentType] = useState<string>("")
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<'date' | 'time' | 'details' | 'confirmation'>('date')
  
  const [formData, setFormData] = useState<AppointmentFormData>({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientCpf: "",
    appointmentType: "",
    description: "",
    urgency: "media",
    preferredContact: "email",
    hasDocuments: false,
    documentsDescription: "",
    acceptTerms: false,
    acceptPrivacy: false
  })

  // Gerar horários disponíveis quando a data é selecionada
  useEffect(() => {
    if (selectedDate) {
      const slots = generateTimeSlots(selectedDate)
      setTimeSlots(slots)
    }
  }, [selectedDate])

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    setSelectedTimeSlot("")
    setFormData(prev => ({ ...prev, date }))
    if (date) {
      setStep('time')
    }
  }

  const handleTimeSlotSelect = (timeSlotId: string) => {
    setSelectedTimeSlot(timeSlotId)
    setFormData(prev => ({ ...prev, timeSlot: timeSlotId }))
    setStep('details')
  }

  const handleAppointmentTypeSelect = (typeId: string) => {
    setSelectedAppointmentType(typeId)
    setFormData(prev => ({ ...prev, appointmentType: typeId }))
  }

  const handleInputChange = (field: keyof AppointmentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    
    try {
      // Validação básica
      if (!formData.clientName || !formData.clientEmail || !formData.clientPhone) {
        toast.error("Por favor, preencha todos os campos obrigatórios")
        return
      }

      // Simular envio da solicitação
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setStep('confirmation')
      toast.success("Solicitação de agendamento enviada com sucesso!")
      
    } catch (error) {
      toast.error("Erro ao enviar solicitação. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const selectedAppointmentTypeData = mockAppointmentTypes.find(type => type.id === selectedAppointmentType)
  const selectedTimeSlotData = timeSlots.find(slot => slot.id === selectedTimeSlot)

  const isDateDisabled = (date: Date) => {
    return isBefore(date, new Date()) || date.getDay() === 0 // Desabilitar domingos e datas passadas
  }

  if (step === 'confirmation') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl text-green-600 dark:text-green-400">
                Solicitação Enviada!
              </CardTitle>
              <CardDescription className="text-lg">
                Sua solicitação de agendamento foi enviada com sucesso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Detalhes do Agendamento:</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Advogado:</strong> {mockLawyer.name}</p>
                  <p><strong>Data:</strong> {selectedDate && format(selectedDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
                  <p><strong>Horário:</strong> {selectedTimeSlotData?.time}</p>
                  <p><strong>Tipo:</strong> {selectedAppointmentTypeData?.name}</p>
                  <p><strong>Cliente:</strong> {formData.clientName}</p>
                  <p><strong>Email:</strong> {formData.clientEmail}</p>
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-800 dark:text-blue-200">Próximos passos:</p>
                    <ul className="mt-2 space-y-1 text-blue-700 dark:text-blue-300">
                      <li>• O advogado receberá sua solicitação</li>
                      <li>• Você receberá uma confirmação por email em até 24h</li>
                      <li>• Caso necessário, o advogado entrará em contato</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => router.push(`/advogados/${lawyerId}`)}
                  variant="outline" 
                  className="flex-1"
                >
                  Ver Perfil do Advogado
                </Button>
                <Button 
                  onClick={() => router.push('/advogados')}
                  className="flex-1"
                >
                  Buscar Outros Advogados
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto pt-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="w-16 h-16">
              <AvatarImage src={mockLawyer.profile_image_url} alt={mockLawyer.name} />
              <AvatarFallback>{mockLawyer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Agendar Consulta
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                com {mockLawyer.name}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{mockLawyer.average_rating}</span>
                </div>
                <span className="text-sm text-gray-500">({mockLawyer.total_reviews} avaliações)</span>
                {mockLawyer.status === 'approved' && (
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verificado
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[
                { key: 'date', label: 'Data', icon: CalendarIcon },
                { key: 'time', label: 'Horário', icon: Clock },
                { key: 'details', label: 'Detalhes', icon: User }
              ].map((stepItem, index) => {
                const isActive = step === stepItem.key
                const isCompleted = ['date', 'time', 'details'].indexOf(step) > ['date', 'time', 'details'].indexOf(stepItem.key)
                
                return (
                  <div key={stepItem.key} className="flex items-center">
                    <div className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                      isActive ? "border-blue-600 bg-blue-600 text-white" :
                      isCompleted ? "border-green-600 bg-green-600 text-white" :
                      "border-gray-300 bg-white text-gray-400"
                    )}>
                      <stepItem.icon className="w-5 h-5" />
                    </div>
                    <span className={cn(
                      "ml-2 text-sm font-medium",
                      isActive ? "text-blue-600" :
                      isCompleted ? "text-green-600" :
                      "text-gray-400"
                    )}>
                      {stepItem.label}
                    </span>
                    {index < 2 && (
                      <div className={cn(
                        "w-12 h-0.5 mx-4",
                        isCompleted ? "bg-green-600" : "bg-gray-300"
                      )} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 'date' && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    Selecione a Data
                  </CardTitle>
                  <CardDescription>
                    Escolha uma data disponível para sua consulta
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={isDateDisabled}
                    locale={ptBR}
                    className="rounded-md border w-full"
                  />
                </CardContent>
              </Card>
            )}

            {step === 'time' && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Selecione o Horário
                  </CardTitle>
                  <CardDescription>
                    Data selecionada: {selectedDate && format(selectedDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot.id}
                        variant={selectedTimeSlot === slot.id ? "default" : "outline"}
                        disabled={!slot.available}
                        onClick={() => handleTimeSlotSelect(slot.id)}
                        className={cn(
                          "h-12",
                          !slot.available && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        {slot.time}
                      </Button>
                    ))}
                  </div>
                  
                  <div className="mt-6 flex gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setStep('date')}
                    >
                      Voltar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 'details' && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Seus Dados
                  </CardTitle>
                  <CardDescription>
                    Preencha suas informações para finalizar o agendamento
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Tipo de Consulta */}
                  <div className="space-y-3">
                    <Label>Tipo de Consulta *</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {mockAppointmentTypes.map((type) => (
                        <Card 
                          key={type.id}
                          className={cn(
                            "cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800",
                            selectedAppointmentType === type.id && "ring-2 ring-blue-600 bg-blue-50 dark:bg-blue-900/20"
                          )}
                          onClick={() => handleAppointmentTypeSelect(type.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium">{type.name}</h4>
                              <Badge variant="secondary">
                                R$ {type.price}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {type.description}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock className="w-3 h-3" />
                              {type.duration} minutos
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Dados Pessoais */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="clientName">Nome Completo *</Label>
                      <Input
                        id="clientName"
                        value={formData.clientName}
                        onChange={(e) => handleInputChange('clientName', e.target.value)}
                        placeholder="Seu nome completo"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="clientEmail">Email *</Label>
                      <Input
                        id="clientEmail"
                        type="email"
                        value={formData.clientEmail}
                        onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                        placeholder="seu@email.com"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="clientPhone">Telefone *</Label>
                      <Input
                        id="clientPhone"
                        value={formData.clientPhone}
                        onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                        placeholder="(65) 99999-9999"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="preferredContact">Forma de Contato Preferida</Label>
                      <Select value={formData.preferredContact} onValueChange={(value) => handleInputChange('preferredContact', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a forma de contato" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">
                            <div className="flex items-center gap-2">
                              <Building className="w-4 h-4" />
                              Email
                            </div>
                          </SelectItem>
                          <SelectItem value="phone">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              Telefone
                            </div>
                          </SelectItem>
                          <SelectItem value="whatsapp">
                            <div className="flex items-center gap-2">
                              <Video className="w-4 h-4" />
                              WhatsApp
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgência do Caso</Label>
                    <Select value={formData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a urgência" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baixa">Baixa - Posso aguardar</SelectItem>
                        <SelectItem value="media">Média - Preciso de orientação</SelectItem>
                        <SelectItem value="alta">Alta - Caso urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição do Caso</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Descreva brevemente seu caso ou dúvidas..."
                      rows={4}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setStep('time')}
                      className="flex-1"
                    >
                      Voltar
                    </Button>
                    <Button 
                      onClick={handleSubmit}
                      disabled={isLoading || !formData.clientName || !formData.clientEmail || !formData.clientPhone || !selectedAppointmentType}
                      className="flex-1"
                    >
                      {isLoading ? "Enviando..." : "Solicitar Agendamento"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Resumo do Agendamento */}
            <Card className="shadow-lg sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Resumo do Agendamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Data</p>
                      <p className="text-sm text-gray-600">
                        {selectedDate ? format(selectedDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Não selecionada"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Horário</p>
                      <p className="text-sm text-gray-600">
                        {selectedTimeSlotData?.time || "Não selecionado"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Tipo de Consulta</p>
                      <p className="text-sm text-gray-600">
                        {selectedAppointmentTypeData?.name || "Não selecionado"}
                      </p>
                    </div>
                  </div>

                  {selectedAppointmentTypeData && (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <span className="text-lg">💰</span>
                      </div>
                      <div>
                        <p className="font-medium">Valor</p>
                        <p className="text-sm text-gray-600">
                          R$ {selectedAppointmentTypeData.price}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium">Informações do Advogado</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>{mockLawyer.name}</p>
                    <p>{mockLawyer.oab}</p>
                    <p className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {mockLawyer.office_address}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informações de Contato */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Precisa de Ajuda?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">
                  Entre em contato conosco se tiver dúvidas sobre o agendamento.
                </p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Phone className="w-4 h-4 mr-2" />
                    (65) 3333-4444
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Video className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}