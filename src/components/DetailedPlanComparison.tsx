"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Check, 
  X, 
  Star, 
  Crown, 
  Zap, 
  Users, 
  BarChart3, 
  Shield, 
  Headphones,
  Smartphone,
  Globe,
  TrendingUp,
  Award,
  Clock,
  MessageCircle,
  Mail,
  Phone
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanFeature {
  name: string;
  description: string;
  basic: boolean | string;
  silver: boolean | string;
  gold: boolean | string;
  category: 'profile' | 'visibility' | 'analytics' | 'support' | 'marketing';
}

const planFeatures: PlanFeature[] = [
  // Profile
  {
    name: "Perfil Básico",
    description: "Informações básicas, foto e contato",
    basic: true,
    silver: true,
    gold: true,
    category: "profile"
  },
  {
    name: "Perfil Completo",
    description: "Biografia, especialidades, formação, experiência",
    basic: false,
    silver: true,
    gold: true,
    category: "profile"
  },
  {
    name: "Galeria de Fotos",
    description: "Até 10 fotos do escritório e equipe",
    basic: "1 foto",
    silver: "5 fotos",
    gold: "10 fotos",
    category: "profile"
  },
  {
    name: "Vídeo de Apresentação",
    description: "Vídeo de até 2 minutos no perfil",
    basic: false,
    silver: false,
    gold: true,
    category: "profile"
  },
  {
    name: "Página do Escritório",
    description: "Página dedicada para o escritório",
    basic: false,
    silver: false,
    gold: true,
    category: "profile"
  },
  {
    name: "Perfis de Advogados",
    description: "Número de advogados no escritório",
    basic: "1",
    silver: "1",
    gold: "5",
    category: "profile"
  },

  // Visibility
  {
    name: "Listagem nos Resultados",
    description: "Aparece nas buscas por advogados",
    basic: true,
    silver: true,
    gold: true,
    category: "visibility"
  },
  {
    name: "Destaque nos Resultados",
    description: "Badge 'Patrocinado' nos resultados",
    basic: false,
    silver: false,
    gold: true,
    category: "visibility"
  },
  {
    name: "Posição Prioritária",
    description: "Aparece antes dos resultados orgânicos",
    basic: false,
    silver: false,
    gold: true,
    category: "visibility"
  },
  {
    name: "SEO Otimizado",
    description: "Otimização para mecanismos de busca",
    basic: "Básico",
    silver: "Avançado",
    gold: "Premium",
    category: "visibility"
  },

  // Analytics
  {
    name: "Visualizações do Perfil",
    description: "Quantas pessoas viram seu perfil",
    basic: false,
    silver: true,
    gold: true,
    category: "analytics"
  },
  {
    name: "Analytics de Leads",
    description: "De onde vêm seus contatos",
    basic: false,
    silver: "Básico",
    gold: "Completo",
    category: "analytics"
  },
  {
    name: "Relatórios Mensais",
    description: "Relatório detalhado por email",
    basic: false,
    silver: false,
    gold: true,
    category: "analytics"
  },
  {
    name: "Comparação com Concorrentes",
    description: "Veja como está em relação aos outros",
    basic: false,
    silver: false,
    gold: true,
    category: "analytics"
  },

  // Support
  {
    name: "FAQ e Documentação",
    description: "Acesso à base de conhecimento",
    basic: true,
    silver: true,
    gold: true,
    category: "support"
  },
  {
    name: "Suporte por Email",
    description: "Atendimento via email",
    basic: false,
    silver: "24h",
    gold: "12h",
    category: "support"
  },
  {
    name: "Suporte via WhatsApp",
    description: "Atendimento prioritário",
    basic: false,
    silver: false,
    gold: "4h",
    category: "support"
  },
  {
    name: "Consultoria de Marketing",
    description: "Sessão mensal de consultoria",
    basic: false,
    silver: false,
    gold: "1h/mês",
    category: "support"
  },
  {
    name: "Onboarding Personalizado",
    description: "Configuração inicial assistida",
    basic: false,
    silver: false,
    gold: true,
    category: "support"
  },

  // Marketing
  {
    name: "Moderação de Avaliações",
    description: "Aprove avaliações antes da publicação",
    basic: false,
    silver: true,
    gold: true,
    category: "marketing"
  },
  {
    name: "Resposta a Avaliações",
    description: "Responda publicamente às avaliações",
    basic: false,
    silver: true,
    gold: true,
    category: "marketing"
  },
  {
    name: "Destaque de Avaliações",
    description: "Fixe as melhores avaliações no topo",
    basic: false,
    silver: false,
    gold: true,
    category: "marketing"
  },
  {
    name: "Campanhas de Email",
    description: "Envio de newsletters para leads",
    basic: false,
    silver: false,
    gold: "500/mês",
    category: "marketing"
  },
  {
    name: "Integração com Redes Sociais",
    description: "Compartilhamento automático",
    basic: false,
    silver: false,
    gold: true,
    category: "marketing"
  }
];

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: 0,
    description: "Para começar sua presença online",
    icon: Star,
    color: "border-gray-200",
    popular: false,
    features: ["Perfil básico", "Listagem nos resultados", "FAQ e documentação"]
  },
  {
    id: "silver",
    name: "Silver",
    price: 79.90,
    description: "Para advogados que querem mais visibilidade",
    icon: Award,
    color: "border-gray-400",
    popular: true,
    features: ["Perfil completo", "Analytics básico", "Suporte por email", "Moderação de avaliações"]
  },
  {
    id: "gold",
    name: "Gold",
    price: 159.90,
    description: "Para escritórios que querem dominar o mercado",
    icon: Crown,
    color: "border-yellow-400",
    popular: false,
    features: ["Página do escritório", "5 perfis", "Destaque nos resultados", "Suporte WhatsApp", "Consultoria"]
  }
];

