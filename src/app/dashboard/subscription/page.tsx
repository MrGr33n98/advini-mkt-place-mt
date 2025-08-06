'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Basic",
    price: "R$ 0",
    features: [
      "Perfil individual básico",
      "Listagem no mapa",
      "Recebimento de até 5 avaliações/mês",
    ],
    isCurrent: false,
  },
  {
    name: "Silver",
    price: "R$ 79,90",
    period: "/mês",
    features: [
      "Perfil individual completo",
      "Moderação de avaliações",
      "Analytics de visualizações",
      "Suporte via email",
    ],
    isCurrent: true,
    highlight: true,
  },
  {
    name: "Gold",
    price: "R$ 159,90",
    period: "/mês",
    features: [
      "Página de Escritório",
      "Perfis para até 5 advogados",
      "Destaque nos resultados de busca",
      "Analytics completo de leads",
    ],
    isCurrent: false,
  },
];

export default function SubscriptionPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Gerenciar Plano</h1>
      <p className="text-muted-foreground mb-8">
        Veja os detalhes do seu plano atual e explore outras opções para impulsionar seu perfil.
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              "flex flex-col",
              plan.highlight && "border-secondary shadow-lg"
            )}
          >
            {plan.isCurrent && (
              <Badge className="absolute -top-2 -right-2">Plano Atual</Badge>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="flex items-baseline text-2xl font-bold">
                {plan.price}
                {plan.period && (
                  <span className="text-muted-foreground text-base font-normal">
                    {plan.period}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {plan.isCurrent ? (
                <Button className="w-full" variant="outline" disabled>
                  Seu Plano Atual
                </Button>
              ) : (
                <Button className="w-full" asChild variant={plan.highlight ? "secondary" : "default"}>
                  <Link href="#">
                    {plan.name === "Basic" ? "Fazer Downgrade" : "Fazer Upgrade"}
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}