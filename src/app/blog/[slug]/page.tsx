import { NavigationMenu } from "../../navigation-menu";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Facebook, Linkedin, Twitter, User, Share2, Bookmark, ThumbsUp, MessageSquare, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";

// Dados mockados para os artigos do blog
const blogPosts = [
  {
    id: "1",
    title: "Entendendo o Novo Código de Processo Civil",
    excerpt: "Uma análise detalhada das principais mudanças e como elas afetam os processos judiciais no Brasil.",
    content: `
      <p>O Código de Processo Civil (CPC) é um conjunto de normas que regulam o processo judicial civil no Brasil. Em 2015, entrou em vigor o novo CPC, trazendo diversas mudanças significativas para o sistema jurídico brasileiro.</p>
      
      <h2>Principais Mudanças</h2>
      
      <p>Entre as principais mudanças introduzidas pelo novo CPC, destacam-se:</p>
      
      <ul>
        <li><strong>Estímulo à conciliação e mediação:</strong> O novo código prioriza a resolução consensual de conflitos, estabelecendo uma audiência de conciliação ou mediação como etapa obrigatória antes do início do processo contencioso.</li>
        <li><strong>Sistema de precedentes:</strong> Foi instituído um sistema de precedentes judiciais, visando garantir maior segurança jurídica e uniformidade nas decisões.</li>
        <li><strong>Cooperação processual:</strong> O princípio da cooperação entre as partes e o juiz foi estabelecido como norma fundamental do processo civil.</li>
        <li><strong>Simplificação procedimental:</strong> Houve uma simplificação dos procedimentos, com a redução do número de recursos e a eliminação de formalidades desnecessárias.</li>
      </ul>
      
      <h2>Impactos Práticos</h2>
      
      <p>Na prática, essas mudanças têm gerado diversos impactos no dia a dia forense:</p>
      
      <ol>
        <li>Redução do tempo de tramitação dos processos, graças à simplificação procedimental e ao estímulo à conciliação.</li>
        <li>Maior previsibilidade das decisões judiciais, em razão do sistema de precedentes.</li>
        <li>Ampliação do acesso à justiça, com a simplificação de procedimentos e a redução de custos.</li>
        <li>Maior participação das partes na construção da solução do litígio, por meio da cooperação processual.</li>
      </ol>
      
      <h2>Desafios e Perspectivas</h2>
      
      <p>Apesar dos avanços, o novo CPC ainda enfrenta desafios em sua implementação. A cultura jurídica brasileira, tradicionalmente formalista e litigiosa, tem dificuldade em se adaptar a um modelo mais cooperativo e consensual.</p>
      
      <p>Além disso, a efetividade do sistema de precedentes depende de uma mudança de mentalidade dos operadores do direito, que precisam valorizar a jurisprudência e buscar a uniformização das decisões.</p>
      
      <p>No entanto, as perspectivas são positivas. Gradualmente, o novo CPC tem contribuído para a modernização do sistema judicial brasileiro, tornando-o mais eficiente, acessível e justo.</p>
      
      <h2>Conclusão</h2>
      
      <p>O novo Código de Processo Civil representa um importante avanço para o sistema jurídico brasileiro. Suas inovações, voltadas para a simplificação, a cooperação e a valorização dos precedentes, têm o potencial de transformar a justiça civil no país, tornando-a mais célere, previsível e acessível.</p>
      
      <p>É fundamental que advogados, juízes e demais operadores do direito se adaptem a essa nova realidade, contribuindo para a efetiva implementação das mudanças introduzidas pelo código.</p>
    `,
    author: "Dr. João da Silva",
    authorBio: "Advogado especialista em Direito Civil com mais de 15 anos de experiência. Professor universitário e autor de diversos artigos jurídicos.",
    date: "2024-04-15",
    readTime: "8 min",
    category: "Direito Civil",
    tags: ["Processo Civil", "Legislação", "Reforma"],
    image: "/blog/post1.jpg",
    slug: "entendendo-novo-codigo-processo-civil"
  },
  {
    id: "2",
    title: "Direitos do Consumidor em Compras Online",
    excerpt: "Conheça seus direitos ao realizar compras pela internet e saiba como se proteger de fraudes e problemas.",
    content: `
      <p>Com o crescimento do comércio eletrônico, é fundamental que os consumidores conheçam seus direitos ao realizar compras online. O Código de Defesa do Consumidor (CDC) se aplica integralmente às relações de consumo pela internet, garantindo proteção contra práticas abusivas.</p>
      
      <h2>Direito de Arrependimento</h2>
      
      <p>Um dos principais direitos do consumidor em compras online é o direito de arrependimento. Segundo o artigo 49 do CDC, o consumidor pode desistir da compra no prazo de 7 dias, contados a partir do recebimento do produto ou da assinatura do contrato, sem necessidade de justificativa.</p>
      
      <p>Nesse caso, o valor pago deve ser integralmente devolvido, incluindo as despesas com frete.</p>
      
      <h2>Informações Claras e Precisas</h2>
      
      <p>Os sites de e-commerce devem fornecer informações claras e precisas sobre os produtos e serviços oferecidos, incluindo:</p>
      
      <ul>
        <li>Características do produto</li>
        <li>Preço (à vista e parcelado)</li>
        <li>Despesas com frete</li>
        <li>Prazo de entrega</li>
        <li>Política de troca e devolução</li>
        <li>Dados do fornecedor (CNPJ, endereço físico, etc.)</li>
      </ul>
      
      <h2>Proteção contra Fraudes</h2>
      
      <p>Para se proteger contra fraudes em compras online, recomenda-se:</p>
      
      <ol>
        <li>Verificar a reputação da loja em sites de reclamação</li>
        <li>Conferir se o site possui certificado de segurança (cadeado na barra de endereço)</li>
        <li>Evitar compras em sites que só aceitam pagamento por transferência bancária</li>
        <li>Guardar todos os comprovantes e registros da compra</li>
        <li>Utilizar cartões virtuais ou sistemas de pagamento seguros</li>
      </ol>
      
      <h2>Problemas Comuns e Soluções</h2>
      
      <p><strong>Atraso na entrega:</strong> Se o prazo de entrega não for cumprido, o consumidor pode exigir o cumprimento forçado da obrigação, aceitar outro produto equivalente ou cancelar a compra com devolução integral dos valores pagos.</p>
      
      <p><strong>Produto com defeito:</strong> O fornecedor tem 30 dias para sanar o problema. Caso não o faça, o consumidor pode exigir a substituição do produto, a devolução do dinheiro ou o abatimento proporcional do preço.</p>
      
      <p><strong>Produto diferente do anunciado:</strong> O consumidor pode recusar o recebimento ou devolver o produto, exigindo a entrega do item correto ou o cancelamento da compra.</p>
      
      <h2>Órgãos de Defesa do Consumidor</h2>
      
      <p>Em caso de problemas, o consumidor pode recorrer a:</p>
      
      <ul>
        <li>Procon</li>
        <li>Plataforma consumidor.gov.br</li>
        <li>Juizados Especiais Cíveis</li>
        <li>Defensoria Pública</li>
      </ul>
      
      <h2>Conclusão</h2>
      
      <p>Conhecer seus direitos é fundamental para realizar compras online com segurança. O Código de Defesa do Consumidor oferece ampla proteção, mas é importante que o consumidor esteja atento e tome precauções para evitar problemas.</p>
      
      <p>Em caso de dúvidas ou problemas, não hesite em buscar orientação jurídica especializada.</p>
    `,
    author: "Dra. Maria Oliveira",
    authorBio: "Advogada especializada em Direito do Consumidor. Membro da Comissão de Defesa do Consumidor da OAB-MT.",
    date: "2024-04-10",
    readTime: "6 min",
    category: "Direito do Consumidor",
    tags: ["E-commerce", "Proteção", "Direitos"],
    image: "/blog/post2.jpg",
    slug: "direitos-consumidor-compras-online"
  }
];

