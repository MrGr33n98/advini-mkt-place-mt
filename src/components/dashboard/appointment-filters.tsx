"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Filter, X, Search } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface AppointmentFiltersProps {
  onFiltersChange: (filters: AppointmentFilters) => void
  appointmentTypes: string[]
  locations: string[]
}

export interface AppointmentFilters {
  search: string
  status: string
  type: string
  location: string
  dateFrom?: Date
  dateTo?: Date
}

export function AppointmentFilters({ 
  onFiltersChange, 
  appointmentTypes, 
  locations 
}: AppointmentFiltersProps) {
  const [filters, setFilters] = useState<AppointmentFilters>({
    search: "",
    status: "all",
    type: "all",
    location: "all"
  })
  const [isExpanded, setIsExpanded] = useState(false)

  const updateFilters = (newFilters: Partial<AppointmentFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFiltersChange(updatedFilters)
  }

  const clearFilters = () => {
    const clearedFilters: AppointmentFilters = {
      search: "",
      status: "all",
      type: "all",
      location: "all"
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const hasActiveFilters = () => {
    return filters.search !== "" || 
           filters.status !== "all" || 
           filters.type !== "all" || 
           filters.location !== "all" ||
           filters.dateFrom || 
           filters.dateTo
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.search !== "") count++
    if (filters.status !== "all") count++
    if (filters.type !== "all") count++
    if (filters.location !== "all") count++
    if (filters.dateFrom) count++
    if (filters.dateTo) count++
    return count
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros
            {hasActiveFilters() && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters() && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" />
                Limpar
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Recolher" : "Expandir"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Busca por nome */}
        <div className="space-y-2">
          <Label htmlFor="search">Buscar por nome do cliente</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="search"
              placeholder="Digite o nome do cliente..."
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filtros básicos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={filters.status} onValueChange={(value) => updateFilters({ status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="confirmed">Confirmados</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="cancelled">Cancelados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tipo de Agendamento</Label>
            <Select value={filters.type} onValueChange={(value) => updateFilters({ type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {appointmentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Local</Label>
            <Select value={filters.location} onValueChange={(value) => updateFilters({ location: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Filtros avançados */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data inicial</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !filters.dateFrom && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateFrom ? (
                        format(filters.dateFrom, "PPP", { locale: ptBR })
                      ) : (
                        "Selecionar data"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateFrom}
                      onSelect={(date) => updateFilters({ dateFrom: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Data final</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !filters.dateTo && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateTo ? (
                        format(filters.dateTo, "PPP", { locale: ptBR })
                      ) : (
                        "Selecionar data"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateTo}
                      onSelect={(date) => updateFilters({ dateTo: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        )}

        {/* Filtros ativos */}
        {hasActiveFilters() && (
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            {filters.search && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Busca: {filters.search}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => updateFilters({ search: "" })}
                />
              </Badge>
            )}
            {filters.status !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Status: {filters.status}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => updateFilters({ status: "all" })}
                />
              </Badge>
            )}
            {filters.type !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Tipo: {filters.type}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => updateFilters({ type: "all" })}
                />
              </Badge>
            )}
            {filters.location !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Local: {filters.location}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => updateFilters({ location: "all" })}
                />
              </Badge>
            )}
            {filters.dateFrom && (
              <Badge variant="secondary" className="flex items-center gap-1">
                De: {format(filters.dateFrom, "dd/MM/yyyy")}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => updateFilters({ dateFrom: undefined })}
                />
              </Badge>
            )}
            {filters.dateTo && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Até: {format(filters.dateTo, "dd/MM/yyyy")}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => updateFilters({ dateTo: undefined })}
                />
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}