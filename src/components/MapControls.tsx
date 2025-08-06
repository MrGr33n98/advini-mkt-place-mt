'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Navigation, 
  Filter, 
  X, 
  MapPin, 
  Star,
  DollarSign,
  Users
} from 'lucide-react';
import { Lawyer } from '@/types/lawyer';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface MapControlsProps {
  lawyers: Lawyer[];
  filteredLawyers: Lawyer[];
  selectedSpecialty: string;
  selectedRating: number;
  selectedPriceRange: [number, number];
  onSpecialtyChange: (specialty: string) => void;
  onRatingChange: (rating: number) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onClearFilters: () => void;
  areFiltersActive: boolean;
  onLocationRequest: () => void;
  isLocationLoading: boolean;
}

export function MapControls({
  lawyers,
  filteredLawyers,
  selectedSpecialty,
  selectedRating,
  selectedPriceRange,
  onSpecialtyChange,
  onRatingChange,
  onPriceRangeChange,
  onClearFilters,
  areFiltersActive,
  onLocationRequest,
  isLocationLoading
}: MapControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const specialties = Array.from(
    new Set(lawyers.flatMap(lawyer => lawyer.specialties))
  ).sort();

  const priceRanges = [
    { label: 'Até R$ 200', value: [0, 200] as [number, number] },
    { label: 'R$ 200 - R$ 500', value: [200, 500] as [number, number] },
    { label: 'R$ 500 - R$ 1000', value: [500, 1000] as [number, number] },
    { label: 'Acima de R$ 1000', value: [1000, 10000] as [number, number] },
  ];

  return (
    <div className="absolute top-4 left-4 z-[1000] max-w-sm">
      <Card className="shadow-lg border-0 bg-background/95 backdrop-blur-sm">
        <CardContent className="p-4">
          {/* Header with stats and controls */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {filteredLawyers.length} de {lawyers.length} advogados
              </span>
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={onLocationRequest}
                disabled={isLocationLoading}
                className="h-8 w-8 p-0"
              >
                <Navigation className={cn(
                  "h-3 w-3",
                  isLocationLoading && "animate-spin"
                )} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-8 w-8 p-0"
              >
                <Filter className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Active filters summary */}
          {areFiltersActive && (
            <div className="flex flex-wrap gap-1 mb-3">
              {selectedSpecialty && (
                <Badge variant="secondary" className="text-xs">
                  {selectedSpecialty}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => onSpecialtyChange('')}
                  />
                </Badge>
              )}
              {selectedRating > 0 && (
                <Badge variant="secondary" className="text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  {selectedRating}+
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => onRatingChange(0)}
                  />
                </Badge>
              )}
              {(selectedPriceRange[0] > 0 || selectedPriceRange[1] < 10000) && (
                <Badge variant="secondary" className="text-xs">
                  <DollarSign className="h-3 w-3 mr-1" />
                  R$ {selectedPriceRange[0]}-{selectedPriceRange[1]}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => onPriceRangeChange([0, 10000])}
                  />
                </Badge>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={onClearFilters}
                className="h-6 px-2 text-xs"
              >
                Limpar todos
              </Button>
            </div>
          )}

          {/* Expanded filters */}
          {isExpanded && (
            <div className="space-y-3 border-t pt-3">
              {/* Specialties */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">
                  Especialidade
                </label>
                <div className="flex flex-wrap gap-1">
                  {specialties.slice(0, 6).map((specialty) => (
                    <Button
                      key={specialty}
                      size="sm"
                      variant={selectedSpecialty === specialty ? "default" : "outline"}
                      onClick={() => onSpecialtyChange(
                        selectedSpecialty === specialty ? '' : specialty
                      )}
                      className="h-7 text-xs"
                    >
                      {specialty}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">
                  Avaliação mínima
                </label>
                <div className="flex gap-1">
                  {[3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      size="sm"
                      variant={selectedRating === rating ? "default" : "outline"}
                      onClick={() => onRatingChange(
                        selectedRating === rating ? 0 : rating
                      )}
                      className="h-7 text-xs"
                    >
                      <Star className="h-3 w-3 mr-1" />
                      {rating}+
                    </Button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-2 block">
                  Faixa de preço
                </label>
                <div className="space-y-1">
                  {priceRanges.map((range) => (
                    <Button
                      key={range.label}
                      size="sm"
                      variant={
                        selectedPriceRange[0] === range.value[0] && 
                        selectedPriceRange[1] === range.value[1] 
                          ? "default" 
                          : "outline"
                      }
                      onClick={() => onPriceRangeChange(range.value)}
                      className="h-7 text-xs w-full justify-start"
                    >
                      <DollarSign className="h-3 w-3 mr-1" />
                      {range.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}