import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Crown, Award, HelpCircle, X } from "lucide-react";
import Link from "next/link";
import { NavigationMenu } from "../navigation-menu";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ROICalculator } from "@/components/ROICalculator";
import { TestimonialsAndCases } from "@/components/TestimonialsAndCases";
import { InteractiveFAQ } from "@/components/InteractiveFAQ";
import { DetailedPlanComparison } from "@/components/DetailedPlanComparison";

const plans = [
  {
    name: "Basic",
    price: "R$ 0",
    description: "Para advogados iniciando sua presença online.",
    features: [
      "Perfil individual básico",
      "Listagem no mapa",
      "Recebimento de até 5 avaliações/mês",
    ],
    limitations: [
      "Sem destaque na busca",
      "Sem analytics",
      "Sem perfil de escritório",
    ]
  },
  {
    name: "Silver",
    price: "R$ 79,90",
    period: "/mês",
    description: "Para advogados que querem mais visibilidade e controle.",
    features: [
      "Todas as features do plano Basic",
      "Perfil individual completo",
      "Moderação de avaliações",
      "Analytics de visualizações",
      "Suporte via email",
    ],
    highlight: true,
  },
  {
    name: "Gold",
    price: "R$ 159,90",
    period: "/mês",
    description: "Para escritórios e advogados que buscam máxima exposição.",
    features: [
      "Todas as features do plano Silver",
      "Página de Escritório",
      "Perfis para até 5 advogados",
      "Destaque nos resultados de busca (Sponsored)",
      "Analytics completo de leads",
      "Suporte prioritário via WhatsApp",
    ],
  },
];

// ... (restante do arquivo permanece o mesmo, apenas atualize os textos se necessário)
const faqItems = [
  {
    question: "Como funciona o período de teste?",
    answer: "Oferecemos 7 dias de teste gratuito do plano Pro para que você possa experimentar todos os recursos premium sem compromisso. Após esse período, você pode optar por continuar com o plano pago ou voltar para o plano gratuito."
  },
  {
    question: "Posso mudar de plano a qualquer momento?",
    answer: "Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento. Se fizer downgrade, as funcionalidades premium ficarão disponíveis até o final do período já pago."
  },
  {
    question: "Como funciona a moderação de avaliações?",
    answer: "Com os planos pagos, você pode aprovar ou rejeitar avaliações antes que elas sejam publicadas no seu perfil, além de poder destacar as melhores avaliações no topo da lista."
  },
  {
    question: "Quais formas de pagamento são aceitas?",
    answer: "Aceitamos cartões de crédito, débito, boleto bancário e PIX. Para planos anuais, oferecemos a opção de parcelamento em até 12x no cartão de crédito."
  },
  {
    question: "Existe algum contrato de fidelidade?",
    answer: "Não exigimos contratos de fidelidade. Você pode cancelar sua assinatura a qualquer momento sem multas ou taxas adicionais."
  }
];

const comparisonFeatures = [
  { name: "Perfil básico", free: true, pro: true, premium: true },
  { name: "Listagem no mapa", free: true, pro: true, premium: true },
  { name: "Recebimento de avaliações", free: true, pro: true, premium: true },
  { name: "Contato via WhatsApp", free: true, pro: true, premium: true },
  { name: "URL personalizada", free: false, pro: true, premium: true },
  { name: "Banner e logo personalizados", free: false, pro: true, premium: true },
  { name: "Moderação de avaliações", free: false, pro: true, premium: true },
  { name: "Fixação de reviews", free: false, pro: true, premium: true },
  { name: "Selos de destaque", free: false, pro: true, premium: true },
  { name: "Analytics básico", free: false, pro: true, premium: true },
  { name: "Analytics avançado", free: false, pro: false, premium: true },
  { name: "Destaque nos resultados", free: false, pro: false, premium: true },
  { name: "Perfil de múltiplos advogados", free: false, pro: false, premium: true },
  { name: "Integração com agenda", free: false, pro: false, premium: true },
  { name: "Página personalizada", free: false, pro: false, premium: true },
  { name: "Consultoria de marketing", free: false, pro: false, premium: true },
  { name: "Suporte por email", free: true, pro: true, premium: true },
  { name: "Suporte prioritário", free: false, pro: true, premium: true },
  { name: "Suporte VIP 24/7", free: false, pro: false, premium: true },
];

export default function PlanosPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu />
      
      <main className="container mx-auto px-4 py-8 space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold">Escolha o Plano Ideal</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Acelere o crescimento da sua carreira jurídica com as ferramentas certas. 
            Mais de 10.000 advogados já transformaram suas práticas conosco.
          </p>
        </div>

        {/* Calculadora de ROI */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Calcule seu Retorno sobre Investimento</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Veja quanto você pode ganhar investindo em marketing digital jurídico
            </p>
          </div>
          <ROICalculator />
        </section>

        {/* Comparação Detalhada de Planos */}
        <section>
          <DetailedPlanComparison />
        </section>

        {/* Depoimentos e Cases */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Histórias de Sucesso</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Veja como nossos clientes transformaram suas carreiras e aumentaram sua receita
            </p>
          </div>
          <TestimonialsAndCases />
        </section>

        {/* FAQ Interativo */}
        <section>
          <InteractiveFAQ />
        </section>

        {/* CTA Final */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-none">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">Comece sua Transformação Digital Hoje</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Junte-se a mais de 10.000 advogados que já descobriram o poder do marketing digital jurídico. 
                Teste grátis por 14 dias, sem compromisso.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Button size="lg" className="px-8">
                  Começar Teste Gratuito
                </Button>
                <Button size="lg" variant="outline" className="px-8">
                  Agendar Demonstração
                </Button>
              </div>
              <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  14 dias grátis
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Sem compromisso
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  Cancele quando quiser
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
      
      <MadeWithDyad />
    </div>
  );
}