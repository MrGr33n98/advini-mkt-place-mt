import { notFound } from 'next/navigation';
import LawyerProfileCard from '@/components/LawyerProfileCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Lawyer } from '@/types/lawyer';
import { lawyers } from '@/data/lawyers';

interface LawyerProfilePageProps {
  params: {
    slug: string;
  };
}

// This function tells Next.js which pages to pre-render at build time
export async function generateStaticParams() {
  return lawyers.map((lawyer) => ({
    slug: lawyer.slug,
  }));
}

// This function gets the data for a single lawyer directly from the data source.
// This is more efficient than the server fetching from its own API route.
function getLawyer(slug: string): Lawyer | undefined {
  return lawyers.find((l) => l.slug === slug);
}

export default function LawyerProfilePage({ params }: LawyerProfilePageProps) {
  const lawyer = getLawyer(params.slug);

  if (!lawyer) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background font-[family-name:var(--font-geist-sans)]">
      <div className="container mx-auto p-4 sm:p-8">
        <header className="mb-8">
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para o mapa
            </Link>
          </Button>
        </header>

        <main>
          <LawyerProfileCard lawyer={lawyer} />
        </main>
      </div>
      <MadeWithDyad />
    </div>
  );
}