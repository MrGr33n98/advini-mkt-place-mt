'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { 
  Search, 
  MapPin, 
  Star, 
  Phone, 
  Calendar,
  Filter,
  SortAsc,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Award
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Lawyer } from '@/types/lawyer'

// Mock data para demonstração
const mockLawyers: Lawyer[] = [
  {
    id: "1",
    name: "Dr. João Silva",
    specialties: ["Direito Civil", "Direito de Família"],
    latitude: -15.6014,
    longitude: -56.0979,
    slug: "joao-silva",
    bio: "Advogado especialista em Direito Civil e de Família com mais de 10 anos de experiência.",
    oab: "MT-12345",
    phone: "(65) 99999-9999",
    email: "joao@email.com",
    status: "approved",
    profile_image_url: "/placeholder-lawyer.jpg",
    average_rating: 4.8,
    total_reviews: 127,
    hourly_rate: 200,
    consultation_fee: 150,
    plan: "gold",
    is_featured: true,
    years_of_experience: 12,
    office_address: "Rua das Flores, 123 - Centro, Cuiabá - MT",
    languages: ["Português", "Inglês"],
    working_hours: [
      { day: "Segunda", start: "08:00", end: "18:00", isOpen: true },
      { day: "Terça", start: "08:00", end: "18:00", isOpen: true },
      { day: "Quarta", start: "08:00", end: "18:00", isOpen: true },
      { day: "Quinta", start: "08:00", end: "18:00", isOpen: true },
      { day: "Sexta", start: "08:00", end: "17:00", isOpen: true },
      { day: "Sábado", start: "08:00", end: "12:00", isOpen: true },
      { day: "Domingo", start: "", end: "", isOpen: false }
    ]
  },
  {
    id: "2",
    name: "Dra. Maria Santos",
    specialties: ["Direito Trabalhista", "Direito Previdenciário"],
    latitude: -15.6014,
    longitude: -56.0979,
    slug: "maria-santos",
    bio: "Especialista em Direito Trabalhista e Previdenciário, com foco em defesa dos direitos dos trabalhadores.",
    oab: "MT-67890",
    phone: "(65) 88888-8888",
    email: "maria@email.com",
    status: "approved",
    profile_image_url: "/placeholder-lawyer-2.jpg",
    average_rating: 4.9,
    total_reviews: 89,
    hourly_rate: 180,
    consultation_fee: 120,
    plan: "silver",
    is_featured: false,
    years_of_experience: 8,
    office_address: "Av. Getúlio Vargas, 456 - Centro, Cuiabá - MT",
    languages: ["Português"],
    working_hours: [
      { day: "Segunda", start: "09:00", end: "17:00", isOpen: true },
      { day: "Terça", start: "09:00", end: "17:00", isOpen: true },
      { day: "Quarta", start: "09:00", end: "17:00", isOpen: true },
      { day: "Quinta", start: "09:00", end: "17:00", isOpen: true },
      { day: "Sexta", start: "09:00", end: "16:00", isOpen: true },
      { day: "Sábado", start: "", end: "", isOpen: false },
      { day: "Domingo", start: "", end: "", isOpen: false }
    ]
  },
  {
    id: "3",
    name: "Dr. Carlos Oliveira",
    specialties: ["Direito Empresarial", "Direito Tributário"],
    latitude: -15.6014,
    longitude: -56.0979,
    slug: "carlos-oliveira",
    bio: "Advogado empresarial com vasta experiência em consultoria jurídica para empresas de todos os portes.",
    oab: "MT-11111",
    phone: "(65) 77777-7777",
    email: "carlos@email.com",
    status: "approved",
    profile_image_url: "/placeholder-lawyer-3.jpg",
    average_rating: 4.7,
    total_reviews: 156,
    hourly_rate: 250,
    consultation_fee: 200,
    plan: "gold",
    is_featured: true,
    years_of_experience: 15,
    office_address: "Rua do Comércio, 789 - Centro, Cuiabá - MT",
    languages: ["Português", "Inglês", "Espanhol"],
    working_hours: [
      { day: "Segunda", start: "08:00", end: "19:00", isOpen: true },
      { day: "Terça", start: "08:00", end: "19:00", isOpen: true },
      { day: "Quarta", start: "08:00", end: "19:00", isOpen: true },
      { day: "Quinta", start: "08:00", end: "19:00", isOpen: true },
      { day: "Sexta", start: "08:00", end: "18:00", isOpen: true },
      { day: "Sábado", start: "", end: "", isOpen: false },
      { day: "Domingo", start: "", end: "", isOpen: false }
    ]
  }
]

const specialties = [
  "Direito Civil",
  "Direito de Família",
  "Direito Trabalhista",
  "Direito Previdenciário",
  "Direito Empresarial",
  "Direito Tributário",
  "Direito Criminal",
  "Direito Imobiliário",
  "Direito do Consumidor",
  "Direito Ambiental"
]

