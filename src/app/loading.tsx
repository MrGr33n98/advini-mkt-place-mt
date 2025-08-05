import { Loader2 } from "lucide-react";
import { NavigationMenu } from "./navigation-menu";
import { MadeWithDyad } from "@/components/made-with-dyad";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu />
      
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <Loader2 className="h-16 w-16 text-primary animate-spin mb-8" />
        <h1 className="text-2xl font-bold mb-2">Carregando...</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Estamos preparando tudo para você. Isso pode levar alguns segundos.
        </p>
      </div>
      
      <MadeWithDyad />
    </div>
  );
}