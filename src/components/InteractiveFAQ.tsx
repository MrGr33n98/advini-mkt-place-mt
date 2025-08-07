"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  HelpCircle, 
  CreditCard, 
  Users, 
  Settings, 
  Shield, 
  TrendingUp,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'planos' | 'pagamento' | 'recursos' | 'suporte' | 'tecnico';
  tags: string[];
  helpful: number;
  views: number;
}

const faqData: FAQItem[] = [
  // Planos
  {
    id: "1",
    question: "Qual a diferença entre os planos Silver e Gold?",
    answer: "O plano Silver é ideal para advogados individuais que querem mais visibilidade, incluindo perfil completo, moderação de avaliações e analytics básico. O plano Gold é voltado para escritórios, oferecendo página de escritório, perfis para até 5 advogados, destaque nos resultados (Sponsored) e analytics completo de leads.",
    category: "planos",
    tags: ["diferença", "silver", "gold", "recursos"],
    helpful: 89,
    views: 234
  },
  {
    id: "2",
    question: "Posso fazer upgrade ou downgrade do meu plano?",
    answer: "Sim, você pode alterar seu plano a qualquer momento. Para upgrade, as novas funcionalidades ficam disponíveis imediatamente. Para downgrade, você mantém acesso às funcionalidades premium até o final do período já pago.",
    category: "planos",
    tags: ["upgrade", "downgrade", "mudança", "plano"],
    helpful: 76,
    views: 189
  },
  {
    id: "3",
    question: "Existe período de teste gratuito?",
    answer: "Sim! Oferecemos 14 dias de teste gratuito para todos os planos pagos. Você pode experimentar todas as funcionalidades sem compromisso. Após o período, você pode continuar com o plano escolhido ou voltar para o plano Basic gratuito.",
    category: "planos",
    tags: ["teste", "gratuito", "trial", "período"],
    helpful: 92,
    views: 312
  },

  // Pagamento
  {
    id: "4",
    question: "Quais formas de pagamento são aceitas?",
    answer: "Aceitamos cartões de crédito (Visa, Mastercard, Elo), cartão de débito, boleto bancário e PIX. Para planos anuais, oferecemos parcelamento em até 12x no cartão de crédito sem juros.",
    category: "pagamento",
    tags: ["pagamento", "cartão", "boleto", "pix", "parcelamento"],
    helpful: 84,
    views: 267
  },
  {
    id: "5",
    question: "Como funciona o cancelamento?",
    answer: "Você pode cancelar sua assinatura a qualquer momento sem multas ou taxas. O cancelamento pode ser feito diretamente no seu dashboard. Você continuará tendo acesso às funcionalidades premium até o final do período já pago.",
    category: "pagamento",
    tags: ["cancelamento", "multa", "taxa", "período"],
    helpful: 78,
    views: 156
  },
  {
    id: "6",
    question: "Há desconto para pagamento anual?",
    answer: "Sim! Oferecemos 20% de desconto para pagamentos anuais. Por exemplo, o plano Gold anual sai por R$ 1.535,04 (equivalente a R$ 127,92/mês) ao invés de R$ 1.918,80 no pagamento mensal.",
    category: "pagamento",
    tags: ["desconto", "anual", "economia", "promoção"],
    helpful: 95,
    views: 423
  },

  // Recursos
  {
    id: "7",
    question: "Como funciona a moderação de avaliações?",
    answer: "Com os planos pagos, você pode aprovar ou rejeitar avaliações antes que sejam publicadas. Também pode destacar as melhores avaliações no topo da lista e responder a todas as avaliações para mostrar engajamento.",
    category: "recursos",
    tags: ["moderação", "avaliações", "aprovação", "destaque"],
    helpful: 87,
    views: 198
  },
  {
    id: "8",
    question: "O que são os analytics de leads?",
    answer: "Os analytics mostram quantas pessoas visualizaram seu perfil, de onde vieram (Google, redes sociais, etc.), quais informações mais interessaram e quantos contatos foram gerados. Isso ajuda a otimizar sua estratégia de marketing.",
    category: "recursos",
    tags: ["analytics", "leads", "visualizações", "estatísticas"],
    helpful: 91,
    views: 276
  },
  {
    id: "9",
    question: "Como funciona o destaque nos resultados (Sponsored)?",
    answer: "No plano Gold, seu perfil aparece destacado nos resultados de busca com uma badge 'Patrocinado', garantindo maior visibilidade. Você aparece antes dos resultados orgânicos quando alguém busca por advogados na sua região e área de atuação.",
    category: "recursos",
    tags: ["destaque", "sponsored", "visibilidade", "busca"],
    helpful: 83,
    views: 234
  },

  // Suporte
  {
    id: "10",
    question: "Que tipo de suporte vocês oferecem?",
    answer: "Plano Basic: FAQ e documentação. Plano Silver: Suporte por email com resposta em até 24h. Plano Gold: Suporte prioritário via WhatsApp com resposta em até 4h + consultoria mensal de marketing digital.",
    category: "suporte",
    tags: ["suporte", "atendimento", "whatsapp", "email"],
    helpful: 88,
    views: 167
  },
  {
    id: "11",
    question: "Vocês oferecem treinamento para usar a plataforma?",
    answer: "Sim! Temos tutoriais em vídeo, webinars mensais gratuitos e, para clientes Gold, oferecemos uma sessão de onboarding personalizada de 1 hora para configurar seu perfil da melhor forma.",
    category: "suporte",
    tags: ["treinamento", "tutorial", "webinar", "onboarding"],
    helpful: 79,
    views: 145
  },

  // Técnico
  {
    id: "12",
    question: "Meus dados estão seguros na plataforma?",
    answer: "Sim, utilizamos criptografia SSL, servidores seguros na AWS e seguimos a LGPD. Seus dados pessoais e de clientes são protegidos com os mais altos padrões de segurança. Fazemos backups diários e temos certificação ISO 27001.",
    category: "tecnico",
    tags: ["segurança", "lgpd", "ssl", "dados", "proteção"],
    helpful: 94,
    views: 289
  },
  {
    id: "13",
    question: "A plataforma funciona no celular?",
    answer: "Sim! Nossa plataforma é totalmente responsiva e funciona perfeitamente em smartphones e tablets. Também temos um app nativo em desenvolvimento que será lançado em breve para iOS e Android.",
    category: "tecnico",
    tags: ["mobile", "celular", "responsivo", "app"],
    helpful: 86,
    views: 203
  }
];

