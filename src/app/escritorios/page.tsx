'use client';

import { useState, useMemo } from "react";
import { offices } from "@/data/offices";
import { NavigationMenu } from "@/app/navigation-menu";
import EnhancedOfficeFilters from "@/components/EnhancedOfficeFilters";
import EnhancedOfficeListCard from "@/components/EnhancedOfficeListCard";
import Pagination from "@/components/Pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Star, Users, Filter } from "lucide-react";

export default function OfficesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("relevance");
  const [planTiers, setPlanTiers] = useState<string[]>([]);
  const [onlySponsored, setOnlySponsored] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredOffices = useMemo(() => {
    let filtered = offices.filter((office) => {
      const matchesSearch = office.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        office.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSpecialties = selectedSpecialties.length === 0 || 
        selectedSpecialties.some(specialty => office.specialties.includes(specialty));
      
      const matchesRegions = selectedRegions.length === 0 || 
        selectedRegions.some(region => office.address.includes(region));
      
      const matchesRating = office.rating >= minRating;
      
      const matchesPlanTiers = planTiers.length === 0 || 
        planTiers.includes(office.plan_tier);
      
      const matchesSponsored = !onlySponsored || office.is_sponsored;

      return matchesSearch && matchesSpecialties && matchesRegions && 
             matchesRating && matchesPlanTiers && matchesSponsored;
    });

    // Sorting
    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "lawyers_count":
        filtered.sort((a, b) => (b.lawyers?.length || 0) - (a.lawyers?.length || 0));
        break;
      case "plan_tier":
        const tierOrder = { 'gold': 3, 'silver': 2, 'basic': 1 };
        filtered.sort((a, b) => (tierOrder[b.plan_tier as keyof typeof tierOrder] || 0) - 
                                (tierOrder[a.plan_tier as keyof typeof tierOrder] || 0));
        break;
      default:
        // Relevance: sponsored first, then by rating
        filtered.sort((a, b) => {
          if (a.is_sponsored && !b.is_sponsored) return -1;
          if (!a.is_sponsored && b.is_sponsored) return 1;
          return b.rating - a.rating;
        });
        break;
    }

    return filtered;
  }, [searchTerm, selectedSpecialties, selectedRegions, minRating, sortBy, planTiers, onlySponsored]);

  const totalPages = Math.ceil(filteredOffices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOffices = filteredOffices.slice(startIndex, startIndex + itemsPerPage);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedSpecialties([]);
    setSelectedRegions([]);
    setMinRating(0);
    setPlanTiers([]);
    setOnlySponsored(false);
    setSortBy("relevance");
    setCurrentPage(1);
  };

  // Estatísticas dos escritórios
  const stats = {
    total: offices.length,
    sponsored: offices.filter(o => o.is_sponsored).length,
    goldPlan: offices.filter(o => o.plan_tier === 'gold').length,
    highRated: offices.filter(o => o.rating >= 4.5).length
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Escritórios de Advocacia
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Encontre os melhores escritórios de advocacia em Cuiabá e região. 
              Conecte-se com profissionais especializados para suas necessidades jurídicas.
            </p>
            
            {/* Estatísticas rápidas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <Building2 className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Escritórios</div>
              </Card>
              <Card className="p-4 text-center">
                <Star className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                <div className="text-2xl font-bold">{stats.sponsored}</div>
                <div className="text-sm text-muted-foreground">Patrocinados</div>
              </Card>
              <Card className="p-4 text-center">
                <Badge className="h-6 w-6 mx-auto mb-2 bg-yellow-100 text-yellow-800" />
                <div className="text-2xl font-bold">{stats.goldPlan}</div>
                <div className="text-sm text-muted-foreground">Plano Gold</div>
              </Card>
              <Card className="p-4 text-center">
                <Star className="h-6 w-6 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold">{stats.highRated}</div>
                <div className="text-sm text-muted-foreground">4.5+ estrelas</div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filtros */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <EnhancedOfficeFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedSpecialties={selectedSpecialties}
                setSelectedSpecialties={setSelectedSpecialties}
                selectedRegions={selectedRegions}
                setSelectedRegions={setSelectedRegions}
                minRating={minRating}
                setMinRating={setMinRating}
                sortBy={sortBy}
                setSortBy={setSortBy}
                planTiers={planTiers}
                setPlanTiers={setPlanTiers}
                onlySponsored={onlySponsored}
                setOnlySponsored={setOnlySponsored}
                onClearFilters={handleClearFilters}
              />
            </div>
          </div>

          {/* Lista de escritórios */}
          <div className="lg:col-span-3">
            {paginatedOffices.length > 0 ? (
              <>
                {/* Header dos resultados */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold mb-1">
                      {filteredOffices.length} escritório{filteredOffices.length !== 1 ? 's' : ''} encontrado{filteredOffices.length !== 1 ? 's' : ''}
                    </h2>
                    <p className="text-muted-foreground">
                      Mostrando {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredOffices.length)} de {filteredOffices.length} resultados
                    </p>
                  </div>
                  
                  {/* Filtros ativos */}
                  {(selectedSpecialties.length > 0 || selectedRegions.length > 0 || 
                    minRating > 0 || planTiers.length > 0 || onlySponsored) && (
                    <Card className="p-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Filter className="h-4 w-4" />
                        <span className="font-medium">Filtros ativos:</span>
                        <div className="flex flex-wrap gap-1">
                          {selectedSpecialties.slice(0, 2).map(spec => (
                            <Badge key={spec} variant="secondary" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                          {selectedSpecialties.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{selectedSpecialties.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Card>
                  )}
                </div>

                {/* Grid de escritórios */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                  {paginatedOffices.map((office) => (
                    <EnhancedOfficeListCard key={office.id} office={office} />
                  ))}
                </div>

                {/* Paginação */}
                {totalPages > 1 && (
                  <div className="flex justify-center">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <Card className="p-12 text-center">
                <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-2xl font-semibold mb-2">Nenhum escritório encontrado</h3>
                <p className="text-muted-foreground mb-6">
                  Não encontramos escritórios que correspondam aos seus critérios de busca.
                  Tente ajustar os filtros para encontrar mais resultados.
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Verifique a ortografia dos termos de busca</p>
                  <p>• Tente usar termos mais gerais</p>
                  <p>• Remova alguns filtros para ampliar a busca</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}