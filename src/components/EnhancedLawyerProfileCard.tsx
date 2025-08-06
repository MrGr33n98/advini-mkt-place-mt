"use client";

import { Lawyer } from "@/types/lawyer";
import { LawyerBanner } from "./LawyerBanner";
import { ProfessionalInfo } from "./ProfessionalInfo";
import { WorkingHours } from "./WorkingHours";
import { CertificationGallery } from "./CertificationGallery";
import { AchievementsList } from "./AchievementsList";
import { EnhancedReviewSection } from "@/components/EnhancedReviewSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, HelpCircle, MapPin } from "lucide-react";
import { reviews } from "@/data/reviews";
import SingleLawyerMap from "./SingleLawyerMap";
import { useState } from "react";

interface EnhancedLawyerProfileCardProps {
  lawyer: Lawyer;
}

export function EnhancedLawyerProfileCard({ lawyer }: EnhancedLawyerProfileCardProps) {
  const [activeTab, setActiveTab] = useState("sobre");
  
  const lawyerReviews = reviews.filter(
    (review) => review.lawyer_id === lawyer.id && review.status === "approved"
  );

  const pinnedReviews = lawyerReviews.filter((review) => review.is_pinned);
  const regularReviews = lawyerReviews.filter((review) => !review.is_pinned);
  const allReviews = [...pinnedReviews, ...regularReviews];

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

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Banner Principal */}
      <LawyerBanner lawyer={lawyer} />

      {/* Conteúdo Principal */}
      <div className="px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6">
            <TabsTrigger value="sobre">Sobre</TabsTrigger>
            <TabsTrigger value="especialidades">Especialidades</TabsTrigger>
            <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
            <TabsTrigger value="localizacao">Localização</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>
          
          {/* Aba Sobre */}
          <TabsContent value="sobre" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Coluna Principal */}
              <div className="lg:col-span-2 space-y-6">
                <ProfessionalInfo lawyer={lawyer} />
                
                {lawyer.certifications && lawyer.certifications.length > 0 && (
                  <CertificationGallery certifications={lawyer.certifications} />
                )}
                
                {lawyer.achievements && lawyer.achievements.length > 0 && (
                  <AchievementsList achievements={lawyer.achievements} />
                )}
              </div>
              
              {/* Sidebar */}
              <div className="space-y-6">
                {lawyer.working_hours && lawyer.working_hours.length > 0 && (
                  <WorkingHours workingHours={lawyer.working_hours} />
                )}
                
                {/* Informações Rápidas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informações Rápidas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {lawyer.consultation_fee && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Consulta</span>
                        <Badge variant="secondary" className="bg-green-50 text-green-700">
                          R$ {lawyer.consultation_fee}
                        </Badge>
                      </div>
                    )}
                    
                    {lawyer.hourly_rate && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Valor/hora</span>
                        <Badge variant="secondary" className="bg-green-50 text-green-700">
                          R$ {lawyer.hourly_rate}
                        </Badge>
                      </div>
                    )}
                    
                    {lawyer.average_rating && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Avaliação</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{lawyer.average_rating}</span>
                          <span className="text-gray-500 text-sm">
                            ({lawyer.total_reviews})
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {lawyer.years_of_experience && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Experiência</span>
                        <Badge variant="outline">
                          {lawyer.years_of_experience} anos
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Aba Especialidades */}
          <TabsContent value="especialidades" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Áreas de Especialização</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {lawyer.specialties.map((specialty, index) => (
                    <div 
                      key={index}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {specialty}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Experiência comprovada em {specialty.toLowerCase()}, 
                        oferecendo soluções jurídicas eficazes e personalizadas.
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Avaliações */}
          <TabsContent value="avaliacoes" className="space-y-6">
            <EnhancedReviewSection 
              reviews={allReviews}
              lawyerId={lawyer.id}
              allowNewReviews={true}
            />
          </TabsContent>

          {/* Aba Localização */}
          <TabsContent value="localizacao" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Localização
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lawyer.office_address && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        Endereço do Escritório
                      </h3>
                      <p className="text-gray-700">{lawyer.office_address}</p>
                    </div>
                  )}
                  
                  <div className="h-96 rounded-lg overflow-hidden">
                    <SingleLawyerMap lawyer={lawyer} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba FAQ */}
          <TabsContent value="faq" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Perguntas Frequentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-600">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}