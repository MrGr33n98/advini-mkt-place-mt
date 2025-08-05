import { MadeWithDyad } from "@/components/made-with-dyad";
import LawyerMap from "@/components/LawyerMap";
import { lawyers } from "@/data/lawyers";

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
          p>
        </header>

        <main className="flex flex-col gap-8 items-center">
          <div className="w-full max-w-5xl">
            <LawyerMap lawyers={lawyers} />
          </div>
        </main>
      </div>
      <MadeWithDyad />
    </div>
  );
}