export default function LawyersPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [lawyers, setLawyers] = useState<Lawyer[]>(mockLawyers)
  const [filteredLawyers, setFilteredLawyers] = useState<Lawyer[]>(mockLawyers)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [selectedSpecialty, setSelectedSpecialty] = useState(searchParams.get('specialty') || '')
  const [selectedPlan, setSelectedPlan] = useState('')
  const [sortBy, setSortBy] = useState('rating')
  const [isLoading, setIsLoading] = useState(false)

  // Filtrar e ordenar advogados
  useEffect(() => {
    let filtered = [...lawyers]

    // Filtro por busca
    if (searchQuery) {
      filtered = filtered.filter(lawyer => 
        lawyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lawyer.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        lawyer.office_address?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filtro por especialidade
    if (selectedSpecialty && selectedSpecialty !== 'all') {
      filtered = filtered.filter(lawyer => 
        lawyer.specialties.includes(selectedSpecialty)
      )
    }

    // Filtro por plano
    if (selectedPlan && selectedPlan !== 'all') {
      filtered = filtered.filter(lawyer => lawyer.plan === selectedPlan)
    }

    // Ordenação
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.average_rating || 0) - (a.average_rating || 0)
        case 'reviews':
          return (b.total_reviews || 0) - (a.total_reviews || 0)
        case 'price':
          return (a.consultation_fee || 0) - (b.consultation_fee || 0)
        case 'experience':
          return (b.years_of_experience || 0) - (a.years_of_experience || 0)
        default:
          return 0
      }
    })

    setFilteredLawyers(filtered)
  }, [lawyers, searchQuery, selectedSpecialty, selectedPlan, sortBy])

  const handleScheduleAppointment = (lawyerId: string) => {
    router.push(`/agendar/${lawyerId}`)
  }

  const handleViewProfile = (lawyerSlug: string) => {
    router.push(`/advogados/${lawyerSlug}`)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedSpecialty('all')
    setSelectedPlan('all')
    setSortBy('rating')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Encontre seu Advogado
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Conecte-se com advogados especializados em sua região
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users className="w-4 h-4" />
              {filteredLawyers.length} advogados encontrados
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filtros */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtros
                </CardTitle>
                {(searchQuery || selectedSpecialty || selectedPlan) && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Limpar filtros
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Busca */}
                <div className="space-y-2">
                  <Label>Buscar</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Nome, especialidade ou cidade..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Especialidade */}
                <div className="space-y-2">
                  <Label>Especialidade</Label>
                  <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as especialidades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as especialidades</SelectItem>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Plano */}
                <div className="space-y-2">
                  <Label>Plano</Label>
                  <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os planos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os planos</SelectItem>
                      <SelectItem value="basic">Básico</SelectItem>
                      <SelectItem value="silver">Prata</SelectItem>
                      <SelectItem value="gold">Ouro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Ordenação */}
                <div className="space-y-2">
                  <Label>Ordenar por</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Melhor avaliação</SelectItem>
                      <SelectItem value="reviews">Mais avaliações</SelectItem>
                      <SelectItem value="price">Menor preço</SelectItem>
                      <SelectItem value="experience">Mais experiência</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Advogados */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {filteredLawyers.map((lawyer) => (
                <Card key={lawyer.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Avatar e Info Básica */}
                      <div className="flex items-start gap-4">
                        <Avatar className="w-20 h-20">
                          <AvatarImage src={lawyer.profile_image_url} alt={lawyer.name} />
                          <AvatarFallback className="text-lg">
                            {lawyer.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                {lawyer.name}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {lawyer.oab}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {lawyer.is_featured && (
                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                  <Award className="w-3 h-3 mr-1" />
                                  Destaque
                                </Badge>
                              )}
                              <Badge 
                                variant="outline" 
                                className={cn(
                                  lawyer.plan === 'gold' && "border-yellow-500 text-yellow-700",
                                  lawyer.plan === 'silver' && "border-gray-500 text-gray-700",
                                  lawyer.plan === 'basic' && "border-blue-500 text-blue-700"
                                )}
                              >
                                {lawyer.plan === 'gold' && 'Ouro'}
                                {lawyer.plan === 'silver' && 'Prata'}
                                {lawyer.plan === 'basic' && 'Básico'}
                              </Badge>
                            </div>
                          </div>

                          {/* Avaliação */}
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{lawyer.average_rating}</span>
                            </div>
                            <span className="text-sm text-gray-500">
                              ({lawyer.total_reviews} avaliações)
                            </span>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-green-600">Verificado</span>
                          </div>

                          {/* Especialidades */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {lawyer.specialties.map((specialty) => (
                              <Badge key={specialty} variant="secondary" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>

                          {/* Bio */}
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                            {lawyer.bio}
                          </p>

                          {/* Informações Adicionais */}
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span>{lawyer.years_of_experience} anos</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-gray-400" />
                              <span>R$ {lawyer.consultation_fee}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="truncate">Cuiabá - MT</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span>Disponível</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex flex-col gap-3 lg:w-48">
                        <Button 
                          onClick={() => handleScheduleAppointment(lawyer.id)}
                          className="w-full"
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Agendar Consulta
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          onClick={() => handleViewProfile(lawyer.slug)}
                          className="w-full"
                        >
                          Ver Perfil
                        </Button>
                        
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Consulta inicial</p>
                          <p className="text-lg font-semibold text-green-600">
                            R$ {lawyer.consultation_fee}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredLawyers.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Nenhum advogado encontrado
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Tente ajustar seus filtros ou buscar por outros termos.
                    </p>
                    <Button onClick={clearFilters} variant="outline">
                      Limpar filtros
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}