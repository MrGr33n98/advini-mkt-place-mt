'use client'

import React, { useState, useEffect } from 'react'
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
  Award,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Lawyer } from '@/lib/api'
import { useLawyers, useSpecializations } from '@/hooks/useApi'

export default function LawyersPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [selectedSpecialty, setSelectedSpecialty] = useState(searchParams.get('specialty') || '')
  const [selectedPlan, setSelectedPlan] = useState('')
  const [sortBy, setSortBy] = useState('rating')
  const [currentPage, setCurrentPage] = useState(1)

  // API hooks
  const { 
    lawyers, 
    pagination, 
    loading: lawyersLoading, 
    error: lawyersError, 
    fetchLawyers 
  } = useLawyers({
    search: searchQuery || undefined,
    specialization: selectedSpecialty && selectedSpecialty !== 'all' ? selectedSpecialty : undefined,
    sort_by: sortBy,
    page: currentPage,
    per_page: 10
  })

  const { 
    specializations, 
    loading: specializationsLoading 
  } = useSpecializations()

  // Atualizar página quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1)
    fetchLawyers({
      search: searchQuery || undefined,
      specialization: selectedSpecialty && selectedSpecialty !== 'all' ? selectedSpecialty : undefined,
      sort_by: sortBy,
      page: 1,
      per_page: 10
    })
  }, [searchQuery, selectedSpecialty, sortBy, fetchLawyers])

  const handleScheduleAppointment = (lawyerId: number) => {
    router.push(`/agendar/${lawyerId}`)
  }

  const handleViewProfile = (lawyerId: number) => {
    // Implementar navegação para o perfil do advogado
    console.log('Ver perfil do advogado:', lawyerId)
    // router.push(`/advogados/${lawyerId}`)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedSpecialty('')
    setSelectedPlan('')
    setSortBy('rating')
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchLawyers({
      search: searchQuery || undefined,
      specialization: selectedSpecialty && selectedSpecialty !== 'all' ? selectedSpecialty : undefined,
      sort_by: sortBy,
      page,
      per_page: 10
    })
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
              {lawyersLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Carregando...
                </>
              ) : (
                <>
                  <Users className="w-4 h-4" />
                  {pagination?.total_count || 0} advogados encontrados
                </>
              )}
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
                      <SelectItem value="">Todas as especialidades</SelectItem>
                      {specializationsLoading ? (
                        <SelectItem value="" disabled>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Carregando...
                        </SelectItem>
                      ) : (
                        specializations.map((specialization) => (
                          <SelectItem key={specialization.id} value={specialization.name}>
                            {specialization.name} ({specialization.lawyers_count})
                          </SelectItem>
                        ))
                      )}
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
                      <SelectItem value="">Todos os planos</SelectItem>
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
            {lawyersError && (
              <Card className="mb-6">
                <CardContent className="text-center py-6">
                  <div className="text-red-500 mb-2">Erro ao carregar advogados</div>
                  <p className="text-sm text-gray-600">{lawyersError}</p>
                  <Button 
                    onClick={() => window.location.reload()} 
                    variant="outline" 
                    className="mt-4"
                  >
                    Tentar novamente
                  </Button>
                </CardContent>
              </Card>
            )}
            
            <div className="space-y-6">
              {lawyersLoading && lawyers.length === 0 ? (
                // Loading skeleton
                Array.from({ length: 3 }).map((_, index) => (
                  <Card key={index} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-3">
                          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-full"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                lawyers.map((lawyer) => (
                  <Card key={lawyer.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Avatar e Info Básica */}
                        <div className="flex items-start gap-4">
                          <Avatar className="w-20 h-20">
                            <AvatarImage src={lawyer.profile_image_url || undefined} alt={lawyer.name} />
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
                                  OAB: {lawyer.oab_number}
                                </p>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                {lawyer.is_featured && (
                                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                    <Award className="w-3 h-3 mr-1" />
                                    Destaque
                                  </Badge>
                                )}
                                {lawyer.status === 'approved' && (
                                  <Badge variant="outline" className="border-green-500 text-green-700">
                                    Verificado
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Avaliação */}
                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{lawyer.average_rating?.toFixed(1) || 'N/A'}</span>
                              </div>
                              <span className="text-sm text-gray-500">
                                ({lawyer.reviews_count || 0} avaliações)
                              </span>
                              {lawyer.status === 'approved' && (
                                <>
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                  <span className="text-sm text-green-600">Verificado</span>
                                </>
                              )}
                            </div>

                            {/* Especialidades */}
                            <div className="flex flex-wrap gap-2 mb-3">
                              {lawyer.specializations?.map((specialization) => (
                                <Badge key={specialization.id} variant="secondary" className="text-xs">
                                  {specialization.name}
                                </Badge>
                              ))}
                            </div>

                            {/* Bio */}
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                              {lawyer.bio || 'Advogado experiente e qualificado.'}
                            </p>

                            {/* Informações Adicionais */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span>{lawyer.years_of_experience || 0} anos</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-gray-400" />
                                <span>R$ {lawyer.hourly_rate || 'Consultar'}</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="truncate">{lawyer.city || 'N/A'}</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span>{lawyer.phone ? 'Disponível' : 'Indisponível'}</span>
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
                            onClick={() => handleViewProfile(lawyer.id)}
                            className="w-full"
                          >
                            Ver Perfil
                          </Button>
                          
                          <div className="text-center">
                            <p className="text-sm text-gray-500">Taxa por hora</p>
                            <p className="text-lg font-semibold text-green-600">
                              R$ {lawyer.hourly_rate || 'Consultar'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}

              {!lawyersLoading && lawyers.length === 0 && (
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

              {/* Paginação */}
              {pagination && pagination.total_pages > 1 && (
                <div className="flex items-center justify-between mt-8">
                  <div className="text-sm text-gray-500">
                    Mostrando {((pagination.current_page - 1) * pagination.per_page) + 1} a {Math.min(pagination.current_page * pagination.per_page, pagination.total_count)} de {pagination.total_count} advogados
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.current_page - 1)}
                      disabled={pagination.current_page === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Anterior
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: pagination.total_pages }, (_, i) => i + 1)
                        .filter(page => 
                          page === 1 || 
                          page === pagination.total_pages || 
                          Math.abs(page - pagination.current_page) <= 1
                        )
                        .map((page, index, array) => (
                          <React.Fragment key={page}>
                            {index > 0 && array[index - 1] !== page - 1 && (
                              <span className="px-2 text-gray-400">...</span>
                            )}
                            <Button
                              variant={pagination.current_page === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(page)}
                              className="w-8 h-8 p-0"
                            >
                              {page}
                            </Button>
                          </React.Fragment>
                        ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.current_page + 1)}
                      disabled={pagination.current_page === pagination.total_pages}
                    >
                      Próxima
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}