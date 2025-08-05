'use client';

import { useState, useMemo } from 'react';
import { MadeWithDyad } from "@/components/made-with-dyad";
import LawyerMap from "@/components/LawyerMap";
import { lawyers as allLawyers } from "@/data/lawyers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LawyerListCard from '@/components/LawyerListCard';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Home() {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  
  const specialties = useMemo(() => {
    const allSpecialties = allLawyers.flatMap(l => l.specialties);
    return ['all', ...Array.from(new Set(allSpecialties))];
  }, []);

  const filteredLawyers = useMemo(() => {
    if (selectedSpecialty === 'all') {
      return allLawyers;
    }
    return allLawyers.filter(lawyer => 
      lawyer.specialties.includes(selectedSpecialty)
    );
  }, [selectedSpecialty]);

  const handleSpecialtyChange = (value: string) => {
    setSelectedSpecialty(value);
  };

  return (
    <div className="min-h-screen bg-background font-[family-name:var(--font-geist-sans)]">
      <div className="container mx-auto p-4 sm:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            Encontre um Advogado em Cuiabá-MT
          </h1>
          <p className="text-muted-foreground mt-2">
            Filtre por especialidade e navegue pelo mapa para encontrar o profissional ideal.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Filtros</h2>
            <Select onValueChange={handleSpecialtyChange} defaultValue="all">
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
            
            <h2 className="text-xl font-semibold mt-4">Resultados ({filteredLawyers.length})</h2>
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-4">
                {filteredLawyers.length > 0 ? (
                  filteredLawyers.map(lawyer => (
                    <LawyerListCard key={lawyer.id} lawyer={lawyer} />
                  ))
                ) : (
                  <p className="text-muted-foreground text-center pt-8">Nenhum advogado encontrado com essa especialidade.</p>
                )}
              </div>
            </ScrollArea>
          </div>

          <div className="lg:col-span-2 h-[500px] lg:h-[750px]">
            <LawyerMap lawyers={filteredLawyers} />
          </div>
        </main>
      </div>
      <MadeWithDyad />
    </div>
  );
}