const categories = [
  { id: 'planos', name: 'Planos', icon: TrendingUp, color: 'bg-blue-500' },
  { id: 'pagamento', name: 'Pagamento', icon: CreditCard, color: 'bg-green-500' },
  { id: 'recursos', name: 'Recursos', icon: Settings, color: 'bg-purple-500' },
  { id: 'suporte', name: 'Suporte', icon: Users, color: 'bg-orange-500' },
  { id: 'tecnico', name: 'Técnico', icon: Shield, color: 'bg-red-500' }
];

export function InteractiveFAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, boolean>>({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleHelpfulVote = (faqId: string) => {
    setHelpfulVotes(prev => ({
      ...prev,
      [faqId]: !prev[faqId]
    }));
  };

  const popularFAQs = faqData
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          {isClient && <HelpCircle className="h-8 w-8 text-primary" />}
          <h2 className="text-3xl font-bold">Central de Ajuda</h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Encontre respostas rápidas para suas dúvidas ou entre em contato conosco
        </p>
      </div>

      {/* Busca */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            {isClient && <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />}
            <Input
              placeholder="Digite sua dúvida aqui..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn("h-12 text-lg", isClient ? "pl-10" : "pl-4")}
            />
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all" className="flex items-center gap-2">
            {isClient && <HelpCircle className="h-4 w-4" />}
            Todas
          </TabsTrigger>
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                {isClient && <Icon className="h-4 w-4" />}
                {category.name}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <div className="mt-8">
          {searchTerm === "" && selectedCategory === "all" && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Perguntas Mais Populares</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularFAQs.map((faq) => {
                  const category = categories.find(c => c.id === faq.category);
                  return (
                    <Card key={faq.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={cn("w-2 h-2 rounded-full mt-2", category?.color)} />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm mb-2 line-clamp-2">
                              {faq.question}
                            </h4>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{faq.views} visualizações</span>
                              <span>{faq.helpful} úteis</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {filteredFAQs.length > 0 ? (
            <Accordion type="single" collapsible className="w-full space-y-4">
              {filteredFAQs.map((faq) => {
                const category = categories.find(c => c.id === faq.category);
                const Icon = category?.icon || HelpCircle;
                
                return (
                  <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-4">
                    <AccordionTrigger className="text-left hover:no-underline">
                      <div className="flex items-start gap-3 w-full">
                        {isClient && <Icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />}
                        <div className="flex-1">
                          <h3 className="font-medium">{faq.question}</h3>
                          <div className="flex items-center gap-4 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {category?.name}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {faq.views} visualizações
                            </span>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-8 pb-4">
                      <div className="space-y-4">
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              Esta resposta foi útil?
                            </span>
                            <Button
                              variant={helpfulVotes[faq.id] ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleHelpfulVote(faq.id)}
                              className="h-8"
                            >
                              {isClient && <CheckCircle className="h-3 w-3 mr-1" />}
                              Sim ({faq.helpful + (helpfulVotes[faq.id] ? 1 : 0)})
                            </Button>
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {faq.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                {isClient && <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />}
                <h3 className="text-lg font-semibold mb-2">Nenhuma pergunta encontrada</h3>
                <p className="text-muted-foreground mb-6">
                  Não encontramos resultados para "{searchTerm}". Tente outros termos ou entre em contato conosco.
                </p>
                <Button>Falar com Suporte</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </Tabs>

      {/* Contato */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader>
          <CardTitle className="text-center">Não encontrou sua resposta?</CardTitle>
          <CardDescription className="text-center">
            Nossa equipe está pronta para ajudar você
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              {isClient && <MessageCircle className="h-6 w-6" />}
              <span className="font-medium">Chat Online</span>
              <span className="text-xs text-muted-foreground">Resposta imediata</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              {isClient && <Mail className="h-6 w-6" />}
              <span className="font-medium">Email</span>
              <span className="text-xs text-muted-foreground">Até 24h</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              {isClient && <Phone className="h-6 w-6" />}
              <span className="font-medium">WhatsApp</span>
              <span className="text-xs text-muted-foreground">Clientes Gold</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}