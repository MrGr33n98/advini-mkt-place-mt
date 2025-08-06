'use client';

import { Lawyer } from "@/types/lawyer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Phone, Mail, Award, MapPin, Copy, Share2, Star, Calendar, Clock, FileText, MessageSquare, Globe, CheckCircle, DollarSign } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import SingleLawyerMap from "./SingleLawyerMap";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { reviews } from "@/data/reviews";
import { ReviewCard } from "./ReviewCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function LawyerProfileCard({ lawyer }: { lawyer: Lawyer }) {
  const [activeTab, setActiveTab] = useState("sobre");
  
  const lawyerReviews = reviews.filter(
    (review) => review.lawyer_id === lawyer.id && review.status === "approved"
  );

  const pinnedReviews = lawyerReviews.filter((review) => review.is_pinned);
  const regularReviews = lawyerReviews.filter((review) => !review.is_pinned);
  const allReviews = [...pinnedReviews, ...regularReviews];

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copiado para a área de transferência!`);
  };

  const handleShare = async () => {
    const shareData = {
      title: `Perfil de ${lawyer.name}`,
      text: `Confira o perfil de ${lawyer.name}, especialista em ${lawyer.specialties.join(', ')}.`,
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
    if (lawyer.phone) {
      window.open(lawyer.whatsapp_url || `https://wa.me/${lawyer.phone.replace(/\D/g, '')}`, '_blank');
    } else {
      toast.error("Não foi possível encontrar o contato deste advogado.");
    }
  };

  const averageRating = lawyer.average_rating || 
    (lawyerReviews.length > 0 
      ? lawyerReviews.reduce((acc, review) => acc + review.rating, 0) / lawyerReviews.length 
      : 0);

  // FAQ mockado
  const faqItems = [
    {
      question: "Quais são os horários de atendimento?",
      answer: "Atendemos de segunda a sexta-feira, das 8h às 18h. Agendamentos podem ser feitos por telefone ou WhatsApp."
    },
    {
      question: "Como funciona a primeira consulta?",
      answer: "A primeira consulta tem duração de aproximadamente 30 minutos e serve para entendermos seu caso e avaliarmos as possibilidades jurídicas. É cobrada uma taxa que pode ser abatida caso decida contratar nossos serviços."
    },
    {
      question: "Quais documentos devo levar na primeira consulta?",
      answer: "Recomendamos levar documentos pessoais (RG e CPF) e qualquer documento relacionado ao seu caso, como contratos, notificações, comprovantes, etc."
    },
    {
      question: "Quais formas de pagamento são aceitas?",
      answer: "Aceitamos pagamento via PIX, transferência bancária, cartões de crédito e débito, e em alguns casos, parcelamento dos honorários."
    }
  ];

  // Áreas de atuação detalhadas
  const detailedSpecialties = {
    "Direito Civil": ["Contratos", "Responsabilidade Civil", "Direito do Consumidor"],
    "Direito de Família": ["Divórcio", "Pensão Alimentícia", "Guarda de Filhos", "Inventário"],
    "Direito Penal": ["Defesa Criminal", "Júri", "Execução Penal"],
    "Direito Trabalhista": ["Reclamações Trabalhistas", "Acordos", "Direitos do Empregado"]
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 text-xl">
              <AvatarFallback>{getInitials(lawyer.name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{lawyer.name}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                Advogado(a)
                {averageRating > 0 && (
                  <span className="flex items-center gap-1">
                    • <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {averageRating.toFixed(1)}
                  </span>
                )}
                {lawyer.badges && lawyer.badges.includes("verified") && (
                  <span className="flex items-center gap-1 text-blue-500">
                    • <CheckCircle className="h-4 w-4" /> Verificado
                  </span>
                )}
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
              <span className="sr-only">Compartilhar</span>
            </Button>
            <Button onClick={handleContact}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Contatar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="sobre">Sobre</TabsTrigger>
            <TabsTrigger value="especialidades">Especialidades</TabsTrigger>
            <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sobre" className="space-y-6">
            {lawyer.bio && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Biografia</h3>
                <p className="text-muted-foreground">{lawyer.bio}</p>
              </div>
            )}

            <Separator />

            <div>
              <h3 className="font-semibold text-lg mb-4">Informações de Contato</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                {lawyer.oab && (
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">OAB</p>
                      <p className="text-sm text-muted-foreground">{lawyer.oab}</p>
                    </div>
                  </div>
                )}
                {lawyer.phone && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Telefone</p>
                        <a 
                          href={lawyer.whatsapp_url || `https://wa.me/${lawyer.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer" 
                          className="text-sm text-muted-foreground hover:text-primary hover:underline"
                        >
                          {lawyer.phone}
                        </a>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleCopy(lawyer.phone!, 'Telefone')}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                {lawyer.email && (
                  <div className="flex items-center justify-between col-span-1 md:col-span-2">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <a 
                          href={`mailto:${lawyer.email}`} 
                          className="text-sm text-muted-foreground hover:text-primary hover:underline"
                        >
                          {lawyer.email}
                        </a>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleCopy(lawyer.email!, 'Email')}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Honorários
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                  <Clock className="h-8 w-8 text-primary mb-2" />
                  <p className="font-medium">Consulta</p>
                  <p className="text-lg font-semibold text-primary">
                    R$ {lawyer.consultation_fee?.toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                  <FileText className="h-8 w-8 text-primary mb-2" />
                  <p className="font-medium">Hora/Aula</p>
                  <p className="text-lg font-semibold text-primary">
                    R$ {lawyer.hourly_rate?.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                * Valores podem variar conforme a complexidade do caso
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Localização
              </h3>
              <div className="overflow-hidden rounded-lg">
                <SingleLawyerMap latitude={lawyer.latitude} longitude={lawyer.longitude} />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                <Calendar className="h-8 w-8 text-primary mb-2" />
                <p className="font-medium">Atuando desde</p>
                <p className="text-muted-foreground">2010</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                <Clock className="h-8 w-8 text-primary mb-2" />
                <p className="font-medium">Horário</p>
                <p className="text-muted-foreground">Seg-Sex, 8h-18h</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                <FileText className="h-8 w-8 text-primary mb-2" />
                <p className="font-medium">Consulta</p>
                <p className="text-muted-foreground">Agende online</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="especialidades" className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Áreas de Atuação
              </h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {lawyer.specialties.map((spec) => (
                  <Badge key={spec} variant="secondary">{spec}</Badge>
                ))}
              </div>
              
              <div className="space-y-4">
                {lawyer.specialties.map(specialty => {
                  const details = detailedSpecialties[specialty as keyof typeof detailedSpecialties];
                  if (!details) return null;
                  
                  return (
                    <div key={specialty} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">{specialty}</h4>
                      <ul className="list-disc list-inside text-muted-foreground">
                        {details.map(detail => (
                          <li key={detail}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Formação Acadêmica</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="bg-muted/50 p-2 rounded-md h-fit">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Bacharel em Direito</p>
                    <p className="text-muted-foreground">Universidade Federal de Mato Grosso</p>
                    <p className="text-sm text-muted-foreground">2005 - 2010</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-muted/50 p-2 rounded-md h-fit">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Especialização em Direito Civil</p>
                    <p className="text-muted-foreground">Universidade de São Paulo</p>
                    <p className="text-sm text-muted-foreground">2011 - 2012</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="avaliacoes" className="space-y-6">
            {allReviews.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">
                    Avaliações dos Clientes ({allReviews.length})
                  </h3>
                  <div className="flex items-center gap-1">
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
                    <span className="ml-2 font-medium">{averageRating.toFixed(1)}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {allReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhuma avaliação ainda</h3>
                <p className="text-muted-foreground">
                  Este advogado ainda não possui avaliações. Seja o primeiro a avaliar!
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="faq" className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-4">Perguntas Frequentes</h3>
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{item.question}</AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Tem mais perguntas?</h4>
              <p className="text-muted-foreground mb-4">
                Entre em contato diretamente com o advogado para esclarecer suas dúvidas.
              </p>
              <Button onClick={handleContact} className="w-full">
                <MessageSquare className="mr-2 h-4 w-4" />
                Entrar em Contato
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}