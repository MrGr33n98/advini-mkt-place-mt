import { notFound } from 'next/navigation';
import { EnhancedLawyerProfileCard } from '@/components/EnhancedLawyerProfileCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { ArrowLeft, Calendar } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Lawyer } from '@/types/lawyer';
import { lawyers } from '@/data/lawyers';
import { ReviewForm } from '@/components/ReviewForm';
import { ContactForm } from '@/components/ContactForm';
import { QuoteRequestForm } from '@/components/QuoteRequestForm';
import type { Metadata } from 'next';

function getLawyer(slug: string): Lawyer | undefined {
  return lawyers.find((l) => l.slug === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lawyer = getLawyer(slug);

  if (!lawyer) {
    return {
      title: "Advogado não encontrado",
      description: "A página que você está procurando não existe.",
    };
  }

  return {
    title: `${lawyer.name} | Advogado(a) em Cuiabá-MT`,
    description: `Perfil de ${lawyer.name}, especialista em ${lawyer.specialties.join(', ')}. Encontre informações de contato, avaliações e mais.`,
  };
}

export function generateStaticParams(): { slug: string }[] {
  return lawyers.map((lawyer) => ({
    slug: lawyer.slug,
  }));
}

export default async function LawyerProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lawyer = getLawyer(slug);

  if (!lawyer) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="container mx-auto p-4 sm:p-8">
        <header className="mb-8">
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para a busca
            </Link>
          </Button>
        </header>

        <main className="space-y-8">
          <EnhancedLawyerProfileCard lawyer={lawyer} />
          
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link href={`/agendar/${lawyer.id}`}>
                  <Calendar className="mr-2 h-5 w-5" />
                  Agendar Consulta
                </Link>
              </Button>
            </div>
            
            <Tabs defaultValue="contact" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="contact">Contato Direto</TabsTrigger>
                <TabsTrigger value="quote">Solicitar Orçamento</TabsTrigger>
                <TabsTrigger value="review">Avaliar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="contact" className="mt-6">
                <ContactForm lawyer={lawyer} />
              </TabsContent>
              
              <TabsContent value="quote" className="mt-6">
                <QuoteRequestForm lawyer={lawyer} />
              </TabsContent>
              
              <TabsContent value="review" className="mt-6">
                <ReviewForm lawyerId={lawyer.id} />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      <MadeWithDyad />
    </div>
  );
}