const categories = [
  { id: 'profile', name: 'Perfil', icon: Users, color: 'text-blue-600' },
  { id: 'visibility', name: 'Visibilidade', icon: TrendingUp, color: 'text-green-600' },
  { id: 'analytics', name: 'Analytics', icon: BarChart3, color: 'text-purple-600' },
  { id: 'support', name: 'Suporte', icon: Headphones, color: 'text-orange-600' },
  { id: 'marketing', name: 'Marketing', icon: Zap, color: 'text-red-600' }
];

export function DetailedPlanComparison() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const getPrice = (monthlyPrice: number) => {
    if (monthlyPrice === 0) return 0;
    return isAnnual ? monthlyPrice * 12 * 0.8 : monthlyPrice; // 20% desconto anual
  };

  const getDisplayPrice = (monthlyPrice: number) => {
    const price = getPrice(monthlyPrice);
    if (price === 0) return "Grátis";
    if (isAnnual) {
      return `R$ ${(price / 12).toFixed(2)}/mês`;
    }
    return `R$ ${price.toFixed(2)}/mês`;
  };

  const filteredFeatures = selectedCategory === "all" 
    ? planFeatures 
    : planFeatures.filter(feature => feature.category === selectedCategory);

  const renderFeatureValue = (value: boolean | string) => {
    if (value === true) {
      return <Check className="h-5 w-5 text-green-600" />;
    }
    if (value === false) {
      return <X className="h-5 w-5 text-gray-400" />;
    }
    return <span className="text-sm font-medium text-center">{value}</span>;
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Compare Nossos Planos</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Escolha o plano ideal para suas necessidades e acelere o crescimento da sua carreira jurídica
        </p>
        
        {/* Toggle Anual/Mensal */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <span className={cn("text-sm", !isAnnual && "font-semibold")}>Mensal</span>
          <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
          <span className={cn("text-sm", isAnnual && "font-semibold")}>Anual</span>
          {isAnnual && (
            <Badge variant="secondary" className="ml-2">
              20% OFF
            </Badge>
          )}
        </div>
      </div>

      {/* Cards dos Planos */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <Card key={plan.id} className={cn(
              "relative",
              plan.color,
              plan.popular && "ring-2 ring-primary"
            )}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    Mais Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="space-y-2">
                  <div className="text-3xl font-bold">
                    {getDisplayPrice(plan.price)}
                  </div>
                  {isAnnual && plan.price > 0 && (
                    <div className="text-sm text-muted-foreground">
                      <span className="line-through">R$ {plan.price.toFixed(2)}/mês</span>
                      <span className="ml-2 text-green-600 font-semibold">
                        Economize R$ {(plan.price * 12 * 0.2).toFixed(2)}/ano
                      </span>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.price === 0 ? "Começar Grátis" : "Escolher Plano"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Comparação Detalhada */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Comparação Detalhada de Recursos</CardTitle>
          <CardDescription className="text-center">
            Veja todos os recursos incluídos em cada plano
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">Todos</TabsTrigger>
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {category.name}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <div className="mt-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-semibold">Recurso</th>
                      <th className="text-center p-4 font-semibold">Basic</th>
                      <th className="text-center p-4 font-semibold">Silver</th>
                      <th className="text-center p-4 font-semibold">Gold</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFeatures.map((feature, index) => {
                      const category = categories.find(c => c.id === feature.category);
                      const Icon = category?.icon || Users;
                      
                      return (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="p-4">
                            <div className="flex items-start gap-3">
                              <Icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0", category?.color)} />
                              <div>
                                <div className="font-medium">{feature.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {feature.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            {renderFeatureValue(feature.basic)}
                          </td>
                          <td className="p-4 text-center">
                            {renderFeatureValue(feature.silver)}
                          </td>
                          <td className="p-4 text-center">
                            {renderFeatureValue(feature.gold)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* CTA Final */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="text-center py-8">
          <h3 className="text-2xl font-bold mb-4">Pronto para começar?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Junte-se a mais de 10.000 advogados que já transformaram suas carreiras com nossa plataforma
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8">
              Começar Teste Gratuito
            </Button>
            <Button size="lg" variant="outline" className="px-8">
              Falar com Consultor
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            14 dias grátis • Sem compromisso • Cancele quando quiser
          </p>
        </CardContent>
      </Card>
    </div>
  );
}