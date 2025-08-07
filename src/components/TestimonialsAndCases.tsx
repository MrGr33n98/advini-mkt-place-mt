"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote, Star, TrendingUp, Users, DollarSign, Calendar, MapPin, Briefcase, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  rating: number;
  plan: 'Silver' | 'Gold';
  quote: string;
  results: {
    clientsIncrease: number;
    revenueIncrease: number;
    timeOnPlatform: string;
  };
}

interface CaseStudy {
  id: string;
  title: string;
  lawyer: {
    name: string;
    specialization: string;
    location: string;
    avatar: string;
  };
  plan: 'Silver' | 'Gold';
  duration: string;
  challenge: string;
  solution: string;
  results: {
    metric: string;
    before: string;
    after: string;
    improvement: string;
  }[];
  testimonial: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Dr. Carlos Mendes",
    role: "Advogado Criminalista",
    location: "São Paulo, SP",
    avatar: "/team/carlos-mendes.jpg",
    rating: 5,
    plan: "Gold",
    quote: "Em 6 meses, minha carteira de clientes triplicou. A plataforma me deu a visibilidade que eu precisava para crescer no mercado digital.",
    results: {
      clientsIncrease: 200,
      revenueIncrease: 180,
      timeOnPlatform: "8 meses"
    }
  },
  {
    id: "2",
    name: "Dra. Ana Paula Silva",
    role: "Advogada Trabalhista",
    location: "Rio de Janeiro, RJ",
    avatar: "/team/ana-silva.jpg",
    rating: 5,
    plan: "Silver",
    quote: "O sistema de avaliações me ajudou a construir uma reputação sólida online. Hoje recebo indicações constantemente.",
    results: {
      clientsIncrease: 150,
      revenueIncrease: 120,
      timeOnPlatform: "1 ano"
    }
  },
  {
    id: "3",
    name: "Dr. Roberto Oliveira",
    role: "Advogado Empresarial",
    location: "Belo Horizonte, MG",
    avatar: "/team/roberto-oliveira.jpg",
    rating: 5,
    plan: "Gold",
    quote: "A calculadora de ROI não mentiu. Em menos de 3 meses já havia recuperado o investimento e estava lucrando.",
    results: {
      clientsIncrease: 300,
      revenueIncrease: 250,
      timeOnPlatform: "6 meses"
    }
  },
  {
    id: "4",
    name: "Dra. Mariana Costa",
    role: "Advogada de Família",
    location: "Porto Alegre, RS",
    avatar: "/team/mariana-costa.jpg",
    rating: 5,
    plan: "Silver",
    quote: "Como advogada iniciante, a plataforma me deu credibilidade e me ajudou a conquistar meus primeiros clientes importantes.",
    results: {
      clientsIncrease: 400,
      revenueIncrease: 300,
      timeOnPlatform: "4 meses"
    }
  }
];

const caseStudies: CaseStudy[] = [
  {
    id: "1",
    title: "De 5 para 50 clientes em 6 meses",
    lawyer: {
      name: "Dr. Eduardo Santos",
      specialization: "Direito Imobiliário",
      location: "Brasília, DF",
      avatar: "/team/eduardo-santos.jpg"
    },
    plan: "Gold",
    duration: "6 meses",
    challenge: "Advogado recém-formado com dificuldades para conseguir clientes e estabelecer credibilidade no mercado.",
    solution: "Utilizou o plano Gold com foco em SEO local, sistema de avaliações e destaque nos resultados de busca.",
    results: [
      {
        metric: "Clientes por mês",
        before: "2-3",
        after: "15-20",
        improvement: "+600%"
      },
      {
        metric: "Receita mensal",
        before: "R$ 3.000",
        after: "R$ 25.000",
        improvement: "+733%"
      },
      {
        metric: "Avaliações",
        before: "0",
        after: "47 (4.9★)",
        improvement: "Nova reputação"
      },
      {
        metric: "Posição no Google",
        before: "Não aparecia",
        after: "Top 3 local",
        improvement: "Visibilidade máxima"
      }
    ],
    testimonial: "A plataforma transformou minha carreira. Saí de um escritório compartilhado para meu próprio escritório em 6 meses."
  },
  {
    id: "2",
    title: "Escritório familiar dobra faturamento",
    lawyer: {
      name: "Dra. Fernanda Lima",
      specialization: "Direito de Família",
      location: "Curitiba, PR",
      avatar: "/team/fernanda-lima.jpg"
    },
    plan: "Gold",
    duration: "1 ano",
    challenge: "Escritório tradicional precisava se modernizar e atrair clientes mais jovens através do digital.",
    solution: "Implementou perfil completo com múltiplos advogados, sistema de agendamento online e marketing de conteúdo.",
    results: [
      {
        metric: "Faturamento anual",
        before: "R$ 180.000",
        after: "R$ 360.000",
        improvement: "+100%"
      },
      {
        metric: "Clientes novos/mês",
        before: "8-10",
        after: "25-30",
        improvement: "+200%"
      },
      {
        metric: "Taxa de conversão",
        before: "15%",
        after: "35%",
        improvement: "+133%"
      },
      {
        metric: "Tempo médio para fechar negócio",
        before: "15 dias",
        after: "7 dias",
        improvement: "-53%"
      }
    ],
    testimonial: "Conseguimos modernizar nosso escritório sem perder a essência familiar. Os clientes agora nos encontram facilmente online."
  }
];

