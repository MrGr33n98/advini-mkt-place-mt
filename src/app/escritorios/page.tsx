'use client';

import { useState, useMemo } from 'react';
import { NavigationMenu } from '../navigation-menu';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { offices as allOffices } from '@/data/offices';
import { OfficeFilters } from '@/components/OfficeFilters';
import { OfficeListCard } from '@/components/OfficeListCard';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Search } from 'lucide-react';

export default function OfficesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('rating');

  const filteredOffices = useMemo(() => {
    return allOffices
      .filter(office => {
        const matchesSearch = office.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpecialty = selectedSpecialties.length === 0 || selectedSpecialties.some(s => office.specialties.includes(s));
        const matchesRating = (office.rating || 0) >= minRating;
        // Adicionar lógica de região quando disponível no tipo
        return matchesSearch && matchesSpecialty && matchesRating;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') {
          return (b.rating || 0) - (a.rating || 0);
        }
        // Adicionar mais lógicas de ordenação
        return 0;
      });
  }, [searchTerm, selectedSpecialties, minRating, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu />
      
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight">
            Encontre um Escritório de Advocacia
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Navegue pelos melhores escritórios de advocacia em Cuiabá, especializados em diversas áreas do direito.
          </p>
        </header>

        <Card className="mb-8">
          <CardContent className="p-6">
            <OfficeFilters
              selectedSpecialties={selectedSpecialties}
              selectedRegions={selectedRegions}
              minRating={minRating}
              sortBy={sortBy}
              onSpecialtyToggle={(s) => setSelectedSpecialties(prev => prev.includes(s) ? prev.filter(i => i !== s) : [...prev, s])}
              onRegionToggle={(r) => setSelectedRegions(prev => prev.includes(r) ? prev.filter(i => i !== r) : [...prev, r])}
              onRatingChange={setMinRating}
              onSortChange={setSortBy}
              onSearch={setSearchTerm}
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffices.map(office => (
            <OfficeListCard key={office.id} office={office} />
          ))}
        </div>

        {filteredOffices.length === 0 && (
          <div className="text-center py-16">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">Nenhum escritório encontrado</h3>
            <p className="text-muted-foreground">Tente ajustar seus filtros de busca.</p>
          </div>
        )}

        <div className="mt-12">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
      
      <MadeWithDyad />
    </div>
  );
}