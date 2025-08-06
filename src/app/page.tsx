'use client';

import { useState, useMemo, useEffect } from 'react';
import { MadeWithDyad } from "@/components/made-with-dyad";
import LawyerMap from "@/components/LawyerMap";
import { lawyers as allLawyers } from "@/data/lawyers";
import LawyerListCard from '@/components/LawyerListCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Lawyer } from '@/types/lawyer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { List, Map as MapIcon, Users, Star, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LawyerFilters } from '@/components/LawyerFilters';
import { LawyerListCardSkeleton } from '@/components/LawyerListCardSkeleton';

import { NavigationMenu } from './navigation-menu';
import { Card, CardContent } from '@/components/ui/card';

const INITIAL_CENTER: [number, number] = [-15.5989, -56.0949];
const INITIAL_ZOOM = 13;

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedSortBy, setSelectedSortBy] = useState<string>('relevance');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [mapView, setMapView] = useState({ center: INITIAL_CENTER, zoom: INITIAL_ZOOM });
  const [selectedLawyerId, setSelectedLawyerId] = useState<string | null>(null);
  
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
  const isMobile = useIsMobile();

  useEffect(() => {
    // Simulate data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const specialties = useMemo(() => {
    const allSpecialties = allLawyers.flatMap(l => l.specialties);
    return ['all', ...Array.from(new Set(allSpecialties))];
  }, []);

  const filteredLawyers = useMemo(() => {
    let lawyers = allLawyers;

    // Filtro por especialidade
    if (selectedSpecialty !== 'all') {
      lawyers = lawyers.filter(lawyer => 
        lawyer.specialties.includes(selectedSpecialty)
      );
    }

    // Filtro por busca de texto
    if (searchQuery.trim() !== '') {
      lawyers = lawyers.filter(lawyer =>
        lawyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lawyer.specialties.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase())) ||
        lawyer.bio?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtro por avaliação
    if (selectedRating !== 'all') {
      const minRating = parseFloat(selectedRating);
      lawyers = lawyers.filter(lawyer => 
        (lawyer.average_rating || 0) >= minRating
      );
    }

    // Filtro por faixa de preço
    if (selectedPriceRange !== 'all') {
      switch (selectedPriceRange) {
        case '0-200':
          lawyers = lawyers.filter(lawyer => lawyer.consultation_fee <= 200);
          break;
        case '200-500':
          lawyers = lawyers.filter(lawyer => lawyer.consultation_fee > 200 && lawyer.consultation_fee <= 500);
          break;
        case '500-1000':
          lawyers = lawyers.filter(lawyer => lawyer.consultation_fee > 500 && lawyer.consultation_fee <= 1000);
          break;
        case '1000-2000':
          lawyers = lawyers.filter(lawyer => lawyer.consultation_fee > 1000 && lawyer.consultation_fee <= 2000);
          break;
        case '2000+':
          lawyers = lawyers.filter(lawyer => lawyer.consultation_fee > 2000);
          break;
      }
    }

    // Ordenação
    switch (selectedSortBy) {
      case 'rating':
        lawyers.sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0));
        break;
      case 'name':
        lawyers.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'reviews':
        lawyers.sort((a, b) => (b.total_reviews || 0) - (a.total_reviews || 0));
        break;
      case 'price':
        lawyers.sort((a, b) => a.consultation_fee - b.consultation_fee);
        break;
      default: // relevance
        // Manter ordem original ou implementar lógica de relevância
        break;
    }

    return lawyers;
  }, [selectedSpecialty, searchQuery, selectedRating, selectedSortBy, selectedPriceRange]);

  const handleSpecialtyChange = (value: string) => {
    setSelectedSpecialty(value);
    setMapView({ center: INITIAL_CENTER, zoom: INITIAL_ZOOM });
    setSelectedLawyerId(null);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSelectedLawyerId(null);
  }

  const handleLawyerSelect = (lawyer: Lawyer) => {
    setMapView({ center: [lawyer.latitude, lawyer.longitude], zoom: 16 });
    setSelectedLawyerId(lawyer.id);
    if (isMobile) {
      setMobileView('map');
    }
  };

  const handleRatingChange = (value: string) => {
    setSelectedRating(value);
    setSelectedLawyerId(null);
  };

  const handleSortByChange = (value: string) => {
    setSelectedSortBy(value);
    setSelectedLawyerId(null);
  };

  const handleLocationChange = (value: string) => {
    setSelectedLocation(value);
    setSelectedLawyerId(null);
  };

  const handlePriceRangeChange = (value: string) => {
    setSelectedPriceRange(value);
    setSelectedLawyerId(null);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedSpecialty('all');
    setSelectedRating('all');
    setSelectedSortBy('relevance');
    setSelectedLocation('all');
    setSelectedPriceRange('all');
    setMapView({ center: INITIAL_CENTER, zoom: INITIAL_ZOOM });
    setSelectedLawyerId(null);
  };

  const areFiltersActive = searchQuery.trim() !== '' || selectedSpecialty !== 'all' || selectedRating !== 'all' || selectedSortBy !== 'relevance' || selectedLocation !== 'all' || selectedPriceRange !== 'all';

  // Advogados em destaque (com maior avaliação)
  const featuredLawyers = useMemo(() => {
    return [...allLawyers]
      .sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0))
      .slice(0, 3);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu />
      
      <div className="container mx-auto p-4 sm:p-8 relative">
        
        <header className="text-center mb-8 pt-16">
          <h1 className="text-4xl font-bold tracking-tight">
            Encontre um Advogado em Cuiabá-MT
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Conectamos você aos melhores profissionais da área jurídica. 
            Busque por especialidade, localização ou avaliações para encontrar o advogado ideal para seu caso.
          </p>
        </header>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{allLawyers.length}+</p>
                <p className="text-muted-foreground">Advogados Cadastrados</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">4.8</p>
                <p className="text-muted-foreground">Avaliação Média</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">10+</p>
                <p className="text-muted-foreground">Especialidades</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advogados em destaque (apenas em telas maiores) */}
        {!isMobile && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Advogados em Destaque</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredLawyers.map(lawyer => (
                <LawyerListCard 
                  key={lawyer.id} 
                  lawyer={lawyer}
                  onSelect={handleLawyerSelect}
                  isSelected={lawyer.id === selectedLawyerId}
                />
              ))}
            </div>
          </div>
        )}

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className={cn(
            "lg:col-span-1 flex flex-col gap-4",
            isMobile && mobileView !== 'list' && "hidden"
          )}>
            <LawyerFilters
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              selectedSpecialty={selectedSpecialty}
              onSpecialtyChange={handleSpecialtyChange}
              specialties={specialties}
              onClearFilters={handleClearFilters}
              areFiltersActive={areFiltersActive}
              selectedRating={selectedRating}
              onRatingChange={handleRatingChange}
              selectedSortBy={selectedSortBy}
              onSortByChange={handleSortByChange}
              selectedLocation={selectedLocation}
              onLocationChange={handleLocationChange}
              selectedPriceRange={selectedPriceRange}
              onPriceRangeChange={handlePriceRangeChange}
            />
            
            <h2 className="text-xl font-semibold mt-4">Resultados ({isLoading ? '...' : filteredLawyers.length})</h2>
            <ScrollArea className={cn(
              "pr-4",
              isMobile ? "h-[calc(100vh-340px)]" : "h-[calc(750px-180px)]"
            )}>
              <div className="space-y-4">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => <LawyerListCardSkeleton key={index} />)
                ) : filteredLawyers.length > 0 ? (
                  filteredLawyers.map(lawyer => (
                    <LawyerListCard 
                      key={lawyer.id} 
                      lawyer={lawyer}
                      onSelect={handleLawyerSelect}
                      isSelected={lawyer.id === selectedLawyerId}
                    />
                  ))
                ) : (
                  <p className="text-muted-foreground text-center pt-8">Nenhum advogado encontrado com os filtros aplicados.</p>
                )}
              </div>
            </ScrollArea>
          </div>

          <div className={cn(
            "lg:col-span-2 h-[500px] lg:h-[750px]",
            isMobile && mobileView !== 'map' && "hidden",
            isMobile && mobileView === 'map' && "h-[calc(100vh-220px)]"
          )}>
            <LawyerMap 
              lawyers={filteredLawyers} 
              center={mapView.center}
              zoom={mapView.zoom}
              selectedLawyerId={selectedLawyerId}
            />
          </div>

          {isMobile && (
            <div className="fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-full border bg-background p-1.5 shadow-lg">
              <Button
                variant={mobileView === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                className="rounded-full px-4 py-2"
                onClick={() => setMobileView('list')}
              >
                <List className="mr-2 h-4 w-4" />
                Lista
              </Button>
              <Button
                variant={mobileView === 'map' ? 'secondary' : 'ghost'}
                size="sm"
                className="rounded-full px-4 py-2"
                onClick={() => setMobileView('map')}
              >
                <MapIcon className="mr-2 h-4 w-4" />
                Mapa
              </Button>
            </div>
          )}
        </main>
      </div>
      <MadeWithDyad />
    </div>
  );
}