export function TestimonialsAndCases() {
  const [activeTab, setActiveTab] = useState("testimonials");

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "h-4 w-4",
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        )}
      />
    ));
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Histórias de Sucesso</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Veja como advogados reais transformaram suas carreiras com nossa plataforma
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="testimonials" className="flex items-center gap-2">
            <Quote className="h-4 w-4" />
            Depoimentos
          </TabsTrigger>
          <TabsTrigger value="cases" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Cases de Sucesso
          </TabsTrigger>
        </TabsList>

        <TabsContent value="testimonials" className="mt-8">
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="h-full">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{testimonial.name}</h3>
                        <Badge variant="outline">{testimonial.plan}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{testimonial.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(testimonial.rating)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <blockquote className="text-muted-foreground italic">
                    "{testimonial.quote}"
                  </blockquote>
                  
                  <div className="grid grid-cols-3 gap-3 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        +{testimonial.results.clientsIncrease}%
                      </div>
                      <div className="text-xs text-muted-foreground">Clientes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        +{testimonial.results.revenueIncrease}%
                      </div>
                      <div className="text-xs text-muted-foreground">Receita</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">
                        {testimonial.results.timeOnPlatform}
                      </div>
                      <div className="text-xs text-muted-foreground">Na plataforma</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cases" className="mt-8">
          <div className="space-y-8">
            {caseStudies.map((caseStudy) => (
              <Card key={caseStudy.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">{caseStudy.title}</CardTitle>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={caseStudy.lawyer.avatar} alt={caseStudy.lawyer.name} />
                            <AvatarFallback>
                              {caseStudy.lawyer.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-sm">{caseStudy.lawyer.name}</div>
                            <div className="text-xs text-muted-foreground">{caseStudy.lawyer.specialization}</div>
                          </div>
                        </div>
                        <Badge variant="outline">{caseStudy.plan}</Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {caseStudy.duration}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-6 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Desafio
                      </h4>
                      <p className="text-muted-foreground text-sm">{caseStudy.challenge}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Solução
                      </h4>
                      <p className="text-muted-foreground text-sm">{caseStudy.solution}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-4 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Resultados Alcançados
                    </h4>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {caseStudy.results.map((result, index) => (
                        <div key={index} className="bg-muted/30 p-4 rounded-lg text-center">
                          <div className="text-xs text-muted-foreground mb-1">{result.metric}</div>
                          <div className="text-sm text-muted-foreground mb-1">
                            De: <span className="font-medium">{result.before}</span>
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            Para: <span className="font-medium">{result.after}</span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {result.improvement}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-primary/5 p-4 rounded-lg">
                    <blockquote className="text-muted-foreground italic">
                      "{caseStudy.testimonial}"
                    </blockquote>
                    <cite className="text-sm font-medium mt-2 block">
                      - {caseStudy.lawyer.name}
                    </cite>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <div className="text-center pt-8">
        <h3 className="text-xl font-semibold mb-4">Pronto para ser o próximo caso de sucesso?</h3>
        <Button size="lg" className="px-8">
          Começar Agora
        </Button>
      </div>
    </div>
  );
}