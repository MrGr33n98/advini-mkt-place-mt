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
import { List, Map as MapIcon, LogIn, Search, Filter, Users, Star, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { LawyerFilters } from '@/components/LawyerFilters';
import { LawyerListCardSkeleton } from '@/components/LawyerListCardSkeleton';
import Link from 'next/link';
import { NavigationMenu } from './navigation-menu';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const INITIAL_CENTER: [number, number] = [-15.5989, -56.0949];
const INITIAL_ZOOM = 13;

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
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
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-10 flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/login">
              <LogIn className="mr-2 h-4 w-4" />
              Área do Advogado
            </Link>
          </Button>
          <ThemeToggle />
        </div>
        
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

        <Tabs defaultValue="map" className="mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="map">
              <MapIcon className="mr-2 h-4 w-4" />
              Mapa Interativo
            </TabsTrigger>
            <TabsTrigger value="search">
              <Search className="mr-2 h-4 w-4" />
              Busca Avançada
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="map" className="mt-6">
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
          </TabsContent>
          
          <TabsContent value="search" className="mt-6">
            <div className="max-w-3xl mx-auto">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Busca Avançada</h3>
                      <p className="text-muted-foreground mb-4">
                        Utilize os filtros abaixo para encontrar o advogado ideal para seu caso.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Nome do Advogado</label>
                        <div className="relative">
                          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <input 
                            className="pl-9 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            placeholder="Buscar por nome..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Especialidade</label>
                        <select 
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          value={selectedSpecialty}
                          onChange={(e) => handleSpecialtyChange(e.target.value)}
                        >
                          {specialties.map(spec => (
                            <option key={spec} value={spec}>
                              {spec === 'all' ? 'Todas as Especialidades' : spec}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Avaliação Mínima</label>
                        <select 
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <option value="0">Qualquer avaliação</option>
                          <option value="3">3 estrelas ou mais</option>
                          <option value="4">4 estrelas ou mais</option>
                          <option value="5">5 estrelas</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Ordenar por</label>
                        <select 
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          <option value="relevance">Relevância</option>
                          <option value="rating">Melhor avaliação</option>
                          <option value="name">Nome (A-Z)</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={handleClearFilters}>
                        <Filter className="mr-2 h-4 w-4" />
                        Limpar Filtros
                      </Button>
                      <Button>
                        <Search className="mr-2 h-4 w-4" />
                        Buscar Advogados
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Resultados da Busca ({filteredLawyers.length})</h3>
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
                    <p className="text-muted-foreground text-center py-8">Nenhum advogado encontrado com os filtros aplicados.</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <MadeWithDyad />
    </div>
  );
}