// Artigos relacionados
const relatedPosts = [
  {
    id: "3",
    title: "Guarda Compartilhada: O Que Você Precisa Saber",
    excerpt: "Um guia completo sobre a guarda compartilhada, seus benefícios e como funciona na prática.",
    author: "Dr. Carlos Pereira",
    date: "2024-04-05",
    category: "Direito de Família",
    image: "/blog/post3.jpg",
    slug: "guarda-compartilhada-o-que-voce-precisa-saber"
  },
  {
    id: "4",
    title: "Reforma Trabalhista: Impactos para Empregados e Empregadores",
    excerpt: "Análise dos principais pontos da reforma trabalhista e como ela afeta as relações de trabalho.",
    author: "Dra. Ana Costa",
    date: "2024-03-28",
    category: "Direito Trabalhista",
    image: "/blog/post4.jpg",
    slug: "reforma-trabalhista-impactos"
  },
  {
    id: "5",
    title: "Proteção de Dados Pessoais: LGPD na Prática",
    excerpt: "Como a Lei Geral de Proteção de Dados está mudando a forma como empresas lidam com dados pessoais.",
    author: "Dr. Lucas Martins",
    date: "2024-03-20",
    category: "Direito Digital",
    image: "/blog/post5.jpg",
    slug: "protecao-dados-pessoais-lgpd"
  }
];

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find(post => post.slug === slug);
  
  if (!post) {
    return {
      title: "Artigo não encontrado",
    };
  }

  return {
    title: `${post.title} - Blog JurisConnect`,
    description: post.excerpt,
    keywords: `${post.category}, ${post.tags.join(', ')}, advocacia, direito`,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  
  // Encontrar o post pelo slug
  const post = blogPosts.find(post => post.slug === slug);
  
  // Se o post não for encontrado, retornar 404
  if (!post) {
    notFound();
  }

  // Formatador de data
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8">
            <nav className="flex text-sm text-muted-foreground">
              <Link href="/" className="hover:text-primary">Início</Link>
              <span className="mx-2">/</span>
              <Link href="/blog" className="hover:text-primary">Blog</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">{post.title}</span>
            </nav>
          </div>

          {/* Article Header */}
          <div className="mb-8">
            <Badge className="mb-4">{post.category}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
            <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {post.author}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(post.date)}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {post.readTime} de leitura
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative h-[400px] mb-8 rounded-lg overflow-hidden">
            <Image 
              src={post.image || "/blog/default.jpg"} 
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
          </div>

          {/* Social Share */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Bookmark className="h-4 w-4 mr-2" />
                Salvar
              </Button>
            </div>
          </div>

          {/* Article Content */}
          <div className="prose dark:prose-invert max-w-none mb-12" dangerouslySetInnerHTML={{ __html: post.content }} />

          {/* Tags */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <Badge key={tag} variant="outline" className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Article Actions */}
          <div className="flex justify-between items-center mb-8">
            <Button variant="outline" className="flex items-center gap-2">
              <ThumbsUp className="h-4 w-4" />
              <span>Útil</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Comentar</span>
            </Button>
          </div>

          <Separator className="mb-8" />

          {/* Author Bio */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Sobre o Autor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
                <Avatar className="h-16 w-16">
                  <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold mb-2">{post.author}</h3>
                  <p className="text-muted-foreground">{post.authorBio}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Articles */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Artigos Relacionados</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map(relatedPost => (
                <Card key={relatedPost.id} className="overflow-hidden">
                  <div className="relative h-40">
                    <Image 
                      src={relatedPost.image || "/blog/default.jpg"} 
                      alt={relatedPost.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <Badge variant="secondary" className="w-fit mb-2">{relatedPost.category}</Badge>
                    <CardTitle className="text-lg">{relatedPost.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" asChild className="w-full">
                      <Link href={`/blog/${relatedPost.slug}`}>
                        Ler Artigo
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Back to Blog */}
          <div className="text-center">
            <Button asChild>
              <Link href="/blog">
                Voltar para o Blog
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      <MadeWithDyad />
    </div>
  );
}