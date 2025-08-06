'use client';

import { Office } from "@/types/office";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Briefcase, Phone, Mail, MapPin, Copy, Share2, Star, Calendar, 
  Clock, MessageSquare, Globe, CheckCircle, Users, Award, 
  Building2, ExternalLink, Shield, FileText
} from "lucide-react";
import SingleLawyerMap from "./SingleLawyerMap";
import { toast } from "sonner";
import { reviews } from "@/data/reviews";
import { ReviewCard } from "./ReviewCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState } from "react";
import Link from "next/link";

export default function EnhancedOfficeProfileCard({ office }: { office: Office }) {
  const [activeTab, setActiveTab] = useState("sobre");
  
  const officeReviews = reviews.filter(
    (review) => review.office_id === office.id && review.status === "approved"
  );

  const pinnedReviews = officeReviews.filter((review) => review.is_pinned);
  const regularReviews = officeReviews.filter((review) => !review.is_pinned);
  const allReviews = [...pinnedReviews, ...regularReviews];

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copiado para a área de transferência!`);
  };

  const handleShare = async () => {
    const shareData = {
      title: `Perfil do ${office.name}`,
      text: `Confira o perfil do ${office.name}, especializado em ${office.specialties.join(', ')}.`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success("Perfil compartilhado com sucesso!");
      } else {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link do perfil copiado para a área de transferência!");
      }
    } catch (error) {
      toast.error("Não foi possível compartilhar o perfil.");
      console.error("Error sharing:", error);
    }
  };

  const handleContact = () => {
    if (office.phone) {
      window.open(`https://wa.me/${office.phone.replace(/\D/g, '')}`, '_blank');
    } else {
      toast.error("Não foi possível encontrar o contato deste escritório.");
    }
  };

  const averageRating = office.rating || 
    (officeReviews.length > 0 
      ? officeReviews.reduce((acc, review) => acc + review.rating, 0) / officeReviews.length 
      : 0);

  // FAQ expandido para escritórios
  const faqItems = [
    {
      question: "Quais são os horários de atendimento?",
      answer: "Atendemos de segunda a sexta-feira, das 8h às 18h. Agendamentos podem ser feitos por telefone, WhatsApp ou através do nosso site."
    },
    {
      question: "Como funciona a primeira consulta?",
      answer: "A primeira consulta tem duração de aproximadamente 45 minutos e serve para entendermos seu caso, avaliarmos as possibilidades jurídicas e apresentarmos nossa proposta de honorários."
    },
    {
      question: "Quais documentos devo levar na primeira consulta?",
      answer: "Recomendamos levar documentos pessoais (RG, CPF, comprovante de residência) e qualquer documento relacionado ao seu caso, como contratos, notificações, comprovantes, correspondências, etc."
    },
    {
      question: "Quais formas de pagamento são aceitas?",
      answer: "Aceitamos pagamento via PIX, transferência bancária, cartões de crédito e débito. Para casos complexos, oferecemos parcelamento dos honorários mediante análise."
    },
    {
      question: "O escritório atende em outras cidades?",
      answer: "Sim, atendemos clientes em toda a região metropolitana de Cuiabá e, dependendo do caso, podemos atender em outras cidades do estado de Mato Grosso."
    },
    {
      question: "Como acompanho o andamento do meu processo?",
      answer: "Mantemos nossos clientes sempre informados através de relatórios periódicos, WhatsApp e email. Também oferecemos acesso ao nosso sistema de acompanhamento online."
    }
  ];

  const getPlanBadgeColor = (tier: string) => {
    switch (tier) {
      case 'gold': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'silver': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getPlanLabel = (tier: string) => {
    switch (tier) {
      case 'gold': return 'Plano Gold';
      case 'silver': return 'Plano Silver';
      default: return 'Plano Básico';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header com banner */}
      <div className="relative">
        {office.banner_url && (
          <div className="h-48 md:h-64 rounded-lg overflow-hidden mb-6">
            <img 
              src={office.banner_url} 
              alt={`Banner do ${office.name}`}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <Card className="w-full max-w-5xl mx-auto">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-lg overflow-hidden border-2 border-border">
                  <img 
                    src={office.logo_url} 
                    alt={office.name} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-2xl md:text-3xl">{office.name}</CardTitle>
                    {office.is_sponsored && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        <Star className="h-3 w-3 mr-1" />
                        Patrocinado
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="flex flex-wrap items-center gap-2 text-base">
                    <Building2 className="h-4 w-4" />
                    Escritório de Advocacia
                    {averageRating > 0 && (
                      <>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{averageRating.toFixed(1)}</span>
                          <span className="text-muted-foreground">({allReviews.length} avaliações)</span>
                        </div>
                      </>
                    )}
                    <span>•</span>
                    <Badge className={getPlanBadgeColor(office.plan_tier)}>
                      {getPlanLabel(office.plan_tier)}
                    </Badge>
                  </CardDescription>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 md:ml-auto">
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>
                <Button onClick={handleContact} className="bg-green-600 hover:bg-green-700">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contatar Escritório
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6">
                <TabsTrigger value="sobre">Sobre</TabsTrigger>
                <TabsTrigger value="advogados">Advogados</TabsTrigger>
                <TabsTrigger value="especialidades">Especialidades</TabsTrigger>
                <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
              </TabsList>
              
              <TabsContent value="sobre" className="space-y-8">
                {/* Descrição do escritório */}
                {office.description && (
                  <div>
                    <h3 className="font-semibold text-xl mb-3 flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Sobre o Escritório
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{office.description}</p>
                  </div>
                )}

                <Separator />

                {/* Informações de contato aprimoradas */}
                <div>
                  <h3 className="font-semibold text-xl mb-4 flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Informações de Contato
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {office.phone && (
                      <Card className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <Phone className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">Telefone / WhatsApp</p>
                              <a 
                                href={`https://wa.me/${office.phone.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer" 
                                className="text-muted-foreground hover:text-primary hover:underline"
                              >
                                {office.phone}
                              </a>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleCopy(office.phone!, 'Telefone')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    )}
                    
                    {office.email && (
                      <Card className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Mail className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">Email</p>
                              <a 
                                href={`mailto:${office.email}`} 
                                className="text-muted-foreground hover:text-primary hover:underline"
                              >
                                {office.email}
                              </a>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleCopy(office.email!, 'Email')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Localização aprimorada */}
                <div>
                  <h3 className="font-semibold text-xl mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Localização
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <div className="overflow-hidden rounded-lg border">
                        <SingleLawyerMap latitude={office.latitude} longitude={office.longitude} />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Card className="p-4">
                        <div className="flex items-start gap-3">
                          <MapPin className="h-5 w-5 text-red-500 mt-1" />
                          <div>
                            <p className="font-medium mb-1">Endereço</p>
                            <p className="text-muted-foreground text-sm">{office.address}</p>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="mt-2"
                              onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(office.address)}`, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Ver no Maps
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Informações adicionais */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="p-6 text-center">
                    <Calendar className="h-8 w-8 text-primary mx-auto mb-3" />
                    <p className="font-medium mb-2">Horário de Funcionamento</p>
                    <p className="text-muted-foreground text-sm">
                      {office.business_hours?.monday || "Seg-Sex, 8h-18h"}
                    </p>
                  </Card>
                  
                  <Card className="p-6 text-center">
                    <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                    <p className="font-medium mb-2">Equipe</p>
                    <p className="text-muted-foreground text-sm">
                      {office.lawyers?.length || 0} advogados
                    </p>
                  </Card>
                  
                  <Card className="p-6 text-center">
                    <Globe className="h-8 w-8 text-primary mx-auto mb-3" />
                    <p className="font-medium mb-2">Website</p>
                    {office.website ? (
                      <a 
                        href={office.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm"
                      >
                        Visitar site
                      </a>
                    ) : (
                      <p className="text-muted-foreground text-sm">Não disponível</p>
                    )}
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="advogados" className="space-y-6">
                <div>
                  <h3 className="font-semibold text-xl mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Advogados do Escritório ({office.lawyers?.length || 0})
                  </h3>
                  
                  {office.lawyers && office.lawyers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {office.lawyers.map((lawyer) => (
                        <Card key={lawyer.id} className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src="/default-avatar.png" alt={lawyer.name} />
                              <AvatarFallback>
                                {lawyer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h4 className="font-semibold text-lg">{lawyer.name}</h4>
                              <p className="text-muted-foreground mb-2">OAB: {lawyer.oab}</p>
                              <div className="flex flex-wrap gap-1 mb-3">
                                {lawyer.specialties.slice(0, 2).map((spec) => (
                                  <Badge key={spec} variant="secondary" className="text-xs">
                                    {spec}
                                  </Badge>
                                ))}
                                {lawyer.specialties.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{lawyer.specialties.length - 2}
                                  </Badge>
                                )}
                              </div>
                              <Button asChild size="sm" variant="outline">
                                <Link href={`/advogados/${lawyer.slug}`}>
                                  Ver Perfil Completo
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="p-8 text-center">
                      <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h4 className="font-medium mb-2">Nenhum advogado cadastrado</h4>
                      <p className="text-muted-foreground">
                        As informações dos advogados deste escritório ainda não foram cadastradas.
                      </p>
                    </Card>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="especialidades" className="space-y-6">
                <div>
                  <h3 className="font-semibold text-xl mb-4 flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Áreas de Atuação
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {office.specialties.map((specialty) => (
                      <Card key={specialty} className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Shield className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{specialty}</p>
                            <p className="text-muted-foreground text-sm">Área de especialização</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                  
                  {office.specialties.length === 0 && (
                    <Card className="p-8 text-center">
                      <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h4 className="font-medium mb-2">Especialidades não informadas</h4>
                      <p className="text-muted-foreground">
                        As áreas de atuação deste escritório ainda não foram cadastradas.
                      </p>
                    </Card>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="avaliacoes" className="space-y-6">
                {allReviews.length > 0 ? (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold text-xl">
                        Avaliações dos Clientes ({allReviews.length})
                      </h3>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${
                              star <= Math.round(averageRating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 font-medium text-lg">{averageRating.toFixed(1)}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {allReviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <Card className="p-12 text-center">
                    <Star className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">Nenhuma avaliação ainda</h3>
                    <p className="text-muted-foreground mb-6">
                      Este escritório ainda não possui avaliações. Seja o primeiro a avaliar!
                    </p>
                    <Button onClick={handleContact}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Entrar em Contato
                    </Button>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="faq" className="space-y-6">
                <div>
                  <h3 className="font-semibold text-xl mb-4">Perguntas Frequentes</h3>
                  <Accordion type="single" collapsible className="w-full">
                    {faqItems.map((item, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
                
                <Card className="p-6 bg-muted/30">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Tem mais perguntas?
                  </h4>
                  <p className="text-muted-foreground mb-4">
                    Entre em contato diretamente com o escritório para esclarecer suas dúvidas específicas.
                  </p>
                  <Button onClick={handleContact} className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Entrar em Contato
                  </Button>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}