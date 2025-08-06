import { notFound } from 'next/navigation';
import LawyerProfileCard from '@/components/LawyerProfileCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Lawyer } from '@/types/lawyer';
import { lawyers } from '@/data/lawyers';
import { ReviewForm } from '@/components/ReviewForm';
import type { Metadata } from 'next';

function getLawyer(slug: string): Lawyer | undefined {
  return lawyers.find((l) => l.slug === slug);
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const lawyer = getLawyer(params.slug);

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

export default function LawyerProfilePage({ params }: { params: { slug: string } }) {
  const lawyer = getLawyer(params.slug);

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
          <LawyerProfileCard lawyer={lawyer} />
          
          <div className="max-w-3xl mx-auto">
            <ReviewForm lawyerId={lawyer.id} />
          </div>
        </main>
      </div>
      <MadeWithDyad />
    </div>
  );
}