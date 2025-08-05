'use client';

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NavigationMenu } from "./navigation-menu";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Home, RefreshCw, HelpCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu />
      
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary">500</div>
          <h1 className="text-4xl font-bold mt-4 mb-2">Algo deu errado</h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            Desculpe, ocorreu um erro inesperado. Nossa equipe já foi notificada.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Button onClick={() => reset()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar Novamente
          </Button>
          <Button asChild variant="outline">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Voltar para o Início
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
          <h2 className="text-xl font-semibold mb-4">Você pode tentar:</h2>
          <ul className="space-y-2 text-left">
            <li className="flex items-start gap-2">
              <RefreshCw className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">Atualizar a página e tentar novamente</span>
            </li>
            <li className="flex items-start gap-2">
              <Home className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">Voltar para a página inicial e tentar acessar novamente</span>
            </li>
            <li className="flex items-start gap-2">
              <HelpCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-muted-foreground">Entrar em contato com nosso suporte se o problema persistir</span>
            </li>
          </ul>
        </div>
      </div>
      
      <MadeWithDyad />
    </div>
  );
}