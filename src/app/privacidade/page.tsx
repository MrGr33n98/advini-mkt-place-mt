import { NavigationMenu } from "../navigation-menu";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-6">Política de Privacidade</h1>
          <p className="text-muted-foreground mb-8">
            Última atualização: 01 de Maio de 2024
          </p>

          <div className="prose dark:prose-invert max-w-none">
            <p>
              A "Encontre seu Advogado" está comprometida em proteger sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações pessoais quando você utiliza nossa plataforma.
            </p>

            <h2>1. Informações que Coletamos</h2>
            <p>
              Podemos coletar os seguintes tipos de informações:
            </p>
            <h3>1.1. Informações que você nos fornece:</h3>
            <ul>
              <li>Informações de cadastro: nome, endereço de e-mail, número de telefone, etc.</li>
              <li>Para advogados: número da OAB, especialidades, biografia profissional, etc.</li>
              <li>Conteúdo gerado pelo usuário: avaliações, comentários, mensagens, etc.</li>
              <li>Informações de pagamento (para advogados com planos pagos).</li>
            </ul>

            <h3>1.2. Informações coletadas automaticamente:</h3>
            <ul>
              <li>Dados de uso: como você interage com nossa plataforma, páginas visitadas, tempo gasto, etc.</li>
              <li>Informações do dispositivo: tipo de dispositivo, sistema operacional, navegador, etc.</li>
              <li>Informações de localização: com seu consentimento, podemos coletar sua localização precisa para mostrar advogados próximos a você.</li>
              <li>Cookies e tecnologias semelhantes: usamos cookies e outras tecnologias para melhorar sua experiência e coletar informações sobre como você usa nossa plataforma.</li>
            </ul>

            <h2>2. Como Usamos Suas Informações</h2>
            <p>
              Utilizamos suas informações para:
            </p>
            <ul>
              <li>Fornecer, manter e melhorar nossa plataforma;</li>
              <li>Processar transações e gerenciar contas de usuários;</li>
              <li>Conectar usuários a advogados relevantes;</li>
              <li>Enviar comunicações relacionadas ao serviço, incluindo confirmações, atualizações, alertas de segurança, etc.;</li>
              <li>Responder a solicitações, perguntas e comentários;</li>
              <li>Monitorar e analisar tendências, uso e atividades relacionadas à nossa plataforma;</li>
              <li>Detectar, investigar e prevenir atividades fraudulentas e não autorizadas;</li>
              <li>Personalizar e melhorar sua experiência na plataforma;</li>
              <li>Cumprir obrigações legais.</li>
            </ul>

            <h2>3. Compartilhamento de Informações</h2>
            <p>
              Podemos compartilhar suas informações nas seguintes circunstâncias:
            </p>
            <ul>
              <li>Com outros usuários da plataforma, conforme necessário para fornecer o serviço (por exemplo, compartilhando informações de contato de advogados com usuários interessados);</li>
              <li>Com prestadores de serviços terceirizados que realizam serviços em nosso nome (processamento de pagamentos, hospedagem, análise de dados, etc.);</li>
              <li>Para cumprir com obrigações legais, como responder a intimações ou ordens judiciais;</li>
              <li>Para proteger os direitos, propriedade ou segurança da "Encontre seu Advogado", nossos usuários ou o público;</li>
              <li>Em conexão com uma transação corporativa, como uma fusão, venda de ativos ou aquisição.</li>
            </ul>

            <h2>4. Seus Direitos e Escolhas</h2>
            <p>
              De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem os seguintes direitos:
            </p>
            <ul>
              <li>Acesso: Você pode solicitar uma cópia das informações pessoais que mantemos sobre você.</li>
              <li>Retificação: Você pode solicitar a correção de informações imprecisas ou incompletas.</li>
              <li>Exclusão: Você pode solicitar a exclusão de suas informações pessoais em determinadas circunstâncias.</li>
              <li>Restrição: Você pode solicitar que restrinjamos o processamento de suas informações pessoais em determinadas circunstâncias.</li>
              <li>Portabilidade: Você pode solicitar uma cópia eletrônica de suas informações pessoais para transferi-las para outro serviço.</li>
              <li>Oposição: Você pode se opor ao processamento de suas informações pessoais em determinadas circunstâncias.</li>
            </ul>
            <p>
              Para exercer qualquer um desses direitos, entre em contato conosco através do e-mail: privacidade@encontreseuadvogado.com.br
            </p>

            <h2>5. Segurança das Informações</h2>
            <p>
              Implementamos medidas de segurança técnicas, administrativas e físicas projetadas para proteger suas informações pessoais contra acesso não autorizado, uso indevido ou divulgação. No entanto, nenhum método de transmissão pela Internet ou método de armazenamento eletrônico é 100% seguro. Portanto, embora nos esforcemos para usar meios comercialmente aceitáveis para proteger suas informações pessoais, não podemos garantir sua segurança absoluta.
            </p>

            <h2>6. Retenção de Dados</h2>
            <p>
              Mantemos suas informações pessoais pelo tempo necessário para cumprir os propósitos descritos nesta Política de Privacidade, a menos que um período de retenção mais longo seja exigido ou permitido por lei.
            </p>

            <h2>7. Transferências Internacionais de Dados</h2>
            <p>
              Suas informações pessoais podem ser transferidas e processadas em países diferentes do país em que você reside. Esses países podem ter leis de proteção de dados diferentes das leis do seu país. Ao usar nossa plataforma, você concorda com a transferência de suas informações para esses países.
            </p>

            <h2>8. Crianças</h2>
            <p>
              Nossa plataforma não é destinada a menores de 18 anos. Não coletamos intencionalmente informações pessoais de crianças. Se você é pai ou responsável e acredita que seu filho nos forneceu informações pessoais, entre em contato conosco para que possamos tomar as medidas necessárias para remover essas informações.
            </p>

            <h2>9. Alterações nesta Política de Privacidade</h2>
            <p>
              Podemos atualizar esta Política de Privacidade periodicamente. A versão mais recente estará sempre disponível em nossa plataforma, com a data da última atualização. Recomendamos que você revise esta Política de Privacidade regularmente para estar informado sobre como estamos protegendo suas informações.
            </p>

            <h2>10. Contato</h2>
            <p>
              Se você tiver dúvidas ou preocupações sobre esta Política de Privacidade ou nossas práticas de privacidade, entre em contato conosco pelo e-mail: privacidade@encontreseuadvogado.com.br
            </p>
          </div>

          <Separator className="my-8" />

          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Também recomendamos a leitura dos nossos Termos de Uso
            </p>
            <Link href="/termos" className="text-primary hover:underline">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
      
      <MadeWithDyad />
    </div>
  );
}