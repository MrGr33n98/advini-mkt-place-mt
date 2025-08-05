import { NavigationMenu } from "../navigation-menu";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, HelpCircle, User, Briefcase, CreditCard, Shield, MessageSquare } from "lucide-react";
import Link from "next/link";

// Dados mockados para as perguntas frequentes
const faqCategories = [
  {
    id: "general",
    name: "Geral",
    icon: HelpCircle,
    questions: [
      {
        question: "O que é a plataforma Encontre seu Advogado?",
        answer: "A plataforma Encontre seu Advogado é um serviço online que conecta pessoas que precisam de assistência jurídica a advogados qualificados em Cuiabá-MT. Nosso objetivo é facilitar o acesso à justiça, permitindo que os usuários encontrem o profissional ideal para seu caso específico."
      },
      {
        question: "Como funciona a plataforma?",
        answer: "Nossa plataforma permite que você busque advogados por especialidade, localização ou avaliações. Você pode visualizar os profissionais em um mapa interativo, ver seus perfis detalhados, ler avaliações de outros clientes e entrar em contato diretamente com o advogado escolhido."
      },
      {
        question: "O serviço é gratuito para quem busca um advogado?",
        answer: "Sim, o uso da plataforma é totalmente gratuito para quem busca um advogado. Não cobramos nenhuma taxa ou comissão dos usuários que estão procurando assistência jurídica."
      },
      {
        question: "Vocês garantem a qualidade dos advogados listados?",
        answer: "Sim, todos os advogados listados em nossa plataforma passam por um processo de verificação. Confirmamos o registro na OAB e monitoramos as avaliações dos clientes para garantir a qualidade do serviço. No entanto, recomendamos que os usuários também façam sua própria pesquisa e avaliação antes de contratar um profissional."
      }
    ]
  },
  {
    id: "users",
    name: "Para Usuários",
    icon: User,
    questions: [
      {
        question: "Como encontro o advogado ideal para meu caso?",
        answer: "Você pode usar nossos filtros de busca para encontrar advogados por especialidade, localização ou avaliação. Recomendamos que você leia os perfis completos, verifique as avaliações de outros clientes e, se possível, agende uma consulta inicial antes de tomar sua decisão."
      },
      {
        question: "Posso ver avaliações de outros clientes?",
        answer: "Sim, cada perfil de advogado inclui avaliações e comentários de clientes anteriores. Essas avaliações são verificadas para garantir sua autenticidade e podem ajudar você a tomar uma decisão informada."
      },
      {
        question: "Como entro em contato com um advogado?",
        answer: "Cada perfil de advogado inclui informações de contato, como telefone, WhatsApp e email. Você pode entrar em contato diretamente usando esses canais ou usar o botão 'Contatar' no perfil do advogado."
      },
      {
        question: "Quanto custa a consulta com um advogado?",
        answer: "Os honorários são definidos diretamente pelos advogados e podem variar dependendo da complexidade do caso e da experiência do profissional. Muitos advogados oferecem uma primeira consulta gratuita ou a um custo reduzido. Recomendamos que você discuta os honorários diretamente com o advogado antes de contratar seus serviços."
      },
      {
        question: "Posso deixar uma avaliação após usar os serviços de um advogado?",
        answer: "Sim, incentivamos os usuários a compartilharem suas experiências. Após utilizar os serviços de um advogado encontrado em nossa plataforma, você pode deixar uma avaliação em seu perfil, ajudando outros usuários a tomarem decisões informadas."
      }
    ]
  },
  {
    id: "lawyers",
    name: "Para Advogados",
    icon: Briefcase,
    questions: [
      {
        question: "Como posso me cadastrar como advogado na plataforma?",
        answer: "Para se cadastrar, acesse a opção 'Área do Advogado' no menu superior e clique em 'Cadastre-se'. Você precisará fornecer informações básicas, como nome, número da OAB, especialidades e dados de contato. Após o cadastro, nossa equipe fará a verificação das informações antes de aprovar seu perfil."
      },
      {
        question: "Quanto custa para um advogado estar na plataforma?",
        answer: "Oferecemos um plano gratuito com funcionalidades básicas e planos pagos com recursos adicionais. No plano gratuito, você pode criar um perfil básico e receber contatos de potenciais clientes. Os planos pagos incluem recursos como destaque nos resultados de busca, personalização do perfil e ferramentas de gestão de reputação."
      },
      {
        question: "Como funciona o processo de verificação?",
        answer: "Verificamos seu registro na OAB para confirmar que você é um advogado licenciado. Também podemos solicitar documentos adicionais para confirmar sua identidade e especialidades. Este processo geralmente leva de 1 a 3 dias úteis."
      },
      {
        question: "Posso responder às avaliações dos clientes?",
        answer: "Sim, nos planos pagos, você pode responder às avaliações dos clientes, ajudando a gerenciar sua reputação online. Também é possível destacar as melhores avaliações em seu perfil."
      },
      {
        question: "Como posso destacar meu perfil para atrair mais clientes?",
        answer: "Recomendamos manter seu perfil completo e atualizado, incluindo todas as suas especialidades e uma boa descrição de seus serviços. Incentive seus clientes satisfeitos a deixarem avaliações positivas. Além disso, nossos planos pagos oferecem recursos de destaque que aumentam sua visibilidade na plataforma."
      }
    ]
  },
  {
    id: "payments",
    name: "Pagamentos",
    icon: CreditCard,
    questions: [
      {
        question: "Quais formas de pagamento são aceitas para os planos premium?",
        answer: "Aceitamos cartões de crédito, débito, boleto bancário e PIX. Para planos anuais, oferecemos a opção de parcelamento em até 12x no cartão de crédito."
      },
      {
        question: "Existe algum período de teste para os planos pagos?",
        answer: "Sim, oferecemos 7 dias de teste gratuito do plano Pro para que você possa experimentar todos os recursos premium sem compromisso. Após esse período, você pode optar por continuar com o plano pago ou voltar para o plano gratuito."
      },
      {
        question: "Como funciona a renovação da assinatura?",
        answer: "As assinaturas são renovadas automaticamente ao final de cada período (mensal ou anual). Você receberá um email alguns dias antes da renovação, lembrando sobre a cobrança. Você pode cancelar a renovação automática a qualquer momento em sua área de gerenciamento de conta."
      },
      {
        question: "Posso mudar de plano a qualquer momento?",
        answer: "Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento. Se fizer upgrade, a diferença será cobrada proporcionalmente ao tempo restante do seu plano atual. Se fizer downgrade, as funcionalidades premium ficarão disponíveis até o final do período já pago."
      },
      {
        question: "Qual é a política de reembolso?",
        answer: "Oferecemos reembolso total nos primeiros 30 dias após a contratação de qualquer plano pago, caso você não esteja satisfeito com o serviço. Após esse período, não oferecemos reembolso para períodos não utilizados."
      }
    ]
  },
  {
    id: "privacy",
    name: "Privacidade e Segurança",
    icon: Shield,
    questions: [
      {
        question: "Como vocês protegem meus dados pessoais?",
        answer: "Seguimos rigorosamente a Lei Geral de Proteção de Dados (LGPD). Seus dados são armazenados em servidores seguros, com criptografia de ponta a ponta. Não compartilhamos suas informações com terceiros sem seu consentimento explícito."
      },
      {
        question: "Quais dados são coletados dos usuários?",
        answer: "Coletamos apenas os dados necessários para o funcionamento da plataforma, como nome, email e, opcionalmente, telefone. Para advogados, coletamos informações profissionais como número da OAB e especialidades. Também coletamos dados de uso para melhorar nossa plataforma."
      },
      {
        question: "As avaliações são moderadas?",
        answer: "Sim, todas as avaliações passam por um processo de moderação para garantir que sigam nossas diretrizes de comunidade. Removemos avaliações que contenham linguagem ofensiva, informações falsas ou que violem nossa política de uso."
      },
      {
        question: "Como posso solicitar a exclusão dos meus dados?",
        answer: "Você pode solicitar a exclusão de seus dados a qualquer momento através da página de configurações da sua conta ou entrando em contato com nosso suporte. Processaremos sua solicitação em conformidade com a LGPD."
      }
    ]
  }
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Perguntas Frequentes
          </h1>
          <p className="text-xl text-muted-foreground">
            Encontre respostas para as dúvidas mais comuns sobre nossa plataforma
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Buscar perguntas..." 
              className="pl-10 h-12"
            />
          </div>
        </div>

        {/* FAQ Tabs */}
        <Tabs defaultValue="general" className="max-w-4xl mx-auto">
          
          <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
            {faqCategories.map(category => (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                <category.icon className="h-4 w-4" />
                <span className="hidden md:inline">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {faqCategories.map(category => (
            <TabsContent key={category.id} value={category.id}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <category.icon className="h-5 w-5" />
                    Perguntas sobre {category.name}
                  </CardTitle>
                  <CardDescription>
                    Respostas para as dúvidas mais comuns sobre {category.name.toLowerCase()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((item, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left font-medium">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Still Have Questions */}
        <div className="max-w-3xl mx-auto mt-16 text-center">
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-2xl">Ainda tem dúvidas?</CardTitle>
              <CardDescription>
                Nossa equipe está pronta para ajudar você com qualquer pergunta adicional
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline" className="flex items-center gap-2">
                <Link href="/contato">
                  <MessageSquare className="h-4 w-4" />
                  Fale Conosco
                </Link>
              </Button>
              <Button asChild className="flex items-center gap-2">
                <a href="https://wa.me/556599999999" target="_blank" rel="noopener noreferrer">
                  <MessageSquare className="h-4 w-4" />
                  WhatsApp
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <MadeWithDyad />
    </div>
  );
}