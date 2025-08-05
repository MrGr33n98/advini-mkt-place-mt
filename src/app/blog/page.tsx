import { NavigationMenu } from "../navigation-menu";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Search, Tag, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Dados mockados para os artigos do blog
const blogPosts = [
  {
    id: "1",
    title: "Entendendo o Novo Código de Processo Civil",
    excerpt: "Uma análise detalhada das principais mudanças e como elas afetam os processos judiciais no Brasil.",
    author: "Dr. João da Silva",
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
    author: "Dra. Maria Oliveira",
    date: "2024-04-10",
    readTime: "6 min",
    category: "Direito do Consumidor",
    tags: ["E-commerce", "Proteção", "Direitos"],
    image: "/blog/post2.jpg",
    slug: "direitos-consumidor-compras-online"
  },
  {
    id: "3",
    title: "Guarda Compartilhada: O Que Você Precisa Saber",
    excerpt: "Um guia completo sobre a guarda compartilhada, seus benefícios e como funciona na prática.",
    author: "Dr. Carlos Pereira",
    date: "2024-04-05",
    readTime: "10 min",
    category: "Direito de Família",
    tags: ["Guarda Compartilhada", "Divórcio", "Filhos"],
    image: "/blog/post3.jpg",
    slug: "guarda-compartilhada-o-que-voce-precisa-saber"
  },
  {
    id: "4",
    title: "Reforma Trabalhista: Impactos para Empregados e Empregadores",
    excerpt: "Análise dos principais pontos da reforma trabalhista e como ela afeta as relações de trabalho.",
    author: "Dra. Ana Costa",
    date: "2024-03-28",
    readTime: "12 min",
    category: "Direito Trabalhista",
    tags: ["Reforma", "CLT", "Trabalho"],
    image: "/blog/post4.jpg",
    slug: "reforma-trabalhista-impactos"
  },
  {
    id: "5",
    title: "Proteção de Dados Pessoais: LGPD na Prática",
    excerpt: "Como a Lei Geral de Proteção de Dados está mudando a forma como empresas lidam com dados pessoais.",
    author: "Dr. Lucas Martins",
    date: "2024-03-20",
    readTime: "9 min",
    category: "Direito Digital",
    tags: ["LGPD", "Privacidade", "Dados"],
    image: "/blog/post5.jpg",
    slug: "protecao-dados-pessoais-lgpd"
  },
  {
    id: "6",
    title: "Planejamento Sucessório: Protegendo o Patrimônio Familiar",
    excerpt: "A importância do planejamento sucessório para evitar conflitos e garantir a distribuição adequada de bens.",
    author: "Dra. Beatriz Lima",
    date: "2024-03-15",
    readTime: "7 min",
    category: "Direito Civil",
    tags: ["Sucessão", "Herança", "Testamento"],
    image: "/blog/post6.jpg",
    slug: "planejamento-sucessorio-patrimonio-familiar"
  }
];

// Categorias para filtro
const categories = [
  "Todos",
  "Direito Civil",
  "Direito de Família",
  "Direito Penal",
  "Direito Trabalhista",
  "Direito do Consumidor",
  "Direito Digital"
];

export default function BlogPage() {
  // Formatador de data
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Blog Jurídico
          </h1>
          <p className="text-xl text-muted-foreground">
            Artigos, dicas e novidades sobre o mundo jurídico
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <Card className="overflow-hidden">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-64 md:h-auto">
                <Image 
                  src="/blog/featured.jpg" 
                  alt={blogPosts[0].title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <Badge className="w-fit mb-4">{blogPosts[0].category}</Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">{blogPosts[0].title}</h2>
                <p className="text-muted-foreground mb-6">{blogPosts[0].excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {blogPosts[0].author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(blogPosts[0].date)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {blogPosts[0].readTime}
                  </div>
                </div>
                <Button asChild>
                  <Link href={`/blog/${blogPosts[0].slug}`}>
                    Ler Artigo Completo
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="mb-12">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar artigos..." 
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                {categories.map(category => (
                  <option key={category} value={category === "Todos" ? "" : category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {blogPosts.slice(1).map(post => (
            <Card key={post.id} className="overflow-hidden flex flex-col">
              <div className="relative h-48">
                <Image 
                  src={post.image || "/blog/default.jpg"} 
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center mb-2">
                  <Badge variant="secondary">{post.category}</Badge>
                  <span className="text-sm text-muted-foreground">{post.readTime}</span>
                </div>
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 text-sm">
                  <User className="h-3 w-3" />
                  {post.author} • {formatDate(post.date)}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2 flex-grow">
                <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="outline" asChild className="w-full">
                  <Link href={`/blog/${post.slug}`}>
                    Ler Mais
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="max-w-3xl mx-auto">
          <Card className="bg-muted/30">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Receba Novidades</CardTitle>
              <CardDescription>
                Assine nossa newsletter para receber os últimos artigos e novidades jurídicas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col sm:flex-row gap-4">
                <Input 
                  placeholder="Seu melhor email" 
                  type="email" 
                  className="flex-grow"
                  required
                />
                <Button type="submit">Assinar Newsletter</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <MadeWithDyad />
    </div>
  );
}