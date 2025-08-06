'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Search, Filter, X, MapPin, Star, Users, 
  Building2, Award, Shield, SlidersHorizontal
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface OfficeFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedSpecialties: string[];
  setSelectedSpecialties: (specialties: string[]) => void;
  selectedRegions: string[];
  setSelectedRegions: (regions: string[]) => void;
  minRating: number;
  setMinRating: (rating: number) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  planTiers: string[];
  setPlanTiers: (tiers: string[]) => void;
  onlySponsored: boolean;
  setOnlySponsored: (sponsored: boolean) => void;
  onClearFilters: () => void;
}

export default function EnhancedOfficeFilters({
  searchTerm,
  setSearchTerm,
  selectedSpecialties,
  setSelectedSpecialties,
  selectedRegions,
  setSelectedRegions,
  minRating,
  setMinRating,
  sortBy,
  setSortBy,
  planTiers,
  setPlanTiers,
  onlySponsored,
  setOnlySponsored,
  onClearFilters
}: OfficeFiltersProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const specialties = [
    "Direito Civil",
    "Direito Penal",
    "Direito Trabalhista",
    "Direito Empresarial",
    "Direito de Família",
    "Direito Tributário",
    "Direito Imobiliário",
    "Direito do Consumidor",
    "Direito Previdenciário",
    "Direito Administrativo"
  ];

  const regions = [
    "Centro",
    "Centro-Sul",
    "Norte",
    "Sul",
    "Leste",
    "Oeste",
    "Várzea Grande",
    "Região Metropolitana"
  ];

  const handleSpecialtyToggle = (specialty: string) => {
    setSelectedSpecialties(
      selectedSpecialties.includes(specialty)
        ? selectedSpecialties.filter(s => s !== specialty)
        : [...selectedSpecialties, specialty]
    );
  };

  const handleRegionToggle = (region: string) => {
    setSelectedRegions(
      selectedRegions.includes(region)
        ? selectedRegions.filter(r => r !== region)
        : [...selectedRegions, region]
    );
  };

  const handlePlanTierToggle = (tier: string) => {
    setPlanTiers(
      planTiers.includes(tier)
        ? planTiers.filter(t => t !== tier)
        : [...planTiers, tier]
    );
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedSpecialties.length > 0) count++;
    if (selectedRegions.length > 0) count++;
    if (minRating > 0) count++;
    if (planTiers.length > 0) count++;
    if (onlySponsored) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Busca
          </CardTitle>
          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {activeFiltersCount} filtro{activeFiltersCount > 1 ? 's' : ''} ativo{activeFiltersCount > 1 ? 's' : ''}
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Limpar
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Busca por nome */}
        <div className="space-y-2">
          <Label htmlFor="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Buscar por nome do escritório
          </Label>
          <Input
            id="search"
            placeholder="Digite o nome do escritório..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Ordenação */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Ordenar por
          </Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a ordenação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevância</SelectItem>
              <SelectItem value="rating">Melhor avaliação</SelectItem>
              <SelectItem value="name">Nome (A-Z)</SelectItem>
              <SelectItem value="lawyers_count">Número de advogados</SelectItem>
              <SelectItem value="plan_tier">Plano (Premium primeiro)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Filtros rápidos */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Filtros Rápidos</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={onlySponsored ? "default" : "outline"}
              size="sm"
              onClick={() => setOnlySponsored(!onlySponsored)}
              className="text-xs"
            >
              <Star className="h-3 w-3 mr-1" />
              Patrocinados
            </Button>
            
            <Button
              variant={minRating >= 4 ? "default" : "outline"}
              size="sm"
              onClick={() => setMinRating(minRating >= 4 ? 0 : 4)}
              className="text-xs"
            >
              <Star className="h-3 w-3 mr-1" />
              4+ estrelas
            </Button>
            
            <Button
              variant={planTiers.includes('gold') ? "default" : "outline"}
              size="sm"
              onClick={() => handlePlanTierToggle('gold')}
              className="text-xs"
            >
              <Award className="h-3 w-3 mr-1" />
              Plano Gold
            </Button>
          </div>
        </div>

        <Separator />

        {/* Filtros avançados */}
        <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <span className="flex items-center gap-2 text-sm font-medium">
                <SlidersHorizontal className="h-4 w-4" />
                Filtros Avançados
              </span>
              <span className="text-xs text-muted-foreground">
                {isAdvancedOpen ? 'Ocultar' : 'Mostrar'}
              </span>
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-6 mt-4">
            {/* Especialidades */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Especialidades
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {specialties.map((specialty) => (
                  <div key={specialty} className="flex items-center space-x-2">
                    <Checkbox
                      id={`specialty-${specialty}`}
                      checked={selectedSpecialties.includes(specialty)}
                      onCheckedChange={() => handleSpecialtyToggle(specialty)}
                    />
                    <Label 
                      htmlFor={`specialty-${specialty}`} 
                      className="text-sm cursor-pointer"
                    >
                      {specialty}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedSpecialties.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedSpecialties.map((specialty) => (
                    <Badge 
                      key={specialty} 
                      variant="secondary" 
                      className="text-xs cursor-pointer"
                      onClick={() => handleSpecialtyToggle(specialty)}
                    >
                      {specialty}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Regiões */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Regiões
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {regions.map((region) => (
                  <div key={region} className="flex items-center space-x-2">
                    <Checkbox
                      id={`region-${region}`}
                      checked={selectedRegions.includes(region)}
                      onCheckedChange={() => handleRegionToggle(region)}
                    />
                    <Label 
                      htmlFor={`region-${region}`} 
                      className="text-sm cursor-pointer"
                    >
                      {region}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedRegions.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {selectedRegions.map((region) => (
                    <Badge 
                      key={region} 
                      variant="secondary" 
                      className="text-xs cursor-pointer"
                      onClick={() => handleRegionToggle(region)}
                    >
                      {region}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Avaliação mínima */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Avaliação mínima
              </Label>
              <Select value={minRating.toString()} onValueChange={(value) => setMinRating(Number(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a avaliação mínima" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Qualquer avaliação</SelectItem>
                  <SelectItem value="3">3+ estrelas</SelectItem>
                  <SelectItem value="4">4+ estrelas</SelectItem>
                  <SelectItem value="5">5 estrelas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tipos de plano */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Tipos de Plano
              </Label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'gold', label: 'Gold', color: 'bg-yellow-100 text-yellow-800' },
                  { value: 'silver', label: 'Silver', color: 'bg-gray-100 text-gray-800' },
                  { value: 'basic', label: 'Básico', color: 'bg-blue-100 text-blue-800' }
                ].map((plan) => (
                  <div key={plan.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`plan-${plan.value}`}
                      checked={planTiers.includes(plan.value)}
                      onCheckedChange={() => handlePlanTierToggle(plan.value)}
                    />
                    <Label 
                      htmlFor={`plan-${plan.value}`} 
                      className="text-sm cursor-pointer"
                    >
                      <Badge className={plan.color}>
                        {plan.label}
                      </Badge>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}