"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap, 
  BarChart3, 
  MessageSquare, 
  Search, 
  Star, 
  Users,
  Calendar,
  TrendingUp,
  Eye,
  Lock,
  Crown,
  ArrowRight,
  Play
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PremiumFeature {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: string;
  benefits: string[];
  preview?: string;
  available: boolean;
}

const premiumFeatures: PremiumFeature[] = [
  {
    id: "advanced-analytics",
    title: "Analytics Avançado",
    description: "Insights detalhados sobre seu desempenho e clientes",
    icon: BarChart3,
    category: "analytics",
    benefits: [
      "Relatórios detalhados de performance",
      "Análise de conversão de leads",
      "Métricas de engajamento",
      "Comparação com concorrentes"
    ],
    preview: "dashboard-analytics.jpg",
    available: false
  },
  {
    id: "unlimited-chat",
    title: "Chat Ilimitado",
    description: "Comunicação sem limites com seus clientes",
    icon: MessageSquare,
    category: "communication",
    benefits: [
      "Conversas ilimitadas",
      "Histórico completo",
      "Notificações em tempo real",
      "Integração com WhatsApp"
    ],
    available: false
  },
  {
    id: "seo-optimization",
    title: "SEO Avançado",
    description: "Otimização completa para mecanismos de busca",
    icon: Search,
    category: "marketing",
    benefits: [
      "Otimização automática de perfil",
      "Palavras-chave personalizadas",
      "Relatórios de ranking",
      "Sugestões de melhoria"
    ],
    available: false
  },
  {
    id: "priority-support",
    title: "Suporte Prioritário",
    description: "Atendimento 24/7 com prioridade máxima",
    icon: Star,
    category: "support",
    benefits: [
      "Suporte 24/7",
      "Chat direto com especialistas",
      "Resolução em até 2 horas",
      "Gerente de conta dedicado"
    ],
    available: true
  },
  {
    id: "advanced-scheduling",
    title: "Agendamento Avançado",
    description: "Ferramentas profissionais de agendamento",
    icon: Calendar,
    category: "scheduling",
    benefits: [
      "Agendamentos ilimitados",
      "Integração com Google Calendar",
      "Lembretes automáticos",
      "Reagendamento inteligente"
    ],
    available: true
  },
  {
    id: "lead-tracking",
    title: "Rastreamento de Leads",
    description: "Acompanhe cada lead do primeiro contato à conversão",
    icon: TrendingUp,
    category: "analytics",
    benefits: [
      "Funil de conversão detalhado",
      "Origem dos leads",
      "Taxa de conversão por canal",
      "ROI por campanha"
    ],
    available: false
  }
];

const categories = [
  { id: "all", name: "Todos", icon: Zap },
  { id: "analytics", name: "Analytics", icon: BarChart3 },
  { id: "communication", name: "Comunicação", icon: MessageSquare },
  { id: "marketing", name: "Marketing", icon: Search },
  { id: "support", name: "Suporte", icon: Star },
  { id: "scheduling", name: "Agendamento", icon: Calendar }
];

export function PremiumFeaturesPreview() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const filteredFeatures = selectedCategory === "all" 
    ? premiumFeatures 
    : premiumFeatures.filter(feature => feature.category === selectedCategory);

  const handleFeatureSelect = (featureId: string) => {
    setSelectedFeature(selectedFeature === featureId ? null : featureId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          Features Premium
        </CardTitle>
        <CardDescription>
          Explore recursos exclusivos disponíveis nos planos pagos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="features" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="features">Recursos</TabsTrigger>
            <TabsTrigger value="comparison">Comparação</TabsTrigger>
          </TabsList>

          <TabsContent value="features" className="space-y-4">
            {/* Filtros de Categoria */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center gap-2"
                  >
                    <IconComponent className="h-4 w-4" />
                    {category.name}
                  </Button>
                );
              })}
            </div>

            {/* Lista de Features */}
            <div className="space-y-3">
              {filteredFeatures.map((feature) => {
                const IconComponent = feature.icon;
                const isSelected = selectedFeature === feature.id;
                
                return (
                  <div key={feature.id} className="space-y-3">
                    <div
                      className={cn(
                        "p-4 rounded-lg border-2 cursor-pointer transition-all",
                        isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                        !feature.available && "opacity-75"
                      )}
                      onClick={() => handleFeatureSelect(feature.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2 rounded-full",
                            feature.available ? "bg-green-100 dark:bg-green-900" : "bg-yellow-100 dark:bg-yellow-900"
                          )}>
                            <IconComponent className={cn(
                              "h-5 w-5",
                              feature.available ? "text-green-600 dark:text-green-400" : "text-yellow-600 dark:text-yellow-400"
                            )} />
                          </div>
                          <div>
                            <h3 className="font-semibold flex items-center gap-2">
                              {feature.title}
                              {!feature.available && <Lock className="h-4 w-4 text-muted-foreground" />}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={feature.available ? "secondary" : "outline"}>
                            {feature.available ? "Disponível" : "Premium"}
                          </Badge>
                          <ArrowRight className={cn(
                            "h-4 w-4 transition-transform",
                            isSelected && "rotate-90"
                          )} />
                        </div>
                      </div>
                    </div>

                    {/* Detalhes Expandidos */}
                    {isSelected && (
                      <div className="ml-4 p-4 bg-muted/50 rounded-lg space-y-3">
                        <h4 className="font-medium">Benefícios inclusos:</h4>
                        <ul className="space-y-2">
                          {feature.benefits.map((benefit, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                        
                        {feature.preview && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Eye className="h-4 w-4" />
                            Preview disponível
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          {!feature.available ? (
                            <Button size="sm" className="flex items-center gap-2">
                              <Crown className="h-4 w-4" />
                              Fazer Upgrade
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" className="flex items-center gap-2">
                              <Play className="h-4 w-4" />
                              Experimentar
                            </Button>
                          )}
                          {feature.preview && (
                            <Button size="sm" variant="outline" className="flex items-center gap-2">
                              <Eye className="h-4 w-4" />
                              Ver Preview
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Recurso</th>
                    <th className="text-center p-3">Basic</th>
                    <th className="text-center p-3">Silver</th>
                    <th className="text-center p-3">Gold</th>
                  </tr>
                </thead>
                <tbody>
                  {premiumFeatures.map((feature) => (
                    <tr key={feature.id} className="border-b">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <feature.icon className="h-4 w-4" />
                          {feature.title}
                        </div>
                      </td>
                      <td className="text-center p-3">
                        <span className="text-red-500">✗</span>
                      </td>
                      <td className="text-center p-3">
                        {feature.category === "analytics" || feature.category === "support" ? (
                          <span className="text-yellow-500">~</span>
                        ) : (
                          <span className="text-red-500">✗</span>
                        )}
                      </td>
                      <td className="text-center p-3">
                        <span className="text-green-500">✓</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-center pt-4">
              <Button className="flex items-center gap-2">
                <Crown className="h-4 w-4" />
                Upgrade para Gold
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}