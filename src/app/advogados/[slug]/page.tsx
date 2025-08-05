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

// This function fetches the data for a single lawyer
async function getLawyer(slug: string): Promise<Lawyer | null> {
  // In a real app, this would be an absolute URL to your deployed API
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';
  
  const res = await fetch(`${baseUrl}/api/advogados/${slug}`, {
    // Revalidate every hour
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return null;
  }
  
  return res.json();
}

export default async function LawyerProfilePage({ params }: LawyerProfilePageProps) {
  const lawyer = await getLawyer(params.slug);

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