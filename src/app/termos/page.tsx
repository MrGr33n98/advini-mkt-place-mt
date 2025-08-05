import { NavigationMenu } from "../navigation-menu";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight mb-6">Termos de Uso</h1>
          <p className="text-muted-foreground mb-8">
            Última atualização: 01 de Maio de 2024
          </p>

          <div className="prose dark:prose-invert max-w-none">
            <h2>1. Aceitação dos Termos</h2>
            <p>
              Ao acessar e utilizar a plataforma "Encontre seu Advogado", você concorda em cumprir e ficar vinculado aos seguintes termos e condições de uso. Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.
            </p>

            <h2>2. Descrição do Serviço</h2>
            <p>
              A plataforma "Encontre seu Advogado" é um serviço online que conecta pessoas que precisam de assistência jurídica a advogados qualificados em Cuiabá-MT. Nosso objetivo é facilitar o acesso à justiça, permitindo que os usuários encontrem o profissional ideal para seu caso específico.
            </p>

            <h2>3. Cadastro e Conta</h2>
            <p>
              3.1. Para utilizar determinados recursos da plataforma, pode ser necessário criar uma conta.
            </p>
            <p>
              3.2. Você é responsável por manter a confidencialidade de suas credenciais de login e por todas as atividades que ocorrerem em sua conta.
            </p>
            <p>
              3.3. Você concorda em fornecer informações precisas, atuais e completas durante o processo de registro e em atualizar essas informações para mantê-las precisas, atuais e completas.
            </p>

            <h2>4. Uso da Plataforma</h2>
            <p>
              4.1. Você concorda em utilizar a plataforma apenas para fins legais e de acordo com estes termos.
            </p>
            <p>
              4.2. Você não deve:
            </p>
            <ul>
              <li>Utilizar a plataforma de qualquer maneira que possa danificar, desabilitar, sobrecarregar ou prejudicar o site;</li>
              <li>Utilizar qualquer robô, spider, ou outro dispositivo automático para acessar a plataforma;</li>
              <li>Introduzir vírus, cavalos de Troia, worms, bombas lógicas ou outro material malicioso;</li>
              <li>Tentar obter acesso não autorizado à plataforma, ao servidor em que a plataforma está armazenada ou a qualquer servidor, computador ou banco de dados conectado à plataforma;</li>
              <li>Atacar a plataforma via ataque de negação de serviço ou ataque distribuído de negação de serviço.</li>
            </ul>

            <h2>5. Conteúdo do Usuário</h2>
            <p>
              5.1. Ao enviar avaliações, comentários ou qualquer outro conteúdo para a plataforma, você concede à "Encontre seu Advogado" uma licença mundial, não exclusiva, livre de royalties, transferível e sublicenciável para usar, reproduzir, distribuir, preparar trabalhos derivados, exibir e executar esse conteúdo em conexão com os serviços fornecidos pela plataforma.
            </p>
            <p>
              5.2. Você é o único responsável por qualquer conteúdo que enviar à plataforma e pelas consequências de compartilhar esse conteúdo.
            </p>
            <p>
              5.3. Você não deve enviar conteúdo que:
            </p>
            <ul>
              <li>Seja ilegal, difamatório, obsceno, ofensivo, ameaçador, abusivo, invasivo da privacidade de outra pessoa, odioso, racialmente ou etnicamente ofensivo;</li>
              <li>Infrinja direitos autorais, marcas registradas ou outros direitos de propriedade intelectual;</li>
              <li>Contenha vírus, dados corrompidos ou outros arquivos prejudiciais;</li>
              <li>Constitua publicidade não solicitada ou não autorizada.</li>
            </ul>

            <h2>6. Propriedade Intelectual</h2>
            <p>
              6.1. A plataforma "Encontre seu Advogado" e seu conteúdo original, recursos e funcionalidades são e permanecerão propriedade exclusiva da empresa e de seus licenciadores.
            </p>
            <p>
              6.2. A plataforma é protegida por direitos autorais, marcas registradas e outras leis de propriedade intelectual do Brasil e de outros países.
            </p>

            <h2>7. Links para Outros Sites</h2>
            <p>
              Nossa plataforma pode conter links para sites de terceiros que não são de propriedade ou controlados pela "Encontre seu Advogado". Não temos controle e não assumimos responsabilidade pelo conteúdo, políticas de privacidade ou práticas de sites de terceiros. Você reconhece e concorda que a "Encontre seu Advogado" não será responsável, direta ou indiretamente, por qualquer dano ou perda causada ou alegadamente causada por ou em conexão com o uso ou confiança em qualquer conteúdo, bens ou serviços disponíveis em ou através de tais sites.
            </p>

            <h2>8. Limitação de Responsabilidade</h2>
            <p>
              8.1. A "Encontre seu Advogado" não será responsável por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo perda de lucros, dados, uso, boa vontade ou outras perdas intangíveis, resultantes do seu acesso ou uso ou incapacidade de acessar ou usar a plataforma.
            </p>
            <p>
              8.2. A "Encontre seu Advogado" atua apenas como intermediária entre usuários e advogados e não é responsável pela qualidade dos serviços prestados pelos advogados listados na plataforma.
            </p>

            <h2>9. Indenização</h2>
            <p>
              Você concorda em defender, indenizar e isentar a "Encontre seu Advogado", seus diretores, funcionários e agentes de e contra quaisquer reclamações, danos, obrigações, perdas, responsabilidades, custos ou dívidas e despesas (incluindo, mas não se limitando a honorários advocatícios) decorrentes de: (i) seu uso e acesso à plataforma; (ii) sua violação de qualquer termo destes Termos de Uso; (iii) sua violação de quaisquer direitos de terceiros, incluindo, sem limitação, quaisquer direitos autorais, de propriedade ou de privacidade.
            </p>

            <h2>10. Modificações dos Termos</h2>
            <p>
              A "Encontre seu Advogado" reserva-se o direito, a seu exclusivo critério, de modificar ou substituir estes Termos a qualquer momento. Se uma revisão for material, tentaremos fornecer um aviso com pelo menos 30 dias de antecedência antes que quaisquer novos termos entrem em vigor. O que constitui uma alteração material será determinado a nosso exclusivo critério.
            </p>

            <h2>11. Lei Aplicável</h2>
            <p>
              Estes Termos serão regidos e interpretados de acordo com as leis do Brasil, sem consideração aos seus conflitos de princípios legais.
            </p>

            <h2>12. Contato</h2>
            <p>
              Se você tiver alguma dúvida sobre estes Termos, entre em contato conosco pelo e-mail: contato@encontreseuadvogado.com.br
            </p>
          </div>

          <Separator className="my-8" />

          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Também recomendamos a leitura da nossa Política de Privacidade
            </p>
            <Link href="/privacidade" className="text-primary hover:underline">
              Política de Privacidade
            </Link>
          </div>
        </div>
      </div>
      
      <MadeWithDyad />
    </div>
  );
}