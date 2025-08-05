import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";
import { NavigationMenu } from "../navigation-menu";
import { MadeWithDyad } from "@/components/made-with-dyad";

const plans = [
  {
    name: "Gratuito",
    price: "R$ 0",
    description: "Para advogados iniciando sua presença online",
    features: [
      "Perfil básico",
      "Listagem no mapa",
      "Recebimento de avaliações",
      "Contato via WhatsApp",
    ],
  },
  {
    name: "Pro",
    price: "R$ 99,90",
    period: "/mês",
    description: "Para advogados que querem mais visibilidade e controle",
    features: [
      "Todas as features do plano Gratuito",
      "URL personalizada do WhatsApp",
      "Banner e logo personalizados",
      "Moderação de avaliações",
      "Fixação dos melhores reviews",
      "Selos de destaque",
      "Analytics completo",
      "Suporte prioritário",
    ],
    highlight: true,
  },
];

export default function PlanosPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu />
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Escolha o plano ideal para você
          </h1>
          <p className="text-xl text-muted-foreground">
            Aumente sua visibilidade e alcance mais clientes
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={cn(
                plan.highlight && "border-primary shadow-lg scale-105"
              )}
            >
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-lg">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-baseline text-2xl font-bold">
                  {plan.price}
                  {plan.period && (
                    <span className="text-muted-foreground text-base font-normal">
                      {plan.period}
                    </span>
                  )}
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/signup">
                    Começar {plan.name === "Gratuito" ? "Agora" : "Pro"}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      <MadeWithDyad />
    </div>
  );
}