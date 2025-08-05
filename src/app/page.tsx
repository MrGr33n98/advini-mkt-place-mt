import { MadeWithDyad } from "@/components/made-with-dyad";
import LawyerMap from "@/components/LawyerMap";
import { Lawyer } from "@/types/lawyer";

const mockLawyers: Lawyer[] = [
  {
    id: "1",
    name: "Dr. João da Silva",
    specialties: ["Direito Civil", "Direito de Família"],
    latitude: -15.59,
    longitude: -56.09,
    slug: "joao-da-silva",
  },
  {
    id: "2",
    name: "Dra. Maria Oliveira",
    specialties: ["Direito Penal", "Direito Trabalhista"],
    latitude: -15.61,
    longitude: -56.1,
    slug: "maria-oliveira",
  },
  {
    id: "3",
    name: "Dr. Carlos Pereira",
    specialties: ["Direito Tributário"],
    latitude: -15.585,
    longitude: -56.08,
    slug: "carlos-pereira",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-[family-name:var(--font-geist-sans)]">
      <div className="container mx-auto p-4 sm:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            Encontre um Advogado em Cuiabá-MT
          </h1>
          <p className="text-muted-foreground mt-2">
            Navegue pelo mapa para encontrar especialistas perto de você.
          </p>
        </header>

        <main className="flex flex-col gap-8 items-center">
          <div className="w-full max-w-5xl">
            <LawyerMap lawyers={mockLawyers} />
          </div>
        </main>
      </div>
      <MadeWithDyad />
    </div>
  );
}