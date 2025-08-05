'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface LawyerFiltersProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedSpecialty: string;
  onSpecialtyChange: (value: string) => void;
  specialties: string[];
  onClearFilters: () => void;
  areFiltersActive: boolean;
}

export function LawyerFilters({
  searchQuery,
  onSearchChange,
  selectedSpecialty,
  onSpecialtyChange,
  specialties,
  onClearFilters,
  areFiltersActive,
}: LawyerFiltersProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Filtros</h2>
        {areFiltersActive && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="mr-2 h-4 w-4" />
            Limpar
          </Button>
        )}
      </div>
      <Input 
        placeholder="Buscar por nome..."
        value={searchQuery}
        onChange={onSearchChange}
      />
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
  );
}