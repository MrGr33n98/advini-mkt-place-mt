import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, HelpCircle, X } from "lucide-react";
import Link from "next/link";
import { NavigationMenu } from "../navigation-menu";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const plans = [
  {
    name: "Gratuito",
    price: "R$ 0",
    description: "Para advogados iniciando sua presença online",
    features: [
      "Perfil básico",
      "Listagem no mapa",
      "Recebimento de avaliações",
      "Contato via WhatsApp",
    ],
    limitations: [
      "Sem moderação de avaliações",
      "Sem analytics",
      "Sem personalização",
      "Sem destaque nos resultados"
    ]
  },
  {
    name: "Pro",
    price: "R$ 99,90",
    period: "/mês",
    description: "Para advogados que querem mais visibilidade e controle",
    features: [
      "Todas as features do plano Gratuito",
      "URL personalizada do WhatsApp",
      "Banner e logo personalizados",
      "Moderação de avaliações",
      "Fixação dos melhores reviews",
      "Selos de destaque",
      "Analytics completo",
      "Suporte prioritário",
    ],
    highlight: true,
  },
  {
    name: "Premium",
    price: "R$ 199,90",
    period: "/mês",
    description: "Para escritórios e advogados que buscam máxima exposição",
    features: [
      "Todas as features do plano Pro",
      "Destaque nos resultados de busca",
      "Perfil de múltiplos advogados",
      "Integração com agenda",
      "Página personalizada",
      "Consultoria de marketing",
      "Suporte VIP 24/7",
    ],
  },
];

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
      
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Escolha o plano ideal para você
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Aumente sua visibilidade, gerencie sua reputação online e alcance mais clientes com nossos planos personalizados para advogados.
          </p>
        </div>

        <Tabs defaultValue="cards" className="w-full mb-16">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="cards">Planos</TabsTrigger>
            <TabsTrigger value="comparison">Comparação Detalhada</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cards" className="mt-8">
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={cn(
                    "flex flex-col",
                    plan.highlight && "border-primary shadow-lg md:scale-105 z-10"
                  )}
                >
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-lg">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 flex-grow">
                    <div className="flex items-baseline text-2xl font-bold">
                      {plan.price}
                      {plan.period && (
                        <span className="text-muted-foreground text-base font-normal">
                          {plan.period}
                        </span>
                      )}
                    </div>
                    <ul className="space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                      
                      {plan.limitations && plan.limitations.map((limitation) => (
                        <li key={limitation} className="flex items-center gap-2">
                          <X className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          <span className="text-muted-foreground line-through opacity-70">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild variant={plan.highlight ? "default" : "outline"}>
                      <Link href="/signup">
                        {plan.name === "Gratuito" ? "Começar Agora" : `Escolher ${plan.name}`}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="comparison" className="mt-8">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-3 border-b">Recursos</th>
                    <th className="text-center p-3 border-b">Gratuito</th>
                    <th className="text-center p-3 border-b bg-primary/5">Pro</th>
                    <th className="text-center p-3 border-b">Premium</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, index) => (
                    <tr key={index} className={index % 2 === 0 ? "bg-muted/30" : ""}>
                      <td className="p-3 border-b">{feature.name}</td>
                      <td className="text-center p-3 border-b">
                        {feature.free ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground mx-auto" />
                        )}
                      </td>
                      <td className="text-center p-3 border-b bg-primary/5">
                        {feature.pro ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground mx-auto" />
                        )}
                      </td>
                      <td className="text-center p-3 border-b">
                        {feature.premium ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>

        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-2xl font-bold mb-6 text-center">Perguntas Frequentes</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    {item.question}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pl-7">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="max-w-3xl mx-auto mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Ainda tem dúvidas?</h2>
          <p className="text-muted-foreground mb-6">
            Nossa equipe está pronta para ajudar você a escolher o plano ideal para suas necessidades.
          </p>
          <Button asChild>
            <Link href="/contato">Fale Conosco</Link>
          </Button>
        </div>
      </div>
      
      <MadeWithDyad />
    </div>
  );
}