import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Star, Filter, X } from "lucide-react";

export interface ReviewFilters {
  rating?: number;
  caseType?: string;
  sortBy: 'newest' | 'oldest' | 'highest' | 'lowest';
  showOnlyWithResponse?: boolean;
}

interface ReviewFiltersProps {
  filters: ReviewFilters;
  onFiltersChange: (filters: ReviewFilters) => void;
  caseTypes: string[];
  totalReviews: number;
  filteredCount: number;
}

export function ReviewFilters({
  filters,
  onFiltersChange,
  caseTypes,
  totalReviews,
  filteredCount
}: ReviewFiltersProps) {
  const handleRatingFilter = (rating: number) => {
    onFiltersChange({
      ...filters,
      rating: filters.rating === rating ? undefined : rating
    });
  };

  const handleCaseTypeFilter = (caseType: string) => {
    onFiltersChange({
      ...filters,
      caseType: caseType === 'all' ? undefined : caseType
    });
  };

  const handleSortChange = (sortBy: string) => {
    onFiltersChange({
      ...filters,
      sortBy: sortBy as ReviewFilters['sortBy']
    });
  };

  const handleResponseFilter = () => {
    onFiltersChange({
      ...filters,
      showOnlyWithResponse: !filters.showOnlyWithResponse
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      sortBy: 'newest'
    });
  };

  const hasActiveFilters = filters.rating || filters.caseType || filters.showOnlyWithResponse;

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-600" />
          <span className="font-medium text-gray-900">Filtros</span>
          <Badge variant="secondary" className="text-xs">
            {filteredCount} de {totalReviews}
          </Badge>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Filtro por avaliação */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Avaliação</label>
          <div className="flex flex-wrap gap-1">
            {[5, 4, 3, 2, 1].map((rating) => (
              <Button
                key={rating}
                variant={filters.rating === rating ? "default" : "outline"}
                size="sm"
                onClick={() => handleRatingFilter(rating)}
                className="text-xs"
              >
                <Star className="h-3 w-3 mr-1 fill-current" />
                {rating}+
              </Button>
            ))}
          </div>
        </div>

        {/* Filtro por tipo de caso */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Tipo de Caso</label>
          <Select
            value={filters.caseType || 'all'}
            onValueChange={handleCaseTypeFilter}
          >
            <SelectTrigger className="text-xs">
              <SelectValue placeholder="Todos os tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              {caseTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Ordenação */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Ordenar por</label>
          <Select value={filters.sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mais recentes</SelectItem>
              <SelectItem value="oldest">Mais antigas</SelectItem>
              <SelectItem value="highest">Maior avaliação</SelectItem>
              <SelectItem value="lowest">Menor avaliação</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filtro por resposta */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Respostas</label>
          <Button
            variant={filters.showOnlyWithResponse ? "default" : "outline"}
            size="sm"
            onClick={handleResponseFilter}
            className="w-full text-xs"
          >
            Com resposta do advogado
          </Button>
        </div>
      </div>
    </div>
  );
}