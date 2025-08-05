'use client';

import { useState, useMemo } from 'react';
import { MadeWithDyad } from "@/components/made-with-dyad";
import LawyerMap from "@/components/LawyerMap";
import { lawyers as allLawyers } from "@/data/lawyers";
import LawyerListCard from '@/components/LawyerListCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Lawyer } from '@/types/lawyer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { List, Map as MapIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { LawyerFilters } from '@/components/LawyerFilters';

const INITIAL_CENTER: [number, number] = [-15.5989, -56.0949];
const INITIAL_ZOOM = 13;

export default function Home() {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mapView, setMapView] = useState({ center: INITIAL_CENTER, zoom: INITIAL_ZOOM });
  const [selectedLawyerId, setSelectedLawyerId] = useState<string | null>(null);
  
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
  const isMobile = useIsMobile();

  const specialties = useMemo(() => {
    const allSpecialties = allLawyers.flatMap(l => l.specialties);
    return ['all', ...Array.from(new Set(allSpecialties))];
  }, []);

  const filteredLawyers = useMemo(() => {
    let lawyers = allLawyers;

    if (selectedSpecialty !== 'all') {
      lawyers = lawyers.filter(lawyer => 
        lawyer.specialties.includes(selectedSpecialty)
      );
    }

    if (searchQuery.trim() !== '') {
      lawyers = lawyers.filter(lawyer =>
        lawyer.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return lawyers;
  }, [selectedSpecialty, searchQuery]);

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

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedSpecialty('all');
    setMapView({ center: INITIAL_CENTER, zoom: INITIAL_ZOOM });
    setSelectedLawyerId(null);
  };

  const areFiltersActive = searchQuery.trim() !== '' || selectedSpecialty !== 'all';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 sm:p-8 relative">
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-10">
          <ThemeToggle />
        </div>
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            Encontre um Advogado em Cuiabá-MT
          </h1>
          <p className="text-muted-foreground mt-2">
            Selecione um advogado na lista para vê-lo no mapa.
          </p>
        </header>

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
            />
            
            <h2 className="text-xl font-semibold mt-4">Resultados ({filteredLawyers.length})</h2>
            <ScrollArea className={cn(
              "pr-4",
              isMobile ? "h-[calc(100vh-340px)]" : "h-[calc(750px-180px)]"
            )}>
              <div className="space-y-4">
                {filteredLawyers.length > 0 ? (
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