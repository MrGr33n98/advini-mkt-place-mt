'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Search, Star, MapPin, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface LawyerFiltersProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedSpecialty: string;
  onSpecialtyChange: (value: string) => void;
  specialties: string[];
  onClearFilters: () => void;
  areFiltersActive: boolean;
  selectedRating?: string;
  onRatingChange?: (value: string) => void;
  selectedSortBy?: string;
  onSortByChange?: (value: string) => void;
  selectedLocation?: string;
  onLocationChange?: (value: string) => void;
  selectedPriceRange?: string;
  onPriceRangeChange?: (value: string) => void;
}

export function LawyerFilters({
  searchQuery,
  onSearchChange,
  selectedSpecialty,
  onSpecialtyChange,
  specialties,
  onClearFilters,
  areFiltersActive,
  selectedRating = 'all',
  onRatingChange,
  selectedSortBy = 'relevance',
  onSortByChange,
  selectedLocation = 'all',
  onLocationChange,
  selectedPriceRange = 'all',
  onPriceRangeChange,
}: LawyerFiltersProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 p-4 border rounded-lg bg-card">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Filtros de Busca</h2>
        {areFiltersActive && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="mr-2 h-4 w-4" />
            Limpar
          </Button>
        )}
      </div>
      
      {/* Busca por texto */}
      <div className="space-y-2">
        <Label htmlFor="search" className="text-sm font-medium">
          Busca Livre
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            id="search"
            placeholder="Nome, especialidade, OAB..."
            value={searchQuery}
            onChange={onSearchChange}
            className="pl-10"
          />
        </div>
      </div>

      {/* Filtro por especialidade */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Especialidade
        </Label>
        <Select onValueChange={onSpecialtyChange} value={selectedSpecialty}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma especialidade" />
          </SelectTrigger>
          <SelectContent>
            {specialties.map(spec => (
              <SelectItem key={spec} value={spec}>
                {spec === 'all' ? 'Todas as Especialidades' : spec}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Botão de Busca Avançada */}
      <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Busca Avançada
            </div>
            {isAdvancedOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="space-y-4 mt-4">
          {/* Filtro por avaliação */}
          {onRatingChange && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Avaliação Mínima
              </Label>
              <Select onValueChange={onRatingChange} value={selectedRating}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma avaliação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Avaliações</SelectItem>
                  <SelectItem value="4.5">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      4.5+ Excelente
                    </div>
                  </SelectItem>
                  <SelectItem value="4.0">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      4.0+ Muito Bom
                    </div>
                  </SelectItem>
                  <SelectItem value="3.5">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      3.5+ Bom
                    </div>
                  </SelectItem>
                  <SelectItem value="3.0">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      3.0+ Regular
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Filtro por ordenação */}
          {onSortByChange && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Ordenar por
              </Label>
              <Select onValueChange={onSortByChange} value={selectedSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a ordenação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevância</SelectItem>
                  <SelectItem value="rating">Maior Avaliação</SelectItem>
                  <SelectItem value="name">Nome (A-Z)</SelectItem>
                  <SelectItem value="reviews">Mais Avaliados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Filtro por localização */}
          {onLocationChange && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Região
              </Label>
              <Select onValueChange={onLocationChange} value={selectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma região" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Regiões</SelectItem>
                  <SelectItem value="centro">Centro</SelectItem>
                  <SelectItem value="norte">Região Norte</SelectItem>
                  <SelectItem value="sul">Região Sul</SelectItem>
                  <SelectItem value="leste">Região Leste</SelectItem>
                  <SelectItem value="oeste">Região Oeste</SelectItem>
                  <SelectItem value="varzea-grande">Várzea Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Filtro por faixa de preço */}
          {onPriceRangeChange && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Faixa de Preço
              </Label>
              <Select onValueChange={onPriceRangeChange} value={selectedPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma faixa de preço" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Faixas</SelectItem>
                  <SelectItem value="0-200">Até R$ 200</SelectItem>
                  <SelectItem value="200-500">R$ 200 - R$ 500</SelectItem>
                  <SelectItem value="500-1000">R$ 500 - R$ 1.000</SelectItem>
                  <SelectItem value="1000-2000">R$ 1.000 - R$ 2.000</SelectItem>
                  <SelectItem value="2000+">Acima de R$ 2.000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>

      {/* Informação sobre localização */}
      <div className="pt-4 border-t">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>Região: Cuiabá-MT</span>
        </div>
      </div>
    </div>
  );
}