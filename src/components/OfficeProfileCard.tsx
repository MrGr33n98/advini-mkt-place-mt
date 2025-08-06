'use client';

import { Office } from "@/types/office";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Phone, Mail, MapPin, Copy, Share2, Star, Calendar, Clock, MessageSquare, Globe, CheckCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import SingleLawyerMap from "./SingleLawyerMap";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { reviews } from "@/data/reviews";
import { ReviewCard } from "./ReviewCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export default function OfficeProfileCard({ office }: { office: Office }) {
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

  // FAQ mockado
  const faqItems = [
    {
      question: "Quais são os horários de atendimento?",
      answer: "Atendemos de segunda a sexta-feira, das 8h às 18h. Agendamentos podem ser feitos por telefone ou WhatsApp."
    },
    {
      question: "Como funciona a primeira consulta?",
      answer: "A primeira consulta tem duração de aproximadamente 30 minutos e serve para entendermos seu caso e avaliarmos as possibilidades jurídicas."
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

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-lg overflow-hidden">
              <img 
                src={office.logo_url} 
                alt={office.name} 
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <CardTitle className="text-2xl">{office.name}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                Escritório de Advocacia
                {averageRating > 0 && (
                  <span className="flex items-center gap-1">
                    • <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {averageRating.toFixed(1)}
                  </span>
                )}
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleShare}>
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
            {office.description && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Sobre o Escritório</h3>
                <p className="text-muted-foreground">{office.description}</p>
              </div>
            )}

            <Separator />

            <div>
              <h3 className="font-semibold text-lg mb-4">Informações de Contato</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                {office.phone && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Telefone</p>
                        <a 
                          href={`https://wa.me/${office.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer" 
                          className="text-sm text-muted-foreground hover:text-primary hover:underline"
                        >
                          {office.phone}
                        </a>
                      </div>
                    </div>
                    <Button onClick={() => handleCopy(office.phone!, 'Telefone')}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                {office.email && (
                  <div className="flex items-center justify-between col-span-1 md:col-span-2">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <a 
                          href={`mailto:${office.email}`} 
                          className="text-sm text-muted-foreground hover:text-primary hover:underline"
                        >
                          {office.email}
                        </a>
                      </div>
                    </div>
                    <Button onClick={() => handleCopy(office.email!, 'Email')}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Localização
              </h3>
              <div className="overflow-hidden rounded-lg">
                <SingleLawyerMap latitude={office.latitude} longitude={office.longitude} />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                <Calendar className="h-8 w-8 text-primary mb-2" />
                <p className="font-medium">Horário de Funcionamento</p>
                <p className="text-muted-foreground text-center">
                  {office.business_hours?.monday || "Seg-Sex, 9h-18h"}
                </p>
              </div>
              <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                <Briefcase className="h-8 w-8 text-primary mb-2" />
                <p className="font-medium">Advogados</p>
                <p className="text-muted-foreground">{office.lawyers?.length || 0} profissionais</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
                <Globe className="h-8 w-8 text-primary mb-2" />
                <p className="font-medium">Website</p>
                {office.website ? (
                  <a 
                    href={office.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary hover:underline"
                  >
                    Visitar site
                  </a>
                ) : (
                  <p className="text-muted-foreground">Não disponível</p>
                )}
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
                {office.specialties.map((spec) => (
                  <Badge key={spec} variant="secondary">{spec}</Badge>
                ))}
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
                  Este escritório ainda não possui avaliações. Seja o primeiro a avaliar!
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
                Entre em contato diretamente com o escritório para esclarecer suas dúvidas.
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