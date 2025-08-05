import { NavigationMenu } from "../navigation-menu";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Card, CardContent } from "@/components/ui/card";
import { Scale, Users, Trophy, Target, Star, Quote } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const features = [
  {
    icon: Scale,
    title: "Excelência Jurídica",
    description: "Conectamos você aos melhores profissionais do direito, todos devidamente registrados na OAB."
  },
  {
    icon: Users,
    title: "Transparência",
    description: "Avaliações reais de clientes para ajudar você a fazer a melhor escolha."
  },
  {
    icon: Trophy,
    title: "Qualidade Garantida",
    description: "Todos os advogados são verificados e passam por um processo de aprovação."
  },
  {
    icon: Target,
    title: "Facilidade de Acesso",
    description: "Encontre o advogado ideal para seu caso com nossa busca inteligente e localização no mapa."
  }
];

const teamMembers = [
  {
    name: "Ana Silva",
    role: "CEO & Fundadora",
    bio: "Advogada com mais de 15 anos de experiência, Ana fundou a plataforma com o objetivo de democratizar o acesso à justiça.",
    image: "/team/ana.jpg"
  },
  {
    name: "Carlos Mendes",
    role: "CTO",
    bio: "Especialista em tecnologia com vasta experiência em desenvolvimento de plataformas digitais e inteligência artificial.",
    image: "/team/carlos.jpg"
  },
  {
    name: "Juliana Costa",
    role: "Diretora de Operações",
    bio: "Com background em gestão de projetos, Juliana garante que todos os processos da plataforma funcionem perfeitamente.",
    image: "/team/juliana.jpg"
  },
  {
    name: "Roberto Almeida",
    role: "Diretor de Marketing",
    bio: "Especialista em marketing digital com foco em aquisição de clientes e estratégias de crescimento.",
    image: "/team/roberto.jpg"
  }
];

const testimonials = [
  {
    quote: "A plataforma revolucionou a forma como encontramos advogados. Consegui um profissional excelente em minutos.",
    author: "Maria Oliveira",
    role: "Cliente",
    image: "/testimonials/maria.jpg"
  },
  {
    quote: "Como advogado, a plataforma me ajudou a expandir minha base de clientes e gerenciar minha reputação online.",
    author: "Dr. Paulo Santos",
    role: "Advogado",
    image: "/testimonials/paulo.jpg"
  },
  {
    quote: "A transparência das avaliações e a facilidade de uso fazem toda a diferença. Recomendo a todos.",
    author: "Fernanda Lima",
    role: "Cliente",
    image: "/testimonials/fernanda.jpg"
  }
];

const timeline = [
  {
    year: "2020",
    title: "Fundação",
    description: "A plataforma foi fundada com o objetivo de conectar pessoas a advogados qualificados."
  },
  {
    year: "2021",
    title: "Expansão",
    description: "Expandimos nossa base de advogados e implementamos o sistema de avaliações."
  },
  {
    year: "2022",
    title: "Inovação",
    description: "Lançamos o mapa interativo e recursos avançados de busca por especialidade."
  },
  {
    year: "2023",
    title: "Crescimento",
    description: "Alcançamos mais de 500 advogados cadastrados e 10.000 usuários ativos."
  },
  {
    year: "2024",
    title: "Presente",
    description: "Continuamos inovando com novas funcionalidades e melhorias na experiência do usuário."
  }
];

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Sobre Nós
          </h1>
          <p className="text-xl text-muted-foreground">
            Conectando pessoas a excelentes profissionais do direito em Cuiabá
          </p>
        </div>

        {/* Hero Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto mb-24">
          <div>
            <h2 className="text-3xl font-bold mb-4">Nossa Missão</h2>
            <p className="text-muted-foreground mb-6">
              Facilitar o acesso à justiça conectando pessoas que precisam de assistência jurídica a advogados qualificados em Cuiabá. Nossa plataforma foi criada para tornar essa conexão mais transparente, eficiente e confiável.
            </p>
            <p className="text-muted-foreground">
              Acreditamos que todos merecem ter acesso a serviços jurídicos de qualidade, e nossa tecnologia torna isso possível ao simplificar a busca e seleção de profissionais adequados para cada caso.
            </p>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 z-10 rounded-lg"></div>
            <Image 
              src="/images/justice.jpg" 
              alt="Justiça" 
              fill 
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Features */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">Nossos Valores</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature) => (
              <Card key={feature.title} className="border-none shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">Nossa História</h2>
          <div className="max-w-3xl mx-auto relative">
            {/* Linha vertical */}
            <div className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-[2px] bg-border -ml-[1px] md:ml-0"></div>
            
            {timeline.map((item, index) => (
              <div key={item.year} className="relative mb-12">
                <div className={`flex flex-col md:flex-row items-start gap-8 ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}>
                  {/* Círculo na linha do tempo */}
                  <div className="absolute left-0 md:left-1/2 w-8 h-8 bg-primary rounded-full -ml-[14px] md:-ml-4 z-10 flex items-center justify-center">
                    <span className="text-primary-foreground text-xs font-bold">{item.year}</span>
                  </div>
                  
                  {/* Conteúdo */}
                  <div className={`pl-12 md:pl-0 md:w-1/2 ${
                    index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'
                  }`}>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">Nossa Equipe</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member) => (
              <div key={member.name} className="text-center">
                <Avatar className="w-32 h-32 mx-auto mb-4">
                  <AvatarFallback className="text-2xl">{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-lg">{member.name}</h3>
                <p className="text-primary mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-center mb-12">O Que Dizem Sobre Nós</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.author} className="relative">
                <CardContent className="pt-12 pb-6">
                  <div className="absolute top-6 left-6">
                    <Quote className="h-8 w-8 text-primary/30" />
                  </div>
                  <p className="text-muted-foreground mb-6 relative z-10">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{testimonial.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-24 bg-muted/30 py-16 px-8 rounded-lg">
          <h2 className="text-3xl font-bold text-center mb-12">Nossos Números</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">500+</p>
              <p className="text-muted-foreground">Advogados Cadastrados</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">10k+</p>
              <p className="text-muted-foreground">Usuários Ativos</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">4.8</p>
              <p className="text-muted-foreground">Avaliação Média</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">15+</p>
              <p className="text-muted-foreground">Especialidades</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Faça Parte da Nossa História</h2>
          <p className="text-muted-foreground mb-8">
            Seja você um advogado querendo expandir sua presença online ou alguém em busca de assistência jurídica, nossa plataforma está aqui para ajudar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/signup" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
              Cadastre-se como Advogado
            </a>
            <a href="/" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
              Encontrar um Advogado
            </a>
          </div>
        </div>
      </div>
      
      <MadeWithDyad />
    </div>
  );
}