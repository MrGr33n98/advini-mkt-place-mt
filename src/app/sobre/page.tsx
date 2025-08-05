import { NavigationMenu } from "../navigation-menu";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Card, CardContent } from "@/components/ui/card";
import { Scale, Users, Trophy, Target } from "lucide-react";

const features = [
  {
    icon: Scale,
    title: "Excelência Jurídica",
    description: "Conectamos você aos melhores profissionais do direito, todos devidamente registrados na OAB."
  },
  {
    icon: Users,
    title: "Transparência",
    description: "Avaliações reais de clientes para ajudar você a fazer a melhor escolha."
  },
  {
    icon: Trophy,
    title: "Qualidade Garantida",
    description: "Todos os advogados são verificados e passam por um processo de aprovação."
  },
  {
    icon: Target,
    title: "Facilidade de Acesso",
    description: "Encontre o advogado ideal para seu caso com nossa busca inteligente e localização no mapa."
  }
];

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Sobre Nós
          </h1>
          <p className="text-xl text-muted-foreground">
            Conectando pessoas a excelentes profissionais do direito em Cuiabá
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="max-w-3xl mx-auto prose dark:prose-invert">
          <h2>Nossa Missão</h2>
          <p>
            Facilitar o acesso à justiça conectando pessoas que precisam de assistência jurídica a advogados qualificados em Cuiabá. Nossa plataforma foi criada para tornar essa conexão mais transparente, eficiente e confiável.
          </p>

          <h2>Como Funcionamos</h2>
          <p>
            Nossa plataforma utiliza tecnologia avançada para mapear e apresentar advogados qualificados em Cuiabá. Oferecemos ferramentas para que você possa:
          </p>
          <ul>
            <li>Encontrar advogados por especialidade</li>
            <li>Ver a localização exata no mapa</li>
            <li>Ler avaliações de outros clientes</li>
            <li>Entrar em contato diretamente</li>
            <li>Fazer uma escolha informada</li>
          </ul>

          <h2>Compromisso com a Qualidade</h2>
          <p>
            Todos os advogados listados em nossa plataforma passam por um processo de verificação. Mantemos um alto padrão de qualidade para garantir que você tenha acesso aos melhores profissionais da área jurídica.
          </p>
        </div>
      </div>
      
      <MadeWithDyad />
    </div>
  );
}