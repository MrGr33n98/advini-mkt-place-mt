'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Building2, Search, SlidersHorizontal, MapPin, Star, Clock } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from './ui/badge';

const specialties = [
  'Direito Civil',
  'Direito Trabalhista',
  'Direito Empresarial',
  'Direito Tributário',
  'Direito Penal',
  'Direito Imobiliário',
  'Direito do Consumidor',
  'Direito Ambiental',
  'Direito Previdenciário',
  'Direito Administrativo',
  'Direito Digital',
  'Direito Internacional',
];

const regions = [
  'Centro',
  'Centro Norte',
  'Centro Sul',
  'Zona Leste',
  'Zona Oeste',
  'Zona Norte',
  'Zona Sul',
];

const sortOptions = [
  { value: 'rating', label: 'Melhor Avaliação' },
  { value: 'reviews', label: 'Mais Avaliações' },
  { value: 'newest', label: 'Mais Recentes' },
  { value: 'oldest', label: 'Mais Antigos' },
];

interface OfficeFiltersProps {
  selectedSpecialties: string[];
  selectedRegions: string[];
  minRating: number;
  sortBy: string;
  onSpecialtyToggle: (specialty: string) => void;
  onRegionToggle: (region: string) => void;
  onRatingChange: (rating: number) => void;
  onSortChange: (sort: string) => void;
  onSearch: (term: string) => void;
}

export function OfficeFilters({
  selectedSpecialties,
  selectedRegions,
  minRating,
  sortBy,
  onSpecialtyToggle,
  onRegionToggle,
  onRatingChange,
  onSortChange,
  onSearch,
}: OfficeFiltersProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar escritórios..."
          className="pl-9"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="lg:w-auto justify-start gap-2 h-8 border-dashed">
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
              {(selectedSpecialties.length > 0 || selectedRegions.length > 0) && (
                <Badge variant="secondary" className="ml-auto">
                  {selectedSpecialties.length + selectedRegions.length}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filtrar Escritórios</SheetTitle>
            </SheetHeader>

            <div className="mt-8 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Building2 className="h-4 w-4" />
                  <Label>Áreas de Atuação</Label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {specialties.map((specialty) => (
                    <Badge
                      key={specialty}
                      variant={selectedSpecialties.includes(specialty) ? 'default' : 'outline'}
                      className="cursor-pointer rounded-sm px-1 font-normal"
                      onClick={() => onSpecialtyToggle(specialty)}
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-4 w-4" />
                  <Label>Região</Label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {regions.map((region) => (
                    <Badge
                      key={region}
                      variant={selectedRegions.includes(region) ? 'default' : 'outline'}
                      className="cursor-pointer rounded-sm px-1 font-normal"
                      onClick={() => onRegionToggle(region)}
                    >
                      {region}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-4 w-4" />
                  <Label>Avaliação Mínima</Label>
                </div>
                <div className="px-2">
                  <Slider
                    defaultValue={[minRating]}
                    max={5}
                    step={0.5}
                    onValueChange={(value) => onRatingChange(value[0])}
                  />
                  <div className="mt-2 text-center text-sm text-muted-foreground">
                    {minRating} estrelas ou mais
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}