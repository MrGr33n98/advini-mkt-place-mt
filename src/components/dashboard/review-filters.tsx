'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { CalendarIcon, Filter, X, Search, Star } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ReviewFilters } from '@/types/review'
import { DateRange } from 'react-day-picker'

interface ReviewFiltersProps {
  filters: ReviewFilters;
  onFiltersChange: (filters: ReviewFilters) => void;
  onClearFilters: () => void;
}

export function ReviewFiltersComponent({ filters, onFiltersChange, onClearFilters }: ReviewFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: filters.date_range?.start ? new Date(filters.date_range.start) : undefined,
    to: filters.date_range?.end ? new Date(filters.date_range.end) : undefined,
  });

  const handleFilterChange = (key: keyof ReviewFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range) {
      setDateRange({ from: range.from, to: range.to });
      if (range.from && range.to) {
        handleFilterChange('date_range', {
          start: range.from.toISOString(),
          end: range.to.toISOString(),
        });
      } else {
        handleFilterChange('date_range', undefined);
      }
    } else {
      setDateRange({ from: undefined, to: undefined });
      handleFilterChange('date_range', undefined);
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.status && filters.status !== 'all') count++;
    if (filters.rating) count++;
    if (filters.source && filters.source !== 'all') count++;
    if (filters.date_range) count++;
    if (filters.search) count++;
    if (filters.case_type) count++;
    if (filters.service_type) count++;
    if (filters.is_pinned) count++;
    if (filters.is_featured) count++;
    if (filters.has_response !== undefined) count++;
    if (filters.verification_status && filters.verification_status !== 'all') count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Filtros</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            {activeFiltersCount > 0 && (
              <Button variant="outline" size="sm" onClick={onClearFilters}>
                <X className="h-4 w-4 mr-1" />
                Limpar
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Recolher' : 'Expandir'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtros Básicos - Sempre Visíveis */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Busca */}
          <div className="space-y-2">
            <Label htmlFor="search">Buscar</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Nome do cliente, comentário..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="approved">Aprovadas</SelectItem>
                <SelectItem value="rejected">Rejeitadas</SelectItem>
                <SelectItem value="hidden">Ocultas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Avaliação */}
          <div className="space-y-2">
            <Label>Avaliação</Label>
            <Select
              value={filters.rating?.toString() || 'all'}
              onValueChange={(value) => handleFilterChange('rating', value === 'all' ? undefined : parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas as avaliações" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <SelectItem key={rating} value={rating.toString()}>
                    <div className="flex items-center space-x-1">
                      <span>{rating}</span>
                      <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                      <span>ou mais</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fonte */}
          <div className="space-y-2">
            <Label>Fonte</Label>
            <Select
              value={filters.source || 'all'}
              onValueChange={(value) => handleFilterChange('source', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas as fontes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="google">Google</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filtros Avançados - Expansíveis */}
        {isExpanded && (
          <>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Período */}
              <div className="space-y-2">
                <Label>Período</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })} -{" "}
                            {format(dateRange.to, "dd/MM/yyyy", { locale: ptBR })}
                          </>
                        ) : (
                          format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                        )
                      ) : (
                        <span>Selecionar período</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={dateRange.from}
                      selected={dateRange}
                      onSelect={handleDateRangeChange}
                      numberOfMonths={2}
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Tipo de Caso */}
              <div className="space-y-2">
                <Label htmlFor="case_type">Tipo de Caso</Label>
                <Input
                  id="case_type"
                  placeholder="Ex: Divórcio, Trabalhista..."
                  value={filters.case_type || ''}
                  onChange={(e) => handleFilterChange('case_type', e.target.value)}
                />
              </div>

              {/* Tipo de Serviço */}
              <div className="space-y-2">
                <Label htmlFor="service_type">Tipo de Serviço</Label>
                <Input
                  id="service_type"
                  placeholder="Ex: Consultoria, Processo..."
                  value={filters.service_type || ''}
                  onChange={(e) => handleFilterChange('service_type', e.target.value)}
                />
              </div>

              {/* Status de Verificação */}
              <div className="space-y-2">
                <Label>Status de Verificação</Label>
                <Select
                  value={filters.verification_status || 'all'}
                  onValueChange={(value) => handleFilterChange('verification_status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="verified">Verificadas</SelectItem>
                    <SelectItem value="unverified">Não Verificadas</SelectItem>
                    <SelectItem value="suspicious">Suspeitas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Checkboxes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_pinned"
                  checked={filters.is_pinned || false}
                  onCheckedChange={(checked) => handleFilterChange('is_pinned', checked)}
                />
                <Label htmlFor="is_pinned">Fixadas</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_featured"
                  checked={filters.is_featured || false}
                  onCheckedChange={(checked) => handleFilterChange('is_featured', checked)}
                />
                <Label htmlFor="is_featured">Em Destaque</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="has_response"
                  checked={filters.has_response || false}
                  onCheckedChange={(checked) => handleFilterChange('has_response', checked)}
                />
                <Label htmlFor="has_response">Com Resposta</Label>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}