import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NavigationMenu } from "./navigation-menu";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Home, Search, HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu />
      
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary">404</div>
          <h1 className="text-4xl font-bold mt-4 mb-2">Página não encontrada</h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            Ops! Parece que você está tentando acessar uma página que não existe.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Voltar para o Início
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              <Search className="mr-2 h-4 w-4" />
              Buscar Advogados
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contato">
              <HelpCircle className="mr-2 h-4 w-4" />
              Contato
            </Link>
          </Button>
        </div>
        
        <div className="max-w-lg">
          <h2 className="text-xl font-semibold mb-4">Você pode estar procurando por:</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="text-primary hover:underline">
                Página inicial
              </Link>
              <span className="text-muted-foreground"> - Encontre advogados em Cuiabá</span>
            </li>
            <li>
              <Link href="/sobre" className="text-primary hover:underline">
                Sobre nós
              </Link>
              <span className="text-muted-foreground"> - Conheça nossa plataforma</span>
            </li>
            <li>
              <Link href="/planos" className="text-primary hover:underline">
                Planos
              </Link>
              <span className="text-muted-foreground"> - Opções para advogados</span>
            </li>
            <li>
              <Link href="/blog" className="text-primary hover:underline">
                Blog
              </Link>
              <span className="text-muted-foreground"> - Artigos jurídicos</span>
            </li>
            <li>
              <Link href="/contato" className="text-primary hover:underline">
                Contato
              </Link>
              <span className="text-muted-foreground"> - Fale conosco</span>
            </li>
          </ul>
        </div>
      </div>
      
      <MadeWithDyad />
    </div>